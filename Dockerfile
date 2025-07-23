#
# This file is here to build 2 docker images : locokit-api & locokit-app
#
# This docker file works for amd64 and arm64 platform only
#
# It use turbo (https://turbo.build/) and this bundler doesn't work only on arm32 platform
# see https://github.com/vercel/turbo/issues/4935
#

#
# Base image
#
# To be used by all others images
#
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat nano
RUN apk update
RUN npm i -g --ignore-scripts pnpm pm2 turbo
RUN addgroup -S locokit \
    && adduser -S locokit -G locokit

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
# RUN npm i --ignore-scripts -g turbo
COPY *.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY api api
COPY app app
COPY docs docs
COPY packages packages
RUN pnpm i --frozen-lockfile --ignore-scripts
WORKDIR /code/api
RUN turbo run build
RUN turbo prune --scope=locokit-api --out-dir=locokit-api --docker
WORKDIR /code/app
RUN turbo run build


#
# LocoKit API image
# Koa NodeJS web server for the Feathers API
#
FROM base AS locokit-api
WORKDIR /code
COPY --from=builder /code/locokit-api/json .
RUN pnpm i --frozen-lockfile --ignore-scripts --prod
COPY --from=builder /code/locokit-api/full/api/dist .
COPY --from=builder /code/locokit-api/full/api/dist /code/api/dist
COPY --from=builder /code/locokit-api/full/packages/definitions/dist /code/packages/definitions/dist
COPY --from=builder /code/locokit-api/full/packages/engine/dist /code/packages/engine/dist

USER locokit
WORKDIR /code/api
CMD pm2 start index.mjs

#
# LocoKit App image
# Static files from build
#
FROM nginx:alpine AS locokit-app
COPY --from=builder /code/app/dist/ /etc/nginx/html
