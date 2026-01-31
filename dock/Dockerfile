# Dockerfile used by compose build.context (dock/Dockerfile in the repo)
# This Dockerfile is intentionally minimal and does not change upstream source.
FROM node:24-alpine

# Install build tools commonly needed for native modules
RUN apk add --no-cache python3 make g++ bash

WORKDIR /opt/app

# The build context will be the checked-out repo at the requested tag.
# Copy the entire context into the image.
COPY . /opt/app

# Install dependencies using lockfile if present
RUN if [ -f package-lock.json ]; then \
      npm ci --no-audit --no-fund; \
    else \
      npm install --no-audit --no-fund; \
    fi

# Run build if project defines one (safe no-op if absent)
RUN if grep -q "\"build\"" package.json 2>/dev/null; then npm run build || true; fi

EXPOSE 8080

ENV KE_DATA_DIR=/config

VOLUME ["/config","/mnt/karaoke"]

# Entrypoint: ensure persistent config exists (copy default if present),
# then prefer compiled entrypoint; otherwise fall back to start script or TS entry.
CMD ["sh", "-c", "\
  mkdir -p \"${KE_DATA_DIR}\" && \
  if [ ! -f \"${KE_DATA_DIR}/config.json\" ]; then \
    if [ -f ./config/config.default.json ]; then \
      cp ./config/config.default.json \"${KE_DATA_DIR}/config.json\"; \
    else \
      printf '{\"database\":\"db.sqlite\",\"mediaDir\":\"/mnt/karaoke\"}\\n' > \"${KE_DATA_DIR}/config.json\"; \
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
