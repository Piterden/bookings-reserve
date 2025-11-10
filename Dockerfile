FROM node:20-alpine AS deps-prod
WORKDIR /app
COPY ./package*.json .
RUN npm install --omit=dev

FROM node:20-alpine AS prod
WORKDIR /app
COPY --from=deps-prod /app/node_modules ./node_modules
COPY ./package*.json .
COPY ./knexfile.cjs .
COPY ./src ./dist
