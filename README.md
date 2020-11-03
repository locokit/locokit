# Low-Code Kit API Platform

[![pipeline status](https://gitlab.makina-corpus.net/lck/lck-api/badges/master/pipeline.svg)](https://gitlab.makina-corpus.net/lck/lck-api/-/commits/master)
[![coverage report](https://gitlab.makina-corpus.net/lck/lck-api/badges/master/coverage.svg)](https://gitlab.makina-corpus.net/lck/lck-api/-/commits/master)


The backend platform for the Low-Code Kit platform.

## About

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications.

## Getting Started

1. npm ci / install
2. cp -r patch/** node_modules
3. Get docker and docker-compose
4. docker-compose up
5. write a `.env` file with vars as in `.env.example`
6. npm run migrate:latest
7. npm run seed:run
8. npm run start

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
