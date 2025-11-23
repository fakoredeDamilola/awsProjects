# Express.js with TypeScript

A modern Express.js server built with TypeScript.

## Features

- ✅ Express.js server with TypeScript
- ✅ Hot reload with ts-node-dev
- ✅ CORS enabled
- ✅ Environment variables with dotenv
- ✅ ESLint configuration
- ✅ Request logging middleware
- ✅ Error handling

## Getting Started

### Install Dependencies

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and configure your environment variables:

```bash
cp .env.example .env
```

### Development

Run the development server with hot reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Build

Compile TypeScript to JavaScript:

```bash
npm run build
```

### Production

Run the compiled JavaScript:

```bash
npm start
```

### Type Checking

Check TypeScript types without emitting files:

```bash
npm run type-check
```

### Linting

Run ESLint:

```bash
npm run lint
```

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check endpoint

## Project Structure

```
.
├── src/
│   └── index.ts          # Main application file
├── dist/                 # Compiled JavaScript (generated)
├── .env.example          # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json         # TypeScript configuration
├── .eslintrc.json        # ESLint configuration
└── README.md
```
