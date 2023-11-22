#!/bin/bash

echo "VERCEL_ENV: $VERCEL_ENV"
echo "NEXT_PUBLIC_ENV: $NEXT_PUBLIC_ENV"
echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

if [[ ("$VERCEL_ENV" == "preview" && "$NEXT_PUBLIC_ENV" == "dev") || ("$VERCEL_ENV" == "production" && "$VERCEL_GIT_COMMIT_REF" == "main") ]] ; then
  # Proceed with the build
  echo "✅ - Build can proceed"
  exit 1;
else
  # Don't build
  echo "🛑 - Build cancelled"
  exit 0;
fi
