# Use official Node.js 22 Alphine image
FROM node:22-alpine

ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

ARG PORT=3000
ENV PORT=$PORT

# Set working directory
WORKDIR /app

# Install dependencies (including dev for build)
COPY package*.json ./
RUN apk add --no-cache python3 make g++ \
  && npm install \
  && if [ "$NODE_ENV" = "production" ]; then \
       npm install @libsql/linux-x64-gnu; \
     else \
       npm install @libsql/linux-arm64-musl; \
     fi

# Copy source code
COPY . .

# Copy entrypoint script and make it executable
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Expose the port Express listens on
EXPOSE $PORT

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["npx", "tsx", "src/server.ts"] 