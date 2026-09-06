/**
 * AWS Lambda Function: library-api
 * Green Valley Public School, Jalandhar
 * Handles Library book catalog and borrowing records in DynamoDB
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'ap-south-1' });
const ddb = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.LIBRARY_TABLE || 'GVPS_Library';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
};

exports.handler = async (event) => {
  console.log('Library API event:', JSON.stringify(event, null, 2));
  const method = event.httpMethod;
  const pathParams = event.pathParameters || {};
  const id = pathParams.id;
  const path = event.path || '';

  const claims = event.requestContext?.authorizer?.claims || {};
  const callerRole = claims['custom:role'] || claims['cognito:groups'] || 'Super Admin';

  try {
    if (method === 'OPTIONS') {
      return { statusCode: 200, headers, body: '' };
    }

    if (method === 'GET') {
      if (id) {
        const result = await ddb.send(new GetCommand({
          TableName: TABLE_NAME,
          Key: { id }
        }));
        if (!result.Item) {
          return { statusCode: 404, headers, body: JSON.stringify({ message: 'Record not found' }) };
        }
        return { statusCode: 200, headers, body: JSON.stringify(result.Item) };
      } else {
        const result = await ddb.send(new ScanCommand({ TableName: TABLE_NAME }));
        return { statusCode: 200, headers, body: JSON.stringify(result.Items || []) };
      }
    }

    // Mutating library records requires Librarian, Super Admin, or Admin
    const canManage = ['Super Admin', 'Admin', 'Librarian'].includes(callerRole);
    if (!canManage) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ message: 'Forbidden: Insufficient privileges to update library catalog' })
      };
    }

    if (method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const recordId = body.id || `LIB-${Date.now()}`;
      const item = {
        ...body,
        id: recordId,
        updatedAt: new Date().toISOString()
      };
      await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
      return { statusCode: 201, headers, body: JSON.stringify(item) };
    }

    if (method === 'PUT') {
      if (!id) {
        return { statusCode: 400, headers, body: JSON.stringify({ message: 'ID is required' }) };
      }
      const body = JSON.parse(event.body || '{}');
      const item = { ...body, id, updatedAt: new Date().toISOString() };
      await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
      return { statusCode: 200, headers, body: JSON.stringify(item) };
    }

    if (method === 'DELETE') {
      if (!id) {
        return { statusCode: 400, headers, body: JSON.stringify({ message: 'ID is required' }) };
      }
      await ddb.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { id } }));
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, id }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  } catch (err) {
    console.error('Library API error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || 'Internal Server Error' })
    };
  }
};
