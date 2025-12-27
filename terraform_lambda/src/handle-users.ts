import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { putUserhandler } from "./users/putUser";
import { getUserhandler } from "./users/getUser";


export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    const path = event.rawPath || "";
  const method = event.requestContext?.http.method;
  const body = event.body ? JSON.parse(event.body) : {};


  console.log({path,method,body})
    if (method === "PUT" && path === "/users") {
        return putUserhandler(event);
    } else if (method === "GET" && path === "/users") {
        return getUserhandler(event);
    } else {
        return { statusCode: 404, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "Not found" }) };
    }
};