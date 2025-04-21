# Use official Node.js image for building the frontend
FROM oven/bun:1 AS build

# Set working directory inside container
WORKDIR /app

# Copy package.json first for efficient caching
COPY package.json ./

# Install dependencies
RUN bun install

# Copy the rest of the application files
COPY . .
    
# Build the application
RUN bun run build

# Use Nginx for serving the React build
FROM nginx:alpine

# Copy built React files from previous stage to Nginx web root
COPY --from=build /app/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx/nginx.conf /etc/nginx/conf.d

# Expose port for serving the application
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]