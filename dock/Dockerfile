FROM node:18-alpine

# Application directory
WORKDIR /app

# Copy repo contents into the image
COPY . .

# Install dependencies and build the production bundle
RUN npm install --production

# Create persistent directories
RUN mkdir -p /config \
    && mkdir -p /mnt/karaoke

# Environment variables required by Karaoke Eternal
ENV KE_MEDIA_DIR=/mnt/karaoke
ENV KE_DATA_DIR=/config
ENV NODE_ENV=production

# Expose the application port
EXPOSE 8080

# Default command
CMD ["node", "server/index.js"]
