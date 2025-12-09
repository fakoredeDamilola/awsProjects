import { handler } from "./src/users/getUser";

async function main() {
    const event = {
        httpMethod:"GET /users",
        path:"/users"
    } as any;

    const res = await handler(event, {} as any)
    console.log({statusCode: res.statusCode, body: res.body})
}

main().catch(console.error)