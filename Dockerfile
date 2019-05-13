FROM node:10.13.0-alpine
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "run", "server-prod"]
EXPOSE 8080

