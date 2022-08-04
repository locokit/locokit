Documentation de LocoKit Next.

Cette documentation vise à expliciter les cibles à atteindre
pour LocoKit, sur une évolution en profondeur de l'outil.

# Constat

À ce jour, LocoKit est un outil fonctionnel, qui est capable de :
* permettre la modélisation d'un ou plusieurs modèles de données à travers une UI nocode
* gérer la donnée à travers une UI "type" tableur
* créer des interfaces de visualisation / modification de la donnée
* gérer au niveau ligne les permissions
* déclencher des webhooks à partir de la modification/création de la donnée

Le stockage de la donnée est propre à LocoKit.
Il n'a pas à ce jour la compétence de se greffer à une base déjà existante.
Si un utilisateur souhaite utiliser de la donnée existante,
nous devons soit créer un modèle qui mime sa base existante et importer
la donnée, soit introduire des mécanismes de synchronisation
potentiellement lourd, dangereux et coûteux.

Nous rencontrons des clients actuellement qui ont des besoins
de partager la donnée avec une gestion fine des permissions,
mais sur une donnée déjà existante, dans des bases pour l'instant "simples".

Une évolution souhaitée et souhaitable de LocoKit est de lui ajouter
cette compétence d'accéder à des bases existantes. 
C'est une stratégie que des outils comme Directus, Budibase ou NocoDB ont intégré.

Par ailleurs, la stack de LocoKit va devenir délicate à maintenir d'ici 1 à 2 ans.
Or, nous souhaitons pouvoir maintenir l'outil au delà.
Nous avons donc à anticiper une montée des versions des bibliothèques - frameworks
que nous utilisons en dessous : Vue 2 > 3, Feathers 4 > 5, Prime 2 > 3, etc.

Nous souhaitons également permettre une plus grande modularité
dans l'usage de LocoKit, à savoir disposer d'un coeur qui pourrait
être utilisé ailleurs que dans la plate-forme LocoKit.

C'est également l'occasion de tester d'autres briques, type Nuxt,
qui pourraient apporter des améliorations sur l'architecture de LocoKit.

# Architecture

À ce jour, LocoKit est découpé en 2 grandes parties, le front et le back.
Le front est une SPA / PWA en VueJS 2 et le back une API REST écrite
avec Feathers 4, et un ORM/Query builder basé sur Objection et Knex.

Nous souhaitons éclater cette architecture en plusieurs morceaux :
* lck-engine 
  * moteur de LocoKit, capable d'inférer des données de sources de données distantes
  * dispose d'adapter pour faire de l'API over SQL, API over API, ou peut-être encore d'autres sources de données
  * dispose d'un meta modèle permettant de stocker la structure des sources de données distantes
* lck-backend
  * API REST / GraphQL basée sur Feathers 5 et lck-engine
  * expose une mécanique d'authentification et de guards / gestion de permissions
* lck-frontend
  * portail web qui s'appuie sur VueJS 3, PrimeVue3, et peut-être Nuxt 3
  * s'interface avec lck-backend pour chercher la donnée
* lck-designsystem
  * ensemble des composants web utilisables par lck-frontend
  * reprend les composants PrimeVue3 et les enrichit potentiellement
* lck-typings
  * contient les types de données (TypeScript) qui pourront être utilisés à travers les différents packages
* lck-sdk
  * brique technique permettant d'attaquer "simplement" un backend LocoKit
  * pourrait intégrer des modules d'intégrations pour la composition API de Vue, ou un module Nuxt par ex.

L'idéal serait de disposer de briques réellement modulables, réutilisables dans d'autres technos que les choix que nous faisons.
Par exemple, lck-engine pourrait être "framework agnostic" (indépendant de Feathers) pour pouvoir être réutilisé dans d'autres frameworks (par ex NestJS, ou Fastify directement), tout comme le sdk.

Une preuve de cette modularité pourrait être d'arriver
à construire un "front" basé sur le SDK, le paquet lck-engine
indépendamment des autres projets (backend, frontend, designsystem).
Et ajouter un module qui permettrait d'augmenter le backend,
avec pourquoi pas des traitements dédiés à un workspace en particulier,
qui serait "fixe", il connaîtrait d'avance la structure du workspace.