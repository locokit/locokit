# LocoKit - the low-code kit platform

![LocoKit logo](docs/public/logo.png)

LocoKit is an LCAP: a Low-Code Application Platform.
Its aim is to facilitate the management of your data and the collaboration between your users.

It's an AirTable alternative, full open source,
helping you
* share securely your data,
* through an application you build
* and with automatiions trigerred by data updates.


> You are on the `next` branch / version,
> this is a work in progress to upgrade our root dependencies
> and bringing some new nice features.
> Please be aware this version is not stabilized.

## Getting started

LocoKit is a monorepo project, node based,
using [Nuxt 3](https://nuxtjs.org/) for the "front" side,
and [FeathersJS 5](https://dove.feathersjs.com) for the API side.

These instructions are for developers.

Instructions to use with docker will be soon available.

### Installation

**Warning: Future 1.0 release (next) is not ready yet. You might encounter build errors,**
**please consider opening issues for any problem you would encounter.**

**Considering the previous statement, please be kind, the actual procedure requires**
**many steps in order to do the initial project setup until the tooling is improved.**

First prepare tooling:

```sh
cd /path/to/locokit
nvm install # on first run
nvm use # to use the right node version
npm i -g pnpm # install pnpm
pnpm i --frozen-lockfile # to use exactly what the pnpm-lock.yaml already resolved
```

The last step should install Turbo which is used for building all the packages.

Prepare the API server:

```sh
cd /path/to/locokit
cp ./api/.env.example ./api/.env
```

Example env file requires you to have the docker compose project running, if you wish to
run a development environment, simply start it now:

```sh
cd /path/to/locokit
docker compose up -d
```

Alternatively, you may edit the `api/.env` file instead in order to use another database
you have set up differently, case in which the docker compose step is unnecessary.

Now you may build the dependencies a first time:

```sh
pnpm run run:dev:api
# Then hit CTRL+C once finished.
```

And do the initial database prepare step:

```sh
cd /path/to/locokit
cd ./api
pnpm run migrate:latest # run migrations that creates the database
pnpm run seed:run-init # optional: creates some mock user accounts
```

Now you are ready to run the API server and start coding:

```sh
cd /path/to/locokit
pnpm run run:dev:api
```

You can now access the Swagger API documentation on http://localhost:3030/swagger.html

If you run the optional seed which creates the mock user, you can run this in order to fetch
a valid access token for later API calls:

```sh
curl -X POST "http://localhost:3030/auth/authentication" \
  -H 'accept: application/json'\
  -H 'content-type: application/json' \
  -d '{"strategy":"local","email":"admin@locokit.io","password":"locokit"}'
```

And you're ready to go!

### Starting the API

The API actually need a SMTP server.

We provide a `docker-compose.yml` at the root level
containing a [MailHog](https://github.com/mailhog/MailHog) configuration.

You need to have `docker` and `docker-compose` installed.

```sh
docker-compose up # will start your mailhog container on 1025 (smtp) and 8025 (web UI) ports
```

No environment variables are required for the docker containers.

For the API, we need to create a `.env` file.

There is an example in the `.env.example` file.

If you want to make tests running on your machine,
you'll need also to create a `.env.test` file to create another database,
for testing purpose only.
You'll mainly need to overwrite the `LCK_DATABASE_URL` variable
with the connection string to the test database.

```sh
# in the api directory
npm run dev # that'll use ts-node
# or
npm run vite:dev # will use vite
```

You should have now your API up and running on `http://localhost:3030`.

### Starting the nuxt-locokit module

The `nuxt-locokit` module is the main part of the application.

The `app` directory is a proof of reuse of the `nuxt-locokit`.

To develop the front-end part of LocoKit,
it's in the `nuxt-locokit` and the `designsystem` packages.

```sh
# in the packages/nuxt-locokit directory
npm run dev
```

# French explanations / explications françaises du projet

Le projet LocoKit next fait un pari sur
les nouvelles versions de plusieurs dépendances : Nuxt, Feathers, ...

Nous pensons que cela pourra être des opportunités
pour plus tard, en terme de formation, compétences, ...

# Architecture

Approche modulaire :

## Côté API

Basé sur du FeathersJS,
on partirait sur l'idée de permettre à des développeurs
d'enrichir la brique API de LocoKit avec une architecture de dossiers.

L'API LocoKit sera dockerisée,
et avec un montage de volumes précis (par ex. sur le dossier "plugins" ou "modules" ou "extensions"),
les développeurs pourraient mettre leurs dossiers, qui contiendrait
un fichier `index.js` avec une fonction appelée par LocoKit.

Cette fonction prendrait en paramètre l'application LocoKit,
et les développeurs pourraient étendre son fonctionnement.

Il y a probablement de l'inspiration à reprendre des modules Nuxt,
qui expose une fonction `defineNuxtModule` et qui contient une autre fonction `setup`.

## Côté Front

Basé sur Nuxt 3,
on partirait sur l'idée de permettre à des développeurs
* d'utiliser le backoffice de LocoKit indépendamment du frontoffice
* d'étendre les composants, le routage (sans écrasement des routes déjà existantes), les layouts et possiblement des fonctions helpers / composables / ... ?

Cela signifie qu'on pourrait avoir différents modules :
* un premier module de design system (composants principalement)
* un module de backoffice, qui utiliserait celui du design system
* un module de frontoffice, qui utiliserait également le module design system

Cela nous permettrait de choisir, pour un client donné,
d'activer le ou les modules utiles pour ce projet.
Et d'ajouter de nouveaux modules au sein de ce projet.
Que ce soit un front spécifique, un nouveau bloc, un nouveau composant, etc.

On pense que ça serait plus modulable que la stack actuelle,
et pourrait favoriser une réutilisation à façon des briques de LocoKit.

L'ensemble des paquets (modules, API, ...) sera versionné avec du semver,
et nous devons rester vigilant sur les compatibilités entre dépendances.
Par exemple, le module backoffice devra bien spécifier la version
du module design system pour garantir la compatibilité ascendante entre paquets.

# Consignes de développement

## Installation des plugins sur IDE

Pour VS Code

* eslint
* prettier
* voltar

Pour IntelliJ

Réglages à faire sur les IDE :

* normalement pour vs code, il y a les settings déjà enregistrés dans le répertoire .vscode (à voir si ça marche)

# Briques de développement

* Histoire en remplacement de Storybook
  * à voir pour activer les storyshots / imageshots
* Nuxt 3 en remplacement de Vue 2
* PrimeVue 3 en remplacement de PrimeVue 2
* Feathers 5 en remplacement de Feathers 4
* vitest pour le front (?) à la place de Jest
* TypeScript + Prettier + Eslint côté qualité, avec règles partagées entre api, app, packages
* vee-validate / vuelidate ? (à voir cablage avec Prime)
* date-fns
* pinia pour la mise en place d'un store (actuellement nous n'en avons pas implémenté)
* Node 18 avec fetch (ou node 16 avec fetch activé)
* vitepress / nuxt docs ?
* maplibre
* vue draggable / mode dashboard

## Git Commit Messages

Inspired and copied from https://github.com/Schneegans/dynamic-badges-action#git-commit-messages

Commits should start with a Capital letter and should be written in present tense (e.g. __:tada: Add cool new feature__ instead of __:tada: Added cool new feature__).
You should also start your commit message with **one** applicable emoji. This does not only look great but also makes you rethink what to add to a commit. Make many but small commits!

Emoji | Description
------|------------
:tada: `:tada:` | When you added a cool new feature.
:sparkles: `:sparkles:` | When you added a little but necessary feature.
:wrench: `:wrench:` | When you refactored / improved a small piece of code.
:hammer: `:hammer:` | When you refactored / improved large parts of the code.
:art: `:art:` | When you improved / added assets like themes.
:rocket: `:rocket:` | When you improved performance.
:memo: `:memo:` | When you wrote documentation.
:beetle: `:beetle:` | When you fixed a bug.
:fire: `:fire:` | When you removed something.
:truck: `:truck:` | When you moved / renamed something.
