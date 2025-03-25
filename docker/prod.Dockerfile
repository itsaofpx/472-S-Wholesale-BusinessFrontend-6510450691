# Use a newer Node.js base image
FROM node:18

# Rest of your Dockerfile remains the same
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx eslint . --ext .ts,.tsx
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]