FROM node:10.13.0-alpine
COPY ./ ./
RUN npm install
RUN npm run build
CMD ["npm", "run", "client"]
EXPOSE 3000
