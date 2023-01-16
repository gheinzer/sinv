#!/bin/bash
echo "Delete dist folder"
rm -rf dist
echo "Build TypeScript on backend"
cd backend
npx tsc
echo "Build Angular on frontend"
cd ../frontend
npx ng build
cd ..