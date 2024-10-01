# locokit-api

> LocoKit API (over SQL)

## About

This project uses [Feathers](http://dove.feathersjs.com). An open source framework for building APIs and real-time
applications.

The version used is the v5, aka Dove.

This version is not yet stabilized. It's only prerelases.

## Getting Started

Instructions are available in the [root `README.md`](../README.md).

Don't forget to start the `docker-compose.yml`.

For development, you have the choice to use `vite` or `ts-node-dev`.

```sh
npm run dev # will use vite under the hood

npm run tsc:dev # will use ts-node-dev
```

`vite` version is quickier but don't check typings,
whereas `ts-node-dev` will also check typings.

`ts-node-dev` start more slowly than `vite`,
but hot reloads are not so bad.

You choose, but beware that the build will check typings.
The sooner you have errors, the sooner you'll fix them.
But sometimes you'll need to have "vitesse" ;-).

**Knex migrations**

The API use a database (SQLite3 / PostGreSQL + Postgis).
You need to run migrations before use the database.

And also each time you pull the code from the repo,
this is a good practice to have a database up-to-date.

```sh
npm run migrate:latest
```

**Knex seeds**

You can populate the database with some default data,
for development purpose.

```sh
npm run seed:run-init
```

You'll have access to 3 users :

* admin@locokit.io with ADMIN profile
* creator@locokit.io with CREATOR profile
* member@locokit.io with MEMBER profile

A workspace is also created by the CREATOR user.

## Testing

Run `npm test` and all your tests in the `test/` directory will be run.

## Scaffolding

Feathers has a powerful command line interface. Here are a few things it can do:

```
$ npm install -g @feathersjs/cli@pre      # Install Feathers CLI

$ feathers generate service               # Generate a new Service
$ feathers help                           # Show all commands
```

## Database dumps

If you retrieve a dump from a server managed by us,
follow these instructions to restore it on your local database:

You can restore any staging / production dump you have access to by putting them
in the `dumps` directory.

This directory is shared with the postgres dockers. (`lck-db` and `lck-db-test`)

For restoring a dump :

```bash
docker exec -it lck-db-next bash
pg_restore --no-owner --clean --create -d public -U postgres -W /dumps/your_dump # you'll have to enter the password yourPostgresPassword
```
