FROM node:20-alpine AS development-dependencies-env
COPY package.json package-lock.json /app/
WORKDIR /app
RUN npm ci
COPY . /app/

FROM node:20-alpine AS production-dependencies-env
COPY package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:20-alpine AS build-env
COPY --from=development-dependencies-env /app /app
WORKDIR /app
RUN npm run build

FROM node:20-alpine
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /app
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
COPY package.json package-lock.json /app/
USER node
EXPOSE 3000
CMD ["npm", "run", "start"]
