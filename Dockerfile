FROM node:fermium-slim
ENV NODE_ENV=production
RUN mkdir /code
WORKDIR /code
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get clean all
RUN apt-get autoclean
RUN apt install nano
COPY package*.json /code/
COPY src /code/src/
COPY knexutils /code/knexutils/
COPY public /code/public/
COPY templates /code/templates/
COPY lib /code/lib/
COPY config /code/config/
COPY migrations /code/migrations/
COPY seeds /code/seeds/
COPY tsconfig.json /code/
COPY knexfile.ts /code/
RUN npm ci --also=dev
RUN npm install pm2 knex typescript -g
COPY patch/feathers-objection/lib/index.js /code/node_modules/feathers-objection/lib/index.js
# ENTRYPOINT pm2-runtime lib/index.js -n lck-api
CMD node /code/lib/index.js
