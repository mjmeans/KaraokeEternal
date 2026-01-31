# dock/Dockerfile
FROM node:24-alpine

RUN apk add --no-cache python3 make g++ bash

WORKDIR /opt/app
COPY . /opt/app

# Install dependencies (uses package-lock.json if present)
RUN if [ -f package-lock.json ]; then npm ci --no-audit --no-fund; else npm install --no-audit --no-fund; fi

# Run build if defined (safe no-op if absent)
RUN if grep -q "\"build\"" package.json 2>/dev/null; then npm run build || true; fi

# Runtime defaults used by the project's CLI
ENV NODE_ENV=production

VOLUME ["/config","/mnt/karaoke"]
EXPOSE 8080

# Ensure runtime config exists on the mounted host path, then prefer compiled entrypoint.
CMD ["sh", "-c", "\
  export PORT=${KES_PORT} && \
  if [ -f dist/server/main.js ]; then \
    exec node dist/server/main.js; \
  elif [ -f build/server/main.js ]; then \
    exec node build/server/main.js; \
  elif [ -f server/main.js ]; then \
    exec node server/main.js; \
  elif npm run | grep -q \"start\"; then \
    exec npm run start; \
  else \
    exec node --loader ts-node/esm server/main.ts; \
  fi \
"]
