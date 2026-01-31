# ---------- Build stage ----------
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files and install deps (including dev deps for tsc)
COPY package*.json ./
RUN npm install

# Copy the full source tree
COPY . .

# If the repo doesn't have a tsconfig.json, create a minimal one
# Adjust "include" if the server code lives elsewhere.
RUN [ -f tsconfig.json ] || printf '{
  "compilerOptions": {
    "target": "ES2019",
    "module": "commonjs",
    "rootDir": ".",
    "outDir": "dist",
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "strict": false
  },
  "include": ["server/**/*", "src/**/*"]
}\n' > tsconfig.json

# Compile TypeScript to JavaScript
RUN npx tsc

# ---------- Runtime stage ----------
FROM node:18-alpine

WORKDIR /app

# Copy only what we need at runtime
COPY package*.json ./
RUN npm install --production

# Bring in compiled JS from build stage
COPY --from=build /app/dist ./dist

# Create persistent directories
RUN mkdir -p /config \
    && mkdir -p /mnt/karaoke

# Environment variables expected by Karaoke Eternal
ENV KE_MEDIA_DIR=/mnt/karaoke
ENV KE_DATA_DIR=/config
ENV NODE_ENV=production

EXPOSE 8080

# Run the compiled JS entrypoint
# Adjust path if tsc outputs a different structure
CMD ["node", "dist/server/main.js"]
