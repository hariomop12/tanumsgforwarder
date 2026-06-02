FROM node:18

# Install system dependencies for Chromium
RUN apt-get update && apt-get install -y \
  chromium \
  fonts-liberation \
  libnss3 \
  libatk-bridge2.0-0 \
  libgtk-3-0 \
  libx11-xcb1 \
  libasound2 \
  && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV CHROME_PATH=/usr/bin/chromium
ENV PUPPETEER_ARGS="--no-sandbox --disable-setuid-sandbox"

WORKDIR /app

# 1. Copy package files first to leverage caching
COPY package*.json ./

# 2. Install dependencies (cached unless package.json changes)
RUN npm install

# 3. Copy the rest of your application source code
COPY . .

# Copy entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]