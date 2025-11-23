# Event Management System - AWS Serverless Architecture

## Project Overview

A serverless event management system built with **TypeScript**, **AWS Lambda**, **API Gateway**, and **MongoDB**. The system provides user authentication and event management capabilities through RESTful APIs deployed on AWS infrastructure.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [AWS Resources](#aws-resources)
3. [Project Structure](#project-structure)
4. [Domain Services](#domain-services)
5. [Infrastructure Setup](#infrastructure-setup)
6. [Deployment Process](#deployment-process)
7. [API Endpoints](#api-endpoints)
8. [Security & Authentication](#security--authentication)
9. [Environment Variables](#environment-variables)
10. [Troubleshooting Guide](#troubleshooting-guide)
11. [Future Improvements](#future-improvements)

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│      API Gateway (REST API)         │
│  - Regional Endpoint                │
│  - Stage: dev                       │
└──────┬──────────────────────────────┘
       │
       ├──────────────┬─────────────────┐
       ▼              ▼                 ▼
┌──────────┐   ┌──────────┐    ┌──────────┐
│  /users  │   │ /events  │    │    /     │
│  routes  │   │  routes  │    │  (root)  │
└────┬─────┘   └────┬─────┘    └────┬─────┘
     │              │               │
     ▼              ▼               ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   Users     │ │   Events    │ │  Default    │
│   Lambda    │ │   Lambda    │ │  Handler    │
└──────┬──────┘ └──────┬──────┘ └──────┬──────┘
       │              │               │
       └──────────────┴───────────────┘
                      │
              ┌───────▼────────┐
              │  Lambda Layer  │
              │  - mongoose    │
              │  - jwt         │
              │  - bcrypt      │
              │  - utilities   │
              └───────┬────────┘
                      │
                      ▼
              ┌───────────────┐
              │   MongoDB     │
              │   (Atlas)     │
              └───────────────┘
```

### Technology Stack

- **Runtime**: Node.js 18.x
- **Language**: TypeScript 5.3.3
- **Database**: MongoDB Atlas
- **Cloud Provider**: AWS
- **Infrastructure as Code**: CloudFormation
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt

---

## AWS Resources

### 1. Lambda Functions

#### Users Function
- **Name**: `event-user-domain-stack-users`
- **Handler**: `handle-users.handlerUsers`
- **Memory**: 1024 MB
- **Timeout**: 30 seconds
- **Purpose**: Handles user registration, login, and profile retrieval
- **S3 Location**: `s3://my-user-handler-12345/event-user-domain-stack/users.zip`

#### Events Function
- **Name**: `event-user-domain-stack-events`
- **Handler**: `handle-events.handlerEvents`
- **Memory**: 1024 MB
- **Timeout**: 30 seconds
- **Purpose**: Handles event creation and retrieval
- **S3 Location**: `s3://my-events-handler-12345/event-user-domain-stack/events.zip`

### 2. Lambda Layer

#### Dependencies Layer
- **Name**: `event-user-domain-stack-dependencies-and-func-layer`
- **Purpose**: Shared dependencies and utilities across all Lambda functions
- **S3 Location**: `s3://my-dependencies-artifacts-12345/layer.zip`
- **Contents**:
  - `mongoose` - MongoDB ODM
  - `jsonwebtoken` - JWT authentication
  - `bcrypt` - Password hashing
  - `uuid` - Unique ID generation
  - `moment` - Date/time utilities
  - Custom utilities (`dbConnection`, `utils`)

### 3. API Gateway

#### REST API Configuration
- **Name**: `event-user-domain-stack-api`
- **Type**: REST API
- **Endpoint**: Regional
- **Stage**: dev
- **URL Format**: `https://{api-id}.execute-api.us-east-1.amazonaws.com/dev`

#### Resource Structure
```
/
├── /users
│   ├── /users (base)
│   └── /users/{proxy+}
│       ├── /users/register
│       ├── /users/login
│       └── /users/me
│
└── /events
    ├── /events (base)
    └── /events/{proxy+}
        ├── /events/create
        └── /events/all
```

### 4. IAM Role

#### Lambda Execution Role
- **Name**: `event-user-domain-stack-lambda-exec`
- **Managed Policies**:
  - `AWSLambdaBasicExecutionRole` - CloudWatch Logs access
- **Custom Policies**:
  - SSM Parameter Store access
  - Secrets Manager access

### 5. S3 Buckets

1. **my-user-handler-12345**
   - Purpose: Stores Users Lambda deployment package
   - Region: us-east-1

2. **my-events-handler-12345**
   - Purpose: Stores Events Lambda deployment package
   - Region: us-east-1

3. **my-dependencies-artifacts-12345**
   - Purpose: Stores Lambda Layer package
   - Region: us-east-1

---

## Project Structure

```
express_apigateway_lambda/
├── functions/
│   ├── handle-users.ts              # Users Lambda entry point
│   ├── handle-events.ts             # Events Lambda entry point
│   ├── dbConnection.ts              # MongoDB connection logic
│   ├── utils.ts                     # Shared utilities (auth, responses)
│   │
│   ├── routes/
│   │   ├── users/
│   │   │   └── handlers/
│   │   │       ├── registerUserHandler.ts
│   │   │       ├── loginUserHandler.ts
│   │   │       └── getMeHandler.ts
│   │   │
│   │   └── events/
│   │       ├── createEventHandler.ts
│   │       └── seeAllEventsHandler.ts
│   │
│   ├── schemas/
│   │   ├── User.ts                  # Mongoose User model
│   │   └── Event.ts                 # Mongoose Event model
│   │
│   ├── layers/
│   │   └── common/
│   │       └── nodejs/              # Lambda Layer structure
│   │           └── node_modules/    # Shared dependencies
│   │
│   ├── release/
│   │   ├── users.zip                # Built Users Lambda
│   │   ├── events.zip               # Built Events Lambda
│   │   └── users-build/             # Compiled TypeScript
│   │
│   ├── cfn/
│   │   ├── template.yaml            # CloudFormation template
│   │   ├── deploy                   # Deployment script
│   │   └── ReadMe.md                # Deployment instructions
│   │
│   ├── build-users.sh               # Users Lambda build script
│   ├── build-events.sh              # Events Lambda build script
│   ├── tsconfig.users.json          # TypeScript config for users
│   └── tsconfig.events.json         # TypeScript config for events
│
├── package.json
├── tsconfig.json
└── PROJECT_DOCUMENTATION.md         # This file
```

---

## Domain Services

### Users Domain

**Responsibilities**: User authentication and profile management

#### Endpoints

1. **POST /users/register**
   - Creates new user account
   - Hashes password with bcrypt
   - Generates JWT token
   - Returns user object and token

2. **POST /users/login**
   - Authenticates user credentials
   - Validates password
   - Generates JWT token
   - Returns user object and token

3. **GET /users/me**
   - Retrieves authenticated user profile
   - Requires JWT token in Authorization header
   - Returns user details

#### User Schema
```typescript
{
  userId: string (UUID)
  name: string
  email: string (unique)
  password: string (hashed)
  createdAt: Date
}
```

### Events Domain

**Responsibilities**: Event creation and management

#### Endpoints

1. **POST /events/create**
   - Creates new event
   - Requires authentication
   - Associates event with user
   - Returns created event

2. **GET /events/all**
   - Retrieves all events
   - Requires authentication
   - Returns array of events

#### Event Schema
```typescript
{
  eventId: string (UUID)
  title: string
  description: string
  date: Date
  location: string
  createdBy: string (userId)
  createdAt: Date
}
```

---

## Infrastructure Setup

### CloudFormation Template

**File**: `functions/cfn/template.yaml`

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| S3UserBucket | String | - | S3 bucket for Users Lambda |
| S3UserKey | String | - | S3 key for Users Lambda zip |
| S3EventBucket | String | - | S3 bucket for Events Lambda |
| S3EventKey | String | - | S3 key for Events Lambda zip |
| LayerS3Bucket | String | my-dependencies-artifacts-12345 | S3 bucket for Lambda Layer |
| LayerS3Key | String | layer.zip | S3 key for Lambda Layer |
| LambdaUserHandler | String | handle-users.handlerUsers | Users Lambda handler |
| LambdaEventHandler | String | handle-events.handlerEvents | Events Lambda handler |
| Runtime | String | nodejs18.x | Lambda runtime |
| MemorySize | Number | 1024 | Lambda memory (MB) |
| Timeout | Number | 30 | Lambda timeout (seconds) |
| StageName | String | dev | API Gateway stage |
| mongoURI | String | - | MongoDB connection string |
| jwtSecret | String | - | JWT secret key |

#### Key Resources

1. **LambdaExecutionRole** - IAM role for Lambda execution
2. **DependenciesAndFuncLayer** - Shared Lambda Layer
3. **UsersFunction** - Users Lambda function
4. **EventsFunction** - Events Lambda function
5. **ApiGatewayRestApi** - REST API
6. **ApiGatewayResourceUsers** - /users resource
7. **ApiGatewayResourceEvents** - /events resource
8. **ApiGatewayResourceProxyUser** - /users/{proxy+} resource
9. **ApiGatewayResourceProxyEvents** - /events/{proxy+} resource
10. **ApiGatewayMethodUsersBase** - ANY method on /users
11. **ApiGatewayMethodEventsBase** - ANY method on /events
12. **ApiGatewayMethodAnyUser** - ANY method on /users/{proxy+}
13. **ApiGatewayMethodAnyEvents** - ANY method on /events/{proxy+}
14. **ApiGatewayDeployment** - API deployment to stage

---

## Deployment Process

### Prerequisites

1. AWS CLI configured with appropriate credentials
2. Node.js 18.x installed
3. TypeScript compiler installed
4. MongoDB Atlas cluster set up

### Step-by-Step Deployment

#### 1. Build Lambda Layer

```bash
cd functions/layers/common
zip -r layer.zip nodejs
aws s3 mb s3://my-dependencies-artifacts-12345 --region us-east-1
aws s3 cp layer.zip s3://my-dependencies-artifacts-12345/layer.zip
```

#### 2. Build Users Lambda

```bash
cd functions
./build-users.sh
aws s3 mb s3://my-user-handler-12345 --region us-east-1
aws s3 cp release/users.zip s3://my-user-handler-12345/event-user-domain-stack/users.zip
```

#### 3. Build Events Lambda

```bash
./build-events.sh
aws s3 mb s3://my-events-handler-12345 --region us-east-1
aws s3 cp release/events.zip s3://my-events-handler-12345/event-user-domain-stack/events.zip
```

#### 4. Deploy CloudFormation Stack

```bash
cd cfn
chmod +x deploy
./deploy
```

The deploy script will:
- Create/update CloudFormation stack
- Set up API Gateway
- Deploy Lambda functions
- Configure IAM roles and permissions

#### 5. Update Lambda Code (After Changes)

```bash
# Update Users Lambda
aws lambda update-function-code \
  --function-name event-user-domain-stack-users \
  --s3-bucket my-user-handler-12345 \
  --s3-key event-user-domain-stack/users.zip

# Update Events Lambda
aws lambda update-function-code \
  --function-name event-user-domain-stack-events \
  --s3-bucket my-events-handler-12345 \
  --s3-key event-user-domain-stack/events.zip
```

### Build Scripts

#### build-users.sh
- Cleans previous build artifacts
- Compiles TypeScript to JavaScript
- Creates deployment package (users.zip)
- Includes only necessary files (excludes .map and .d.ts files)

#### build-events.sh
- Same process as build-users.sh
- Creates events.zip deployment package

---

## API Endpoints

### Base URL
```
https://{api-id}.execute-api.us-east-1.amazonaws.com/dev
```

### Users Endpoints

#### 1. Register User
```http
POST /users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200)**:
```json
{
  "message": "User registered successfully",
  "user": {
    "userId": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt-token-here"
}
```

#### 2. Login User
```http
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200)**:
```json
{
  "message": "Login successful",
  "user": {
    "userId": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt-token-here"
}
```

#### 3. Get User Profile
```http
GET /users/me
Authorization: Bearer {jwt-token}
```

**Response (200)**:
```json
{
  "message": "User retrieved successfully",
  "user": {
    "userId": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-11-23T10:00:00.000Z"
  }
}
```

### Events Endpoints

#### 1. Create Event
```http
POST /events/create
Authorization: Bearer {jwt-token}
Content-Type: application/json

{
  "title": "Tech Conference 2025",
  "description": "Annual technology conference",
  "date": "2025-12-15T09:00:00.000Z",
  "location": "San Francisco, CA"
}
```

**Response (201)**:
```json
{
  "message": "Event created successfully",
  "event": {
    "eventId": "uuid-here",
    "title": "Tech Conference 2025",
    "description": "Annual technology conference",
    "date": "2025-12-15T09:00:00.000Z",
    "location": "San Francisco, CA",
    "createdBy": "user-uuid",
    "createdAt": "2025-11-23T10:00:00.000Z"
  }
}
```

#### 2. Get All Events
```http
GET /events/all
Authorization: Bearer {jwt-token}
```

**Response (200)**:
```json
{
  "message": "Events retrieved successfully",
  "events": [
    {
      "eventId": "uuid-1",
      "title": "Tech Conference 2025",
      "description": "Annual technology conference",
      "date": "2025-12-15T09:00:00.000Z",
      "location": "San Francisco, CA",
      "createdBy": "user-uuid",
      "createdAt": "2025-11-23T10:00:00.000Z"
    }
  ]
}
```

---

## Security & Authentication

### JWT Authentication

#### Token Generation
- Generated during user registration and login
- Contains user ID in payload
- Signed with `jwtSecret` environment variable
- No expiration set (consider adding in production)

#### Token Validation
- Required for protected endpoints (/users/me, /events/*)
- Sent in Authorization header: `Bearer {token}`
- Validated using `authenticateUser` utility function
- Returns 401 if invalid or missing

### Password Security
- Passwords hashed using bcrypt (salt rounds: 10)
- Never stored in plain text
- Compared using bcrypt.compare during login

### API Gateway Security
- CORS enabled with wildcard origin (*)
- Consider restricting origins in production
- No API keys or usage plans configured
- All endpoints currently public (except auth-protected routes)

---

## Environment Variables

### Lambda Environment Variables

Both Lambda functions receive these environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| mongoURI | MongoDB connection string | mongb |
| jwtSecret | Secret key for JWT signing | eventScreen |
| NODE_ENV | Environment name | production |
| STAGE | API Gateway stage | dev |

### Setting Environment Variables

Environment variables are set via CloudFormation parameters during deployment:

```bash
aws cloudformation deploy \
  --parameter-overrides \
    mongoURI=mongodb+srv://... \
    jwtSecret=your-secret-key
```

---

## Troubleshooting Guide

### Common Issues

#### 1. "Cannot find module" Error

**Problem**: Lambda cannot find required modules
**Solution**: 
- Ensure Lambda Layer is properly attached
- Verify layer.zip contains nodejs/node_modules structure
- Check that dependencies are in the layer, not the function zip

#### 2. "jwt must be provided" Error

**Problem**: JWT token not being extracted from headers
**Solution**:
- Verify Authorization header format: `Bearer {token}`
- Check header case sensitivity (authorization vs Authorization)
- Add logging to see actual headers received

#### 3. MongoDB Connection Timeout

**Problem**: Lambda cannot connect to MongoDB
**Solution**:
- Verify mongoURI environment variable is set
- Check MongoDB Atlas network access (allow AWS IPs)
- Ensure MongoDB Atlas cluster is running
- Verify connection string includes credentials

#### 4. API Gateway 403 Forbidden

**Problem**: API Gateway rejects requests
**Solution**:
- Verify Lambda invoke permissions are set
- Check API Gateway deployment is up to date
- Ensure method integration is configured correctly

#### 5. CloudFormation Stack Fails

**Problem**: Stack creation/update fails
**Solution**:
- Check S3 buckets exist and contain zip files
- Verify all required parameters are provided
- Review CloudFormation events for specific error
- Ensure IAM permissions are sufficient

### Debugging Tips

1. **Check CloudWatch Logs**
   ```bash
   aws logs tail /aws/lambda/event-user-domain-stack-users --follow
   ```

2. **Test Lambda Directly**
   ```bash
   aws lambda invoke \
     --function-name event-user-domain-stack-users \
     --payload '{"httpMethod":"GET","path":"/users/me"}' \
     response.json
   ```

3. **View API Gateway Logs**
   - Enable CloudWatch logging in API Gateway stage settings
   - Check execution logs for request/response details

---

## Future Improvements

### Security Enhancements
1. **Add JWT expiration** - Set token expiration time (e.g., 24 hours)
2. **Implement refresh tokens** - Allow token renewal without re-login
3. **Add API rate limiting** - Prevent abuse with usage plans
4. **Restrict CORS origins** - Limit to specific domains in production
5. **Add request validation** - Validate request bodies in API Gateway
6. **Implement API keys** - Add API key requirement for additional security
7. **Use AWS Secrets Manager** - Store sensitive data (mongoURI, jwtSecret) in Secrets Manager

### Performance Optimizations
1. **Enable Lambda provisioned concurrency** - Reduce cold starts
2. **Implement connection pooling** - Reuse MongoDB connections
3. **Add caching layer** - Use ElastiCache for frequently accessed data
4. **Optimize Lambda memory** - Right-size based on actual usage
5. **Enable API Gateway caching** - Cache GET responses

### Feature Additions
1. **Email verification** - Verify user email addresses
2. **Password reset** - Allow users to reset forgotten passwords
3. **Event RSVP** - Allow users to RSVP to events
4. **Event search/filter** - Add search and filtering capabilities
5. **User roles** - Implement admin/user role system
6. **Event updates/deletion** - Allow event creators to modify events
7. **Pagination** - Add pagination for event listings
8. **File uploads** - Support event images/attachments

### Infrastructure Improvements
1. **Add VPC** - Deploy Lambdas in VPC for enhanced security
2. **Multi-region deployment** - Deploy to multiple regions for HA
3. **Add CloudFront** - CDN for API Gateway
4. **Implement CI/CD** - Automate deployment with GitHub Actions/CodePipeline
5. **Add monitoring** - Set up CloudWatch alarms and dashboards
6. **Implement backup strategy** - Automated MongoDB backups
7. **Add staging environment** - Separate dev/staging/prod environments

### Code Quality
1. **Add unit tests** - Jest/Mocha for handler functions
2. **Add integration tests** - Test API endpoints end-to-end
3. **Implement input validation** - Use Joi or similar library
4. **Add API documentation** - Generate OpenAPI/Swagger docs
5. **Improve error handling** - Standardize error responses
6. **Add request logging** - Structured logging with correlation IDs

---

## Technical Decisions & Rationale

### Why Lambda Layers?
- **Shared dependencies**: Avoid duplicating node_modules in each function
- **Smaller deployment packages**: Faster deployments
- **Easier updates**: Update dependencies once in the layer
- **Cost optimization**: Reduced storage costs

### Why Separate Lambda Functions?
- **Domain separation**: Clear boundaries between user and event logic
- **Independent scaling**: Each domain scales based on its own traffic
- **Easier maintenance**: Changes to one domain don't affect the other
- **Better monitoring**: Separate metrics and logs per domain

### Why API Gateway Proxy Integration?
- **Flexibility**: Full control over request/response format
- **Path routing**: Handle multiple routes in single Lambda
- **Headers access**: Easy access to headers for authentication
- **Standard HTTP**: Works with standard HTTP clients

### Why MongoDB Atlas?
- **Managed service**: No database administration overhead
- **Scalability**: Easy to scale as needed
- **Global distribution**: Can deploy globally if needed
- **Free tier**: Cost-effective for development/testing

---

## Contact & Support

**Project Owner**: Fakorede Damilola

**Repository**: `/Users/fakorededamilola/aws_projects/express_apigateway_lambda`

**AWS Region**: us-east-1

**Stack Name**: event-user-domain-stack

---

## Appendix

### Useful AWS CLI Commands

```bash
# List Lambda functions
aws lambda list-functions

# Get Lambda function details
aws lambda get-function --function-name event-user-domain-stack-users

# List API Gateway REST APIs
aws apigateway get-rest-apis

# List S3 buckets
aws s3 ls

# View CloudFormation stack
aws cloudformation describe-stacks --stack-name event-user-domain-stack

# Delete CloudFormation stack
aws cloudformation delete-stack --stack-name event-user-domain-stack
```

### TypeScript Configuration

The project uses separate TypeScript configurations for each domain:

- `tsconfig.users.json` - Compiles only user-related files
- `tsconfig.events.json` - Compiles only event-related files

This approach:
- Reduces compilation time
- Creates smaller deployment packages
- Includes only necessary code per Lambda

### MongoDB Connection Strategy

The `dbConnection.ts` implements connection pooling:
- Reuses existing connections across Lambda invocations
- Stores connection promise globally
- Checks connection state before creating new connection
- Optimizes for Lambda's execution model

---

**Last Updated**: November 23, 2025

**Version**: 1.0.0
