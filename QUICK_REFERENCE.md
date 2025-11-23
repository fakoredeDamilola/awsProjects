# Quick Reference Guide

## 🚀 Quick Start Commands

### Build & Deploy Everything
```bash
# 1. Build and upload Lambda Layer
cd functions/layers/common
zip -r layer.zip nodejs
aws s3 cp layer.zip s3://my-dependencies-artifacts-12345/layer.zip

# 2. Build and upload Users Lambda
cd ../../
./build-users.sh
aws s3 cp release/users.zip s3://my-user-handler-12345/event-user-domain-stack/users.zip

# 3. Build and upload Events Lambda
./build-events.sh
aws s3 cp release/events.zip s3://my-events-handler-12345/event-user-domain-stack/events.zip

# 4. Deploy CloudFormation stack
cd cfn
./deploy
```

### Update Lambda Code Only
```bash
# After making code changes
cd functions

# Update Users Lambda
./build-users.sh
aws s3 cp release/users.zip s3://my-user-handler-12345/event-user-domain-stack/users.zip
aws lambda update-function-code \
  --function-name event-user-domain-stack-users \
  --s3-bucket my-user-handler-12345 \
  --s3-key event-user-domain-stack/users.zip

# Update Events Lambda
./build-events.sh
aws s3 cp release/events.zip s3://my-events-handler-12345/event-user-domain-stack/events.zip
aws lambda update-function-code \
  --function-name event-user-domain-stack-events \
  --s3-bucket my-events-handler-12345 \
  --s3-key event-user-domain-stack/events.zip
```

---

## 📡 API Endpoints Cheat Sheet

### Base URL
```
https://{api-id}.execute-api.us-east-1.amazonaws.com/dev
```

### Users API
| Method | Endpoint | Auth Required | Body |
|--------|----------|---------------|------|
| POST | `/users/register` | No | `{name, email, password}` |
| POST | `/users/login` | No | `{email, password}` |
| GET | `/users/me` | Yes | - |

### Events API
| Method | Endpoint | Auth Required | Body |
|--------|----------|---------------|------|
| POST | `/events/create` | Yes | `{title, description, date, location}` |
| GET | `/events/all` | Yes | - |

### Example Requests
```bash
# Register
curl -X POST https://API-URL/dev/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123"}'

# Login
curl -X POST https://API-URL/dev/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"pass123"}'

# Get Profile (use token from login)
curl -X GET https://API-URL/dev/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create Event
curl -X POST https://API-URL/dev/events/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Event","description":"Test","date":"2025-12-01","location":"NYC"}'

# Get All Events
curl -X GET https://API-URL/dev/events/all \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔍 Debugging Commands

### View Lambda Logs
```bash
# Users Lambda
aws logs tail /aws/lambda/event-user-domain-stack-users --follow

# Events Lambda
aws logs tail /aws/lambda/event-user-domain-stack-events --follow
```

### Test Lambda Directly
```bash
# Test Users Lambda
aws lambda invoke \
  --function-name event-user-domain-stack-users \
  --payload '{"httpMethod":"GET","path":"/users/me","headers":{"authorization":"Bearer TOKEN"}}' \
  response.json && cat response.json

# Test Events Lambda
aws lambda invoke \
  --function-name event-user-domain-stack-events \
  --payload '{"httpMethod":"GET","path":"/events/all","headers":{"authorization":"Bearer TOKEN"}}' \
  response.json && cat response.json
```

### Check Stack Status
```bash
# View stack details
aws cloudformation describe-stacks --stack-name event-user-domain-stack

# View stack events
aws cloudformation describe-stack-events --stack-name event-user-domain-stack

# View stack resources
aws cloudformation describe-stack-resources --stack-name event-user-domain-stack
```

### Get API Gateway URL
```bash
aws cloudformation describe-stacks \
  --stack-name event-user-domain-stack \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayUrl`].OutputValue' \
  --output text
```

---

## 🗂️ Project File Structure

```
functions/
├── handle-users.ts          # Users Lambda entry
├── handle-events.ts         # Events Lambda entry
├── dbConnection.ts          # MongoDB connection
├── utils.ts                 # Shared utilities
├── routes/
│   ├── users/handlers/      # User route handlers
│   └── events/              # Event route handlers
├── schemas/                 # Mongoose models
├── cfn/
│   ├── template.yaml        # CloudFormation
│   └── deploy               # Deploy script
├── build-users.sh           # Build users
├── build-events.sh          # Build events
└── release/                 # Built artifacts
```

---

## 🔐 Environment Variables

| Variable | Description | Set In |
|----------|-------------|--------|
| `mongoURI` | MongoDB connection string | CloudFormation params |
| `jwtSecret` | JWT signing secret | CloudFormation params |
| `NODE_ENV` | Environment (production) | CloudFormation template |
| `STAGE` | API Gateway stage (dev) | CloudFormation template |

---

## 🛠️ Common Tasks

### Add New User Endpoint
1. Create handler in `routes/users/handlers/`
2. Import and add route in `handle-users.ts`
3. Rebuild: `./build-users.sh`
4. Upload: `aws s3 cp release/users.zip s3://...`
5. Update Lambda: `aws lambda update-function-code ...`

### Add New Event Endpoint
1. Create handler in `routes/events/`
2. Import and add route in `handle-events.ts`
3. Rebuild: `./build-events.sh`
4. Upload: `aws s3 cp release/events.zip s3://...`
5. Update Lambda: `aws lambda update-function-code ...`

### Update Dependencies
1. Update `package.json`
2. Run `npm install` in `functions/layers/common/nodejs/`
3. Rebuild layer: `cd functions/layers/common && zip -r layer.zip nodejs`
4. Upload: `aws s3 cp layer.zip s3://my-dependencies-artifacts-12345/`
5. Update stack: `cd cfn && ./deploy`

### Delete Everything
```bash
# Delete CloudFormation stack (deletes Lambda, API Gateway, IAM)
aws cloudformation delete-stack --stack-name event-user-domain-stack

# Delete S3 buckets (after stack deletion)
aws s3 rb s3://my-user-handler-12345 --force
aws s3 rb s3://my-events-handler-12345 --force
aws s3 rb s3://my-dependencies-artifacts-12345 --force
```

---

## 📊 Resource Names

| Resource Type | Name |
|--------------|------|
| Stack | `event-user-domain-stack` |
| Users Lambda | `event-user-domain-stack-users` |
| Events Lambda | `event-user-domain-stack-events` |
| Lambda Layer | `event-user-domain-stack-dependencies-and-func-layer` |
| IAM Role | `event-user-domain-stack-lambda-exec` |
| API Gateway | `event-user-domain-stack-api` |
| S3 Buckets | `my-user-handler-12345`<br>`my-events-handler-12345`<br>`my-dependencies-artifacts-12345` |

---

## ⚠️ Common Errors & Fixes

| Error | Fix |
|-------|-----|
| "Cannot find module" | Check Lambda Layer is attached |
| "jwt must be provided" | Add `Authorization: Bearer TOKEN` header |
| "mongoURI not set" | Verify CloudFormation parameters |
| "403 Forbidden" | Check Lambda invoke permissions |
| "CREATE_FAILED" | Check CloudFormation events for details |

---

## 📝 Important Notes

1. **Always rebuild before deploying** - TypeScript must be compiled to JavaScript
2. **Upload to S3 before updating Lambda** - Lambda pulls from S3
3. **Check CloudWatch Logs** - First place to debug issues
4. **Authorization header is case-sensitive** - Use `Authorization` or `authorization`
5. **JWT tokens don't expire** - Consider adding expiration in production
6. **CORS is wide open** - Restrict origins in production
7. **No API rate limiting** - Add usage plans for production

---

## 🎯 Testing Workflow

1. **Register a user** → Get token
2. **Login** → Verify token works
3. **Get profile** → Test authentication
4. **Create event** → Test event creation
5. **Get all events** → Verify event retrieval

---

## 📞 Support Resources

- **AWS Lambda Docs**: https://docs.aws.amazon.com/lambda/
- **API Gateway Docs**: https://docs.aws.amazon.com/apigateway/
- **CloudFormation Docs**: https://docs.aws.amazon.com/cloudformation/
- **Mongoose Docs**: https://mongoosejs.com/docs/
- **JWT Docs**: https://jwt.io/

---

**Quick Tip**: Bookmark this file for fast reference during development!
