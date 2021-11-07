FROM node:16-slim

# Environment variables default values
ENV NODE_ENV=production
ENV LCK_PORT=8002
ENV LCK_HOST=localhost
ENV LCK_PUBLIC_URL=http://localhost:8002
ENV LCK_PUBLIC_PORTAL_NAME="LocoKit platform"
ENV LCK_AUTH_SECRET=yoursecretforpasswordTOCHANGEABSOLUTELY
ENV LCK_DATABASE_URL=postgres://postgres:lckpassword@localhost:5432/public
ENV OBJECTION_DEBUG=false

ENV MAIL_PORT=
ENV MAIL_SERVER=
ENV MAIL_USERNAME=
ENV MAIL_PASSWORD=
ENV MAIL_DEFAULT_FROM=
ENV MAIL_SECURE=false

ENV SENTRY_DSN=
ENV SENTRY_RELEASE=
ENV SENTRY_ENVIRONMENT=

ENV CORS_ORIGIN=*

ENV STORAGE_TYPE=fs
ENV STORAGE_FS_PATH=../fs-storage
ENV STORAGE_MAX_UPLOAD_SIZE=20mb


WORKDIR /code
RUN mkdir /code/fs-storage

# Update image and install nano
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get clean all
RUN apt-get autoclean
RUN apt install nano

# Copy all files related to api, front & docs
COPY package*.json /code/
COPY api/package.json /code/api/
COPY api/src /code/api/src/
COPY api/knexutils /code/api/knexutils/
COPY api/public/ /code/api/public/
COPY front/dist /code/public/
COPY front/dist /code/api/public/
COPY docs/.vitepress/dist /code/public/docs/
COPY docs/.vitepress/dist /code/api/public/docs/
COPY api/templates /code/api/templates/
COPY api/lib /code/api/lib/
COPY api/config /code/api/config/
COPY api/migrations /code/api/migrations/
COPY api/seeds /code/api/seeds/
COPY api/tsconfig.json /code/api/
COPY api/knexfile.ts /code/api/

# Install dependencies
RUN npm ci --also=dev --workspace=api
RUN npm install pm2 knex typescript -g
COPY api/patch/feathers-objection/lib/index.js /code/api/node_modules/feathers-objection/lib/index.js

# ENTRYPOINT pm2-runtime lib/index.js -n lck-api
WORKDIR /code/api
CMD node /code/api/lib/index.js