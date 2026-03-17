FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_SERVER_URL
ARG VITE_TIMEOUT_MS

ENV VITE_SERVER_URL=$VITE_SERVER_URL
ENV VITE_TIMEOUT_MS=$VITE_TIMEOUT_MS

RUN npm run build

FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist ./dist

ENV PORT=4000

EXPOSE 4000

CMD ["sh", "-c", "serve -s dist -l $PORT"]