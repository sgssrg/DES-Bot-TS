#!/bin/bash

# Apply migrations
npx prisma migrate deploy

exec "$@"
