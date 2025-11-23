#!/usr/bin/env bash

echo "Building user Lambda handler..."

# Clean previous build
rm -rf release/users-build release/users.zip

# Compile TypeScript
npx tsc -p tsconfig.users.json

# Create zip with only the compiled files
cd release/users-build
zip -r ../users.zip . -x "*.map" "*.d.ts"
cd ../..

echo "✓ User handler built and zipped at release/users.zip"
ls -lh release/users.zip
