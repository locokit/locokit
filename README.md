# LocoKit - the Low-Code Kit Platform

![LocoKit logo](docs/public/logo.png)

Welcome on the monorepo of [LocoKit, aka Low-Code Kit platform](https://locokit.io).

LocoKit is an AirTable alternative, providing database management as a spreadsheet and an app builder.

There is the backend part (`api` folder),
the frontend (`front` folder),
the documentation (`docs`)
and several packages. (only `glossary` actually).

## Getting started

Initialize node modules:

For each directory (`api`, `front`, `docs`, `glossary`), you need to:

```bash
npm ci # install deps
```

From here you need [docker](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository) and [docker-compose](https://docs.docker.com/compose/install/) in recent version.

In the `front` directory, 
you need to create a `.env` file from the `.env.dist`. Then in `public`, you also need to create a `config.js` file from the `config.js.dist`. [View the full config reference](#customize-configuration).
```
cp .env.dist .env
cp public/config.js.dist public/config.js
```

In the `api` directory,
same thing, but with the `.env.example` file.
```
cp .env.example .env
```

```bash
docker-compose up # you can add -d to use the daemon option of docker-compose

# in another terminal
npm ci
npm run migrate:latest
npm run seed:run
npm run start
```

The default user created is `superadmin@locokit.io` with password `locokit`.

## API


### Swagger

A swagger is available on http://localhost:3030/swagger/ once the project has started.

This is made with [RapiDoc](https://mrin9.github.io/RapiDoc/).

### Restore a dump

You can restore any staging / production dump you have access to by putting them
in the `dumps` folder.

This folder is shared with the postgres dockers. (`lck-db` and `lck-db-test`)

For restoring a dump :

```bash
docker exec -it lck-db bash
pg_restore --no-owner --clean -d public -U postgres -W /dumps/your_dump # you'll have to enter the password yourPostgresPassword
```

### Scaffolding

Feathers has a powerful command line interface. Here are a few things it can do:

```
$ npm install -g @feathersjs/cli          # Install Feathers CLI

$ feathers generate service               # Generate a new Service
$ feathers generate hook                  # Generate a new Hook
$ feathers help                           # Show all commands
```

## Front end
### Configuration

**`public/config.js`**

This file contains a `LCK_SETTINGS` variable
allowing the app to know some settings like the API URL, the localStorage key, ...

```js
const LCK_SETTINGS = {
  API_URL: 'http://localhost:3030',
  LOCALSTORAGE_KEY: 'lck-auth',
  SENTRY_DSN: '', // here you can set your SENTRY_DSN, please check sentry documentation
  SENTRY_ENV: 'local',
  STORAGE_PATH: 'http://localhost:8000/storage'
}
```

This file is used at runtime, so you could customise it
when you deploy the app.

You have an example in the `public/config.js.dist` ready to be used
with the `lck-api` project.
Copy paste this file in a new `public/config.js` and it should do the trick.

**`.env`**

Same for this file, you'll find an example at the root in `.env.dist` file.

This file contains more global variables used at compilation time.

As you can't change these vars after compilation time,
we have made a special `index.html` file to be a template when the build is done.
You'll find after build in the `dist/index-template.html` file.
This file contains the `.env` variables in an template-handlebar syntax.

This allows you to compile only the html file if you need
to customize these vars before deploy.
We've made a node script for that, in `scripts/compileTemplate.js`
that you can trigger with `npm run build:html`.
If you use it in a CI environment,
you could give to your CI some env vars that will be injected in your html file.

### Compiles and hot-reloads for development

```bash
npm run serve
```

### Compiles and minifies for production

```bash
npm run build
```

You'll get an `index-template.html` file in the `dist` folder.
You can use the `npm run build:html` if you want to customize the title or other vars.

### Run your unit tests

* only stories of the storybook

```bash
npm run test:unit-stories
```

* run stories and update imageshots

```bash
npm run test:update-imageshot
```

* except stories

```bash
npm run test:unit-src
```

* all unit tests

```bash
npm run test:unit
```

### Lints and fixes files

```bash
npm run lint
```

### Storybook

```bash
npm run storybook:serve
```

Every story in the project is snapshoted + imageshoted.

We use the addon storyshot of storybook, for both snap and images.

Sometimes, an imageshot need to wait for an element, wait for its DOM injection.

Sometimes too, there are animations that slow the process of taking the screenshot.

For every story you write, you can add an arg `waitForSelector` that would be a CSS selector,
and we use it to tell puppeteer (used under the hood by storyshot for imageshot)
to wait the DOM element with the CSS selector you define is really in the DOM.

We encounter lots of issues on Mac OS, so if you use this OS,
don't worry if your CI is broken. Ask a developer with a Linux OS to update your shots.

The storybook of the master branch is available on http://lck-storybook.surge.sh/.


You can write your own configuration settings here,
when you deploy this front, you will have to override these settings
to match your environement configuration.

## Contribute

If you encounter a bug, please submit an issue.

If you want to contribute to the code,
first ask to the team where to begin (with an issue).

1. create an issue, or be assigned on an issue
2. put the issue in the "Doing" column of the board
3. create a local branch prefixed by the issue's id (`23-add-of-a-new-feature` or `23-fix-this-horrible-bug`)
4. add some tests / stories for the code you're writing
5. when your work is ok for you, push it to the repo
6. create a MR
7. check the CI is ok. CD is configured too, you could check your storybook & on surge.sh to see if it's working (this will help us for the review process)
8. if all is green, put your issue in "To be reviewed" column of the board
9. affect your MR to someone in the team to be reviewed
10. maybe you'll have to take in consideration some aspects of your code, so discuss and take in consideration the remarks (restart to 4.)
11. if review is ok, the reviewer will approve it
12. now, you can merge it !!!... Congratulations !
