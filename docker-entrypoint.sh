#!/bin/sh
set -e

# Run migrations
npm run db:migrate

# Run seeds
npm run db:seed

# Start the server
exec "$@" 