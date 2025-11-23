# Local Testing Guide

This project uses `@vendia/serverless-express` to run Express.js on AWS Lambda. Here are the ways to test locally:

## 1. Traditional Express Server (Recommended for Development)

Run the app as a normal Express server:

```bash
npm run dev
```

This starts the server on `http://localhost:3000` with hot-reload. Test with:

```bash
curl http://localhost:3000/
curl http://localhost:3000/health
curl http://localhost:3000/api/events
```

**Pros:**
- Fast hot-reload during development
- Easy to use with Postman/Insomnia
- Standard Express debugging

**Cons:**
- Doesn't test Lambda-specific behavior

## 2. Lambda Handler Testing (Simulates AWS Lambda)

Test the actual Lambda handler with mock API Gateway events:

```bash
npm run test-lambda
```

This runs `src/local-lambda.ts` which:
- Creates mock API Gateway events
- Invokes your Lambda handler
- Shows the response structure

**Pros:**
- Tests the actual Lambda handler code
- Validates serverless-express integration
- Catches Lambda-specific issues

**Cons:**
- No hot-reload
- More verbose for quick testing

## 3. Using AWS SAM Local (Optional)

If you want to test with the full AWS Lambda runtime:

```bash
# Install AWS SAM CLI first
brew install aws-sam-cli

# Start local API Gateway
sam local start-api --template cfn/template.yaml
```

**Pros:**
- Most accurate Lambda simulation
- Tests with actual Lambda runtime

**Cons:**
- Slower startup
- Requires Docker
- More complex setup

## Architecture

```
┌─────────────┐
│   app.ts    │  ← Pure Express app (no .listen())
└──────┬──────┘
       │
       ├──────────────┬──────────────┐
       │              │              │
┌──────▼──────┐ ┌────▼─────┐ ┌──────▼────────┐
│  server.ts  │ │handler.ts│ │local-lambda.ts│
│             │ │          │ │               │
│ app.listen()│ │serverless│ │  Mock tests   │
│             │ │ -express │ │               │
└─────────────┘ └──────────┘ └───────────────┘
     Local         Lambda        Local Lambda
   Development    Production      Testing
```

## Recommended Workflow

1. **Daily development**: Use `npm run dev` for fast iteration
2. **Before deployment**: Run `npm run test-lambda` to verify Lambda compatibility
3. **After deployment**: Test the actual AWS endpoint

## Environment Variables

Make sure your `.env` file has:

```env
mongoURI=mongodb+srv://...
jwtSecret=your-secret-key
NODE_ENV=development
PORT=3000
```

For Lambda, these are set in CloudFormation template parameters.
