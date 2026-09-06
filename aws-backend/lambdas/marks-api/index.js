/**
 * AWS Lambda Function: marks-api
 * Green Valley Public School, Jalandhar
 * Handles examination scores & grading in Amazon DynamoDB
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'ap-south-1' });
const ddb = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.MARKS_TABLE || 'GVPS_Marks';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
};

exports.handler = async (event) => {
  const method = event.httpMethod;

  try {
    if (method === 'OPTIONS') return { statusCode: 200, headers, body: '' };

    if (method === 'GET') {
      const res = await ddb.send(new ScanCommand({ TableName: TABLE_NAME }));
      return { statusCode: 200, headers, body: JSON.stringify(res.Items || []) };
    }

    if (method === 'POST') {
      const body = JSON.parse(event.body || '[]');
      const items = Array.isArray(body) ? body : [body];

      for (const item of items) {
        const markId = item.id || `MRK-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        await ddb.send(new PutCommand({
          TableName: TABLE_NAME,
          Item: { ...item, id: markId, recordedAt: new Date().toISOString() }
        }));
      }

      return { statusCode: 201, headers, body: JSON.stringify({ message: 'Marks batch updated', count: items.length }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  } catch (err) {
    console.error('Marks API error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
