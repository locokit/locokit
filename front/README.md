# Low-Code Kit Frontend Platform

The frontend for the Low-Code Kit platform.

## Getting Started

see the [README](../README.md) above.

### Dependencies installation

```bash
npm ci
```

A postinstall copy some patches directly in the `node_modules` directory,
waiting for our PR to be merged.

### Configuration

**`public/config.js`**

This file contains a `LCK_SETTINGS` variable
allowing the app to know some settings like the API URL, the localStorage key, ...

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

### Customize configuration

A configuration file is present in `public/config.js`.

```js
const LCK_SETTINGS = {
  API_URL: 'http://localhost:3030',
  LOCALSTORAGE_KEY: 'lck-auth',
  SENTRY_DSN: '', // here you can set your SENTRY_DSN, please check sentry documentation
  SENTRY_ENV: 'local',
  STORAGE_PATH: 'http://localhost:8000/storage'
}
```

You can write your own configuration settings here,
when you deploy this front, you will have to override these settings
to match your environement configuration.

## Contribute

If you encounter a bug, please submit an issue.

If you want to contribute to the code,
first ask to the team where to begin (with an issue).

1. create an issue, or be assigned on an issue
2. put the issue in the "Doing" column of the board
3. create a local branch prefixed by the issue's id (this help gitlab to wire issue / branch / MR)
4. add some tests / stories for the code you're writing
5. when your work is ok for you, push it to the repo
6. create a MR
7. check the CI is ok. CD is configured too, you could check your storybook & on surge.sh to see if it's working (this will help us for the review process)
8. if all is green, put your issue in "To be reviewed" column of the board
9. affect your MR to someone in the team to be reviewed
10. maybe you'll have to take in consideration some aspects of your code, so discuss and take in consideration the remarks (restart to 4.)
11. if review is ok, the reviewer will approve it
12. now, you can merge it !!!... Congratulations !
