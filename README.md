# Low-Code Kit API Platform

[![pipeline status](https://gitlab.makina-corpus.net/lck/lck-api/badges/master/pipeline.svg)](https://gitlab.makina-corpus.net/lck/lck-api/-/commits/master)
[![coverage report](https://gitlab.makina-corpus.net/lck/lck-api/badges/master/coverage.svg)](https://gitlab.makina-corpus.net/lck/lck-api/-/commits/master)

The backend platform for the Low-Code Kit platform.

## About

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications.

## Getting Started

Initialize node modules:

```sh
npm ci # install deps
```

From here you need docker and docker-compose in recent version.

Copy a `.env` from  `.env.example` and customize it.

```sh
docker-compose up

npm run migrate:latest
npm run seed:run
npm run start
```

The default user created is `superadmin@makina-corpus.net` with password `locokit`.

## Swagger

A swagger is available on http://localhost:3030/swagger/ once the project has started.

This is made with [Redoc UI](https://redocly.github.io/redoc/).

## Restore a dump

You can restore any staging / production dump you have access to by putting them
in the `dumps` folder.

This folder is shared with the postgres dockers. (`lck-api-db` and `lck-api-db-test`)

For restoring a dump :

```sh
docker exec -it lck-api-db bash
pg_restore --no-owner --clean -d postgres -U postgres -W /dumps/your_dump # you'll have to enter the password pouicpouic
```

## [CHANGELOG](CHANGELOG.md)

## Scaffolding

Feathers has a powerful command line interface. Here are a few things it can do:

```
$ npm install -g @feathersjs/cli          # Install Feathers CLI

$ feathers generate service               # Generate a new Service
$ feathers generate hook                  # Generate a new Hook
$ feathers help                           # Show all commands
```

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).

## Contribute

If you encounter a bug, please submit an issue.

If you want to contribute to the code,
first ask to the team where to begin.

When making a contribution, please name your branch with the issue's id.

For example, on the issue n° 23, you could name your branch `23-add-of-a-new-feature` or `23-fix-this-horrible-bug`.

Then you could submit a Merge Request.

The CI is configured, so you could check also if your branch is not breaking anything.
