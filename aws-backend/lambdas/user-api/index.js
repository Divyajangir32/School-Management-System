/**
 * AWS Lambda Function: user-api
 * Green Valley Public School, Jalandhar
 * Handles RBAC User Accounts & Role Management with DynamoDB
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'ap-south-1' });
const ddb = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.USERS_TABLE || 'GVPS_Users';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
};

exports.handler = async (event) => {
  console.log('User API event:', JSON.stringify(event, null, 2));
  const method = event.httpMethod;
  const pathParams = event.pathParameters || {};
  const id = pathParams.id;

  // Extract caller role from Cognito Claims
  const claims = event.requestContext?.authorizer?.claims || {};
  const callerRole = claims['custom:role'] || claims['cognito:groups'] || 'Super Admin';

  try {
    if (method === 'OPTIONS') {
      return { statusCode: 200, headers, body: '' };
    }

    // RBAC: Only Super Admin and Admin can manage or view all users
    const allowedRoles = ['Super Admin', 'Admin'];
    const isAuthorized = Array.isArray(callerRole) 
      ? callerRole.some(r => allowedRoles.includes(r))
      : allowedRoles.includes(callerRole);

    if (!isAuthorized && callerRole !== 'Principal') {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ message: 'Forbidden: Insufficient privileges for User Administration' })
      };
    }

    if (method === 'GET') {
      if (id) {
        const result = await ddb.send(new GetCommand({
          TableName: TABLE_NAME,
          Key: { id }
        }));
        if (!result.Item) {
          return { statusCode: 404, headers, body: JSON.stringify({ message: 'User not found' }) };
        }
        const { password, ...safeUser } = result.Item;
        return { statusCode: 200, headers, body: JSON.stringify(safeUser) };
      } else {
        const result = await ddb.send(new ScanCommand({ TableName: TABLE_NAME }));
        const safeUsers = (result.Items || []).map(({ password, ...u }) => u);
        return { statusCode: 200, headers, body: JSON.stringify(safeUsers) };
      }
    }

    if (method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      if (!body.email || !body.name || !body.role) {
        return { statusCode: 400, headers, body: JSON.stringify({ message: 'Name, email, and role are required' }) };
      }

      // Admin cannot create Super Admin
      if (body.role === 'Super Admin' && callerRole !== 'Super Admin') {
        return { statusCode: 403, headers, body: JSON.stringify({ message: 'Only Super Admin can provision another Super Admin' }) };
      }

      const userId = body.id || `USR-${Date.now()}`;
      const item = {
        ...body,
        id: userId,
        status: body.status || 'Active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
      const { password, ...safeItem } = item;
      return { statusCode: 201, headers, body: JSON.stringify(safeItem) };
    }

    if (method === 'PUT') {
      if (!id) {
        return { statusCode: 400, headers, body: JSON.stringify({ message: 'ID path parameter is required' }) };
      }
      const body = JSON.parse(event.body || '{}');

      // Fetch existing user to enforce RBAC protections
      const existing = await ddb.send(new GetCommand({ TableName: TABLE_NAME, Key: { id } }));
      if (existing.Item && existing.Item.role === 'Super Admin' && callerRole !== 'Super Admin') {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ message: 'Admin cannot modify Super Admin account' })
        };
      }

      const updated = {
        ...(existing.Item || {}),
        ...body,
        id,
        updatedAt: new Date().toISOString()
      };
      await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: updated }));
      const { password, ...safeUser } = updated;
      return { statusCode: 200, headers, body: JSON.stringify(safeUser) };
    }

    if (method === 'DELETE') {
      if (!id) {
        return { statusCode: 400, headers, body: JSON.stringify({ message: 'ID path parameter is required' }) };
      }
      const existing = await ddb.send(new GetCommand({ TableName: TABLE_NAME, Key: { id } }));
      if (existing.Item && existing.Item.role === 'Super Admin') {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ message: 'Super Admin accounts cannot be deleted' })
        };
      }
      await ddb.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { id } }));
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, id }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  } catch (err) {
    console.error('User API error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || 'Internal Server Error' })
    };
  }
};
