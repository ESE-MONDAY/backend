# Use official Node image
FROM node:20-alpine

RUN apk add --no-cache openssl libc6-compat

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose app port
EXPOSE 3000

# Start app
CMD ["npm", "start"]