FROM node:20-alpine

WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire repository (compose sets context to repo root)
COPY . .

# Create persistent directories
RUN mkdir -p /config \
    && mkdir -p /mnt/karaoke

# Install TypeScript runtime
RUN npm install ts-node typescript

# DEBUG: show what the entrypoint will actually be
RUN echo "DEBUG: Dockerfile CMD is: npx ts-node server/main.ts"

# Environment variables expected by Karaoke Eternal
ENV KE_MEDIA_DIR=/mnt/karaoke
ENV KE_DATA_DIR=/config
ENV NODE_ENV=production

EXPOSE 8080

# Correct TypeScript entrypoint
# CMD ["npx", "ts-node", "server/main.ts"]
CMD ["sleep", "999999"]
