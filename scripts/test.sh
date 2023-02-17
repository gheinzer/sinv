#!/bin/bash
npm run build
echo "Start sinv"
node dist/backend/index &
echo "Run cypress tests"
npx cypress run