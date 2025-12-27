import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {  APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda";
import * as dotenv from "dotenv";
dotenv.config();

import {
  DynamoDBDocumentClient,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ 
  region: "us-east-1"
  // region: "local",
  // endpoint: "http://localhost:8000",
 });
const docClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.TABLE_NAME;
console.log({tableName})

export const getUserhandler = async(event:APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> => {
   let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
      console.log({http:event.requestContext.http.method})
    console.log("getting item")
        body= await docClient.send(
            new ScanCommand({
                TableName: tableName,
            })
        )
body = body.Items;
console.log("this is the GET body",{body})

  }catch(err:any) {
      statusCode = 400;
    body = err.message;
  }  finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  }
  
}