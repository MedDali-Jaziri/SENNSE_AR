# Stage 1: Build the Angular app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular app
# RUN npm run build -- --base-href /sennse-ar

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Create directory for SSL certificates
RUN mkdir -p /etc/nginx/ssl

# Copy SSL certificates (make sure these files exist in your local ssl/ folder)
COPY ssl/cert.pem /etc/nginx/ssl/cert.pem
COPY ssl/key.pem /etc/nginx/ssl/key.pem

# Copy build output from Angular app
COPY --from=builder /app/dist/sennse-ar/browser /usr/share/nginx/html/sennse-ar

# Copy custom Nginx config with SSL enabled
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose ports for HTTP and HTTPS
EXPOSE 80
EXPOSE 443

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
