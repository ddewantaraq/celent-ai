# Use official Node.js 22 Alphine image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install dependencies (including dev for build)
COPY package*.json ./
RUN apk add --no-cache python3 make g++ && npm install && npm install @libsql/linux-arm64-musl

# Copy source code
COPY . .

# Expose the port Express listens on
EXPOSE 3000

# Start the Express server (using tsx for TypeScript, or node if compiled)
CMD ["npx", "tsx", "src/server.ts"] 