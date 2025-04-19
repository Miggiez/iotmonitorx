# Use official Node.js image for building the frontend
FROM node:18 AS build

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first for efficient caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Use Nginx for serving the React build
FROM nginx:alpine

# Copy built React files from previous stage to Nginx web root
COPY --from=build /app/build /usr/share/nginx/html

# Expose port for serving the application
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]