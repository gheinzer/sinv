#!/bin/bash
echo "Delete dist folder"
rm -rf dist
echo "Build backend"
cd backend
npm run build
echo "Build Angular on frontend"
cd ../frontend
npx ng build
cd ..