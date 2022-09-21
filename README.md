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
