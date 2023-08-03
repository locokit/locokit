#
# Base image
#
# To be used by all others images
#
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat nano
RUN apk update

# Environment variables default values
ENV NODE_ENV=production

#
# Builder image
#
# Used to build all locokit packages
#
FROM base AS builder
# we need to install all dependencies for building purpose
ENV NODE_ENV=dev
WORKDIR /code
RUN npm i -g turbo --ignore-scripts
COPY *.json ./
COPY api api
COPY app app
COPY docs docs
COPY packages packages
RUN npm ci --ignore-scripts
RUN turbo run build
RUN turbo prune --scope=locokit-api --out-dir=locokit-api --docker

#
# LocoKit API image
# NodeJS web server for the Feathers API
#
FROM base AS locokit-api
WORKDIR /code
COPY --from=builder /code/locokit-api/json .
RUN npm ci --ignore-scripts
COPY --from=builder /code/locokit-api/full/api/dist/server .

CMD node index.js


#
# LocoKit APP image
# Nitro web server for the Nuxt application
#
FROM base AS locokit-app
WORKDIR /code
COPY --from=builder /code/app/.output .

CMD node server/index.mjs

