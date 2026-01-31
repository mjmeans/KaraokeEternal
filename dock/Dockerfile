# dock/Dockerfile
FROM node:24-alpine

# Accept TAG from build args
ARG TAG
ENV TAG=$TAG

# Build tools required for native modules
RUN apk add --no-cache python3 make g++ bash

# Global npm prefix to match maintainer's image
ENV NPM_CONFIG_PREFIX=/opt/.npm-global
ENV PATH=/opt/.npm-global/bin:$PATH

WORKDIR /opt/app

# Copy repo source
COPY . /opt/app

# Install dependencies (uses package-lock.json if present)
RUN if [ -f package-lock.json ]; then \
      npm ci --no-audit --no-fund; \
    else \
      npm install --no-audit --no-fund; \
    fi

# Build the project (safe no-op if no build script exists)
RUN if grep -q "\"build\"" package.json 2>/dev/null; then \
      npm run build; \
    fi

# Create local npm package tarball
RUN npm pack

# Install the generated tarball globally
RUN npm install -g ./*.tgz --no-audit --no-fund

# Runtime environment
ENV NODE_ENV=production

VOLUME ["/config","/mnt/karaoke"]
EXPOSE 8080

# Run the same CLI the maintainer's image uses
CMD ["sh", "-c", "cd / && exec karaoke-eternal-server \
  -p ${KES_PORT} \
  --data ${KES_PATH_DATA} \
  --serverLogLevel ${KES_SERVER_LOG_LEVEL} \
  --scannerLogLevel ${KES_SCANNER_LOG_LEVEL}"]
