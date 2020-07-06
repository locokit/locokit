FROM node:lts-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3030
CMD ["npm", "run", "start"]
