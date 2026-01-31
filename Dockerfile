FROM node:14-alpine

# Build tools required for native modules
RUN apk add --no-cache python3 make g++ bash

# Global npm prefix to mimic historical installs
ENV NPM_CONFIG_PREFIX=/opt/.npm-global
ENV PATH=/opt/.npm-global/bin:$PATH

WORKDIR /opt/app

# Copy the 1.0.0 source
COPY . /opt/app

# Install dependencies
RUN npm install --no-audit --no-fund

# Build the project (1.0.0 used TypeScript)
RUN npm run build

# Install globally to mimic real-world installs
RUN npm install -g . --no-audit --no-fund

# Runtime environment
ENV NODE_ENV=production

VOLUME ["/config","/mnt/karaoke"]
EXPOSE 8080

# Run from / to match maintainer behavior
CMD ["sh", "-c", "cd / && exec karaoke-eternal-server \
  --data /config \
  --serverLogLevel 0 \
  --scannerLogLevel 0 \
  -p 8080"]
