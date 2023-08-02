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
RUN npm i -g turbo
COPY . .
RUN npm ci
RUN turbo run build
RUN turbo prune --scope=locokit-api --out-dir=locokit-api --docker

#
# LocoKit API image
# NodeJS web server for the Feathers API
#
FROM base AS locokit-api
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 locokit
USER locokit
WORKDIR /code
COPY --from=builder --chown=locokit:nodejs /code/locokit-api/json .
RUN npm ci
COPY --from=builder --chown=locokit:nodejs /code/locokit-api/full/api/dist/server .

CMD node index.js


#
# LocoKit APP image
# Nitro web server for the Nuxt application
#
FROM base AS locokit-app
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 locokit
USER locokit
WORKDIR /code
COPY --from=builder --chown=locokit:nodejs /code/app/.output .

CMD node server/index.mjs

