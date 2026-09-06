/**
 * AWS Lambda Function: fee-api
 * Green Valley Public School, Jalandhar
 * Handles student fee records & receipts in Amazon DynamoDB
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'ap-south-1' });
const ddb = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.FEES_TABLE || 'GVPS_Fees';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
};

exports.handler = async (event) => {
  const method = event.httpMethod;
  const pathParams = event.pathParameters || {};
  const id = pathParams.id;

  try {
    if (method === 'OPTIONS') return { statusCode: 200, headers, body: '' };

    if (method === 'GET') {
      const res = await ddb.send(new ScanCommand({ TableName: TABLE_NAME }));
      return { statusCode: 200, headers, body: JSON.stringify(res.Items || []) };
    }

    if (method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const feeId = body.id || `FEE-${Date.now()}`;
      const item = { ...body, id: feeId, createdAt: new Date().toISOString() };
      await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
      return { statusCode: 201, headers, body: JSON.stringify(item) };
    }

    if (method === 'PUT') {
      if (!id) return { statusCode: 400, headers, body: JSON.stringify({ message: 'Missing ID' }) };
      const body = JSON.parse(event.body || '{}');
      const item = { ...body, id, updatedAt: new Date().toISOString() };
      await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
      return { statusCode: 200, headers, body: JSON.stringify(item) };
    }

    if (method === 'DELETE') {
      if (!id) return { statusCode: 400, headers, body: JSON.stringify({ message: 'Missing ID' }) };
      await ddb.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { id } }));
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, id }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  } catch (err) {
    console.error('Fee API error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
