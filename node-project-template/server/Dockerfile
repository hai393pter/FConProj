FROM node:alpine
WORKDIR /app
COPY . .
WORKDIR /app/node-project-template/server
RUN npm ci
ENTRYPOINT [ "npm", "run", "dev" ]