import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { registerUser } from "./routes/users/handlers/registerUserHandler";
import { loginUser } from "./routes/users/handlers/loginUserHandler";
import { connectDB } from "./dbConnection";
import { getMe } from "./routes/users/handlers/getMeHandler";

export const handlerUsers = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  await connectDB();
  const path = event.path || "";
  const method = event.httpMethod || "GET";
  const body = event.body ? JSON.parse(event.body) : {};

  // Normalize path under /users
  // e.g., API Gatewpay invokes /users/register or /users/login
  console.log({path,method,body})
  if (path.match(/\/users\/register$/) && method === "POST") {
    const res = await registerUser(body);
    return { statusCode: res.statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(res.body) };
  }

  if (path.match(/\/users\/login$/) && method === "POST") {
    const res = await loginUser(body);
    return { statusCode: res.statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(res.body) };
  }

  if (path.match(/\/users\/me$/) && method === "GET") {
    const res = await getMe(event);
    return { statusCode: res.statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(res.body) };
  }

  return { statusCode: 404, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "Not found" }) };
};