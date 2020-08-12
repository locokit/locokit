# Low-Code Kit API Platform

The backend platform for the Low-Code Kit platform.

## About

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications.

## Getting Started

1. npm ci / install
2. Get docker and docker-compose
3. docker-compose up
4. write a `.env` file with vars as in `.env.example`
5. npm run migrate:latest
6. npm run seed:run
7. npm run start

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
