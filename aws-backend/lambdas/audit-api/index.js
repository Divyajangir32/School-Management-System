/**
 * AWS Lambda Function: audit-api
 * Green Valley Public School, Jalandhar
 * Handles security audit logging and retrieval in DynamoDB
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'ap-south-1' });
const ddb = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.AUDIT_LOGS_TABLE || 'GVPS_AuditLogs';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
};

exports.handler = async (event) => {
  console.log('Audit API event:', JSON.stringify(event, null, 2));
  const method = event.httpMethod;

  const claims = event.requestContext?.authorizer?.claims || {};
  const callerRole = claims['custom:role'] || claims['cognito:groups'] || 'Super Admin';

  try {
    if (method === 'OPTIONS') {
      return { statusCode: 200, headers, body: '' };
    }

    if (method === 'GET') {
      // RBAC: Only Super Admin and Admin can view system security audit logs
      const allowedRoles = ['Super Admin', 'Admin'];
      const isAuthorized = Array.isArray(callerRole)
        ? callerRole.some(r => allowedRoles.includes(r))
        : allowedRoles.includes(callerRole);

      if (!isAuthorized) {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ message: 'Forbidden: Only Administrators can inspect Security Audit Logs' })
        };
      }

      const result = await ddb.send(new ScanCommand({ TableName: TABLE_NAME }));
      // Sort descending by timestamp
      const logs = (result.Items || []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      return { statusCode: 200, headers, body: JSON.stringify(logs) };
    }

    if (method === 'POST') {
      // System or authorized user records an audit event
      const body = JSON.parse(event.body || '{}');
      if (!body.action || !body.user) {
        return { statusCode: 400, headers, body: JSON.stringify({ message: 'Action and user are required' }) };
      }

      const logId = body.id || `AUDIT-${Date.now()}-${Math.floor(Math.random()*1000)}`;
      const item = {
        ...body,
        id: logId,
        timestamp: body.timestamp || new Date().toISOString(),
        ipAddress: event.requestContext?.identity?.sourceIp || '127.0.0.1'
      };

      await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
      return { statusCode: 201, headers, body: JSON.stringify(item) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  } catch (err) {
    console.error('Audit API error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || 'Internal Server Error' })
    };
  }
};
