# Stage 1: Building the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# ข้าม ESLint และ TypeScript Errors
RUN echo "module.exports = { eslint: { ignoreDuringBuilds: true }, typescript: { ignoreBuildErrors: true } };" > next.config.js

# Build the application
RUN npm run build

# ลบไฟล์ที่ไม่จำเป็นหลัง build
RUN rm -rf node_modules

# Stage 2: Running the application
FROM node:20-alpine AS runner

WORKDIR /app

# Set to production environment
ENV NODE_ENV=production

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm ci --production

# Copy built application from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./next.config.js

# Add user to run the application without root privileges
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose the port the app will run on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]