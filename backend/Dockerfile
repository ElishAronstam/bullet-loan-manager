FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 8000

CMD ["node", "dist/server.js"]

HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget -qO- http://localhost:8000/health/live || exit 1