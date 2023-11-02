#!/bin/bash

echo "NEXT_PUBLIC_ENV: $NEXT_PUBLIC_ENV"

if [[ "$NEXT_PUBLIC_ENV" == "dev"  ]] ; then
  # Proceed with the build
  echo "✅ - Build can proceed"
  exit 1;

else
  # Don't build
  echo "🛑 - Build cancelled"
  exit 0;
fi
