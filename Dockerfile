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

# Clean up source
RUN rm -rf /opt/app

# Runtime environment
ENV NODE_ENV=production

VOLUME ["/config","/mnt/karaoke"]
EXPOSE 8080

# Use Compose-provided environment variables
# and start in / to match maintainer behavior
CMD ["sh", "-c", "cd / && exec karaoke-eternal-server \
  -p ${KES_PORT} \
  --data ${KES_PATH_DATA} \
  --serverLogLevel ${KES_SERVER_LOG_LEVEL} \
  --scannerLogLevel ${KES_SCANNER_LOG_LEVEL}"]
