# Low-Code Kit API Platform

## About

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications.

## Getting Started

see the [README](../README.md) above.

## Swagger

A swagger is available on http://localhost:3030/swagger/ once the project has started.

This is made with [Redoc UI](https://redocly.github.io/redoc/).

## Restore a dump

You can restore any staging / production dump you have access to by putting them
in the `dumps` folder.

This folder is shared with the postgres dockers. (`lck-db` and `lck-db-test`)

For restoring a dump :

```sh
docker exec -it lck-db bash
pg_restore --no-owner --clean -d public -U postgres -W /dumps/your_dump # you'll have to enter the password yourPostgresPassword
```

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
