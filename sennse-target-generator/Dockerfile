# Use Debian-based Node image
FROM node:22

# Install build dependencies required by canvas
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# ⬇️ Force canvas to build from source (important!)
ENV npm_config_build_from_source=true

# Install node modules
RUN npm install

# Copy remaining files
COPY . .

# Expose port
EXPOSE 3030

# Start app
CMD ["npm", "start"]
