# dock/Dockerfile
FROM node:24-alpine

RUN apk add --no-cache python3 make g++ bash

WORKDIR /opt/app
COPY . /opt/app

# Install dependencies (uses package-lock.json if present)
RUN if [ -f package-lock.json ]; then npm ci --no-audit --no-fund; else npm install --no-audit --no-fund; fi

# Run build if defined (safe no-op if absent)
RUN if grep -q "\"build\"" package.json 2>/dev/null; then npm run build || true; fi

ENV KE_DATA_DIR=/config
VOLUME ["/config","/mnt/karaoke"]
EXPOSE 8080

# Ensure runtime config exists on the mounted host path, then prefer compiled entrypoint.
CMD ["sh", "-c", "\
  mkdir -p \"${KES_PATH_DATA}\" && \
  if [ ! -f \"${KES_PATH_DATA}/config.json\" ]; then \
    if [ -f ./config/config.default.json ]; then \
      cp ./config/config.default.json \"${KES_PATH_DATA}/config.json\"; \
    else \
      printf '{\"database\":\"db.sqlite\",\"mediaDir\":\"/mnt/karaoke\"}\\n' > \"${KES_PATH_DATA}/config.json\"; \
    fi \
  fi && \
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
