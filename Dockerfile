FROM node:20-alpine

RUN npm install -g pnpm 

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./
COPY prisma ./prisma/

RUN pnpm install --frozen-lockfile 

# Copy source code
COPY . .

# Generate Prisma client & build application
RUN npx prisma generate && pnpm run build

# Create data directory for SQLite
RUN mkdir -p /app/data

# Expose port
EXPOSE 5000

# Start application
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]

