import { handler } from "./src/users/putUser";
i

async function main() {
    const event = {
        httpMethod:"POST /users",
        path:"/users",
        body: JSON.stringify({
            name: "Damilola",
            email: "damilola@fakorededamilola.com",
        })
    } as any;

    const res = await handler(event, {} as any)
    console.log({statusCode: res.statusCode, body: res.body})
}

main().catch(console.error)