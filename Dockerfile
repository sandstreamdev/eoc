FROM node:10.15.3-alpine AS init
WORKDIR /usr/src/app
ENV NODE_ENV production
COPY package*.json ./
RUN npm ci --dev
COPY . /usr/src/app

FROM init AS test
RUN npm run test

FROM init AS test-static
RUN npm run check

FROM init AS build
RUN npm run build:prod
RUN npm prune --production

FROM builder
CMD npm run start:server:prod
EXPOSE 8080
