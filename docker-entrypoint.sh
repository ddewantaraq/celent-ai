#!/bin/sh
set -e

# Run migrations
npm run db:migrate

# Undo all seeds
npm run db:seed:undo

# Run seeds
npm run db:seed

# Start the server
exec "$@" 