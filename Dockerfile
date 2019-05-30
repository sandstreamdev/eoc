FROM node:10.15.3-alpine AS init
WORKDIR /usr/src/app
ENV NODE_ENV production
COPY package*.json ./
RUN npm ci --dev

FROM init AS content
COPY . /usr/src/app

FROM content AS test
RUN npm run test

FROM content AS test-static
RUN npm run check

FROM content AS build
RUN npm run build:prod
RUN npm prune --production

FROM build
CMD npm run start:server:prod
EXPOSE 8080
