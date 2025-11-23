#!/usr/bin/env bash

echo "Building events Lambda handler..."

# Clean previous build
rm -rf release/events-build release/events.zip

# Compile TypeScript
npx tsc -p tsconfig.events.json

# Create zip with only the compiled files
cd release/events-build
zip -r ../events.zip . -x "*.map" "*.d.ts"
cd ../..

echo "✓ Events handler built and zipped at release/events.zip"
ls -lh release/events.zip
