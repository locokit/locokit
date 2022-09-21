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

# Stratégie

La stratégie de LocoKit, au regard du marché actuel,
consiste à proposer une solution low-code 100% libre,
disposant d'un SAAS,
permettant de créer des solutions métiers applicatives de manière autonome,
interopérable avec le maximum de bases,
permettant de créer des interfaces utilisateurs avancées
et dans lequel les utilisateurs se sentent à l'aise, agréable,
et arrivent à fabriquer ce qu'ils imaginent.

Je ne pense pas que nous devons viser à être l'acteur principal,
mais un des acteurs majeurs dans le libre,
et un acteur concurrent des solutions non libres.

La dimension libriste du projet doit favoriser une émulation,
une adoption par les utilisateurs, et la création d'une communauté
bienveillante pour permettre à tout un chacun de concevoir
et fabriquer les outils numériques dont il a besoin.

Nous devons également être une solution permettant de partager
la réalisation des différents créateurs d'outils,
pour là aussi créer une communauté d'utilisateurs et de concepteurs.

Plusieurs solutions existent, libres et non libres.

Deux solutions libres paraissent très prometteuses : Directus et Budibase.
Pourquoi ?
Elles proposent une interopérabilité avec plusieurs types de base,
un éditeur d'interface (très avancé sur Budibase),
et un déclenchement de workflows paramétrable.

Un dernier axe de développement de LocoKit pourrait également
être orienté autour de la consommation d'énergie du numérique.
Orienter les concepteurs / utilisateurs pour fabriquer
des outils "sobres" pourrait être un challenge à notre niveau.
Comment faire que LocoKit soit reconnu à ce niveau là ?
Nous devrons probablement mesurer sa consommation énergétique,
ses performances en terme de consommation CPU / RAM / temps,
et peut-être la comparer à d'autres outils équivalents
sur un plan fonctionnel.
Une idée sur la première itération de LocoKit
était de le faire tourner sur un Raspberry.
Cela n'a jamais vraiment abouti.
Cela pourrait être un objectif sur cette itération.

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

# Objectifs

* [x] évaluer pertinence de Nuxt 3
  * [ ] mode SSR
  * [x] modules Nuxt
  * [ ] exposition de l'API directement par Nuxt
* [x] évaluer pertinence Pinia
  * [ ] gestion avec Vue 3 et la composition API
  * [ ] mise en perspective par rapport à LocoKit 0.x.x
* [ ] évaluer pertinence schéma Feathers
  * [ ] mise en commun du typage entre front et back
  * [ ] inférence du typage
* [x] architecture monorepo améliorée
  * [ ] règles de qualité communes à travers les packages (eslint, prettier)
  * [x] même version de TypeScript sur tout le projet
  * [x] utilisation des packages npm
* [x] découpage du projet en packages
  * [x] lck-engine, réutilisable dans le backend et possiblement ailleurs ?
  * [ ] lck-designsystem, contiendrait également un storybook / basé sur histoire ?
  * [ ] nuxt-locokit, contient le module nuxt, avec les composants, layouts, pages, styles... du design system ? (ou alors tout est ici)
* [ ] création d'une API dynamique selon les sources de données
  * [ ] avec un Swagger dynamique
  * [ ] avec du GraphQL
* [ ] gestion du temps réel avec les sockets
  * [ ] gestion des permissions, création de "salles" différenciées selon les droits
* [ ] génération de SDK
  * [ ] statique, pour LocoKit lui-même
  * [ ] dynamiques, propre à chaque workspace, en JS et TS
* [ ] authentification
  * [ ] gestion de l'OAuth
  * [x] gestion d'une auth "simple" (comme en v1)
  * [x] gestion d'une API key
* [ ] limitations techniques (rate limit pour facturation)
  * [ ] limiter le nombre d'enregistrement par workspace
  * [ ] limiter le nombre de déclenchement de workflow
  * [ ] limiter le nombre de calculs complexes (type formules, champ géomatique) par workspace
  * [ ] limiter le nombre d'écrans
  * [ ] limiter le nombre de groupes d'utilisateurs
  * [ ] limiter le nombre d'appels consécutifs à l'API (sécurité)
* [ ] modularité / extensibilité
  * [ ] arriver à construire des modules d'extension de LocoKit
  * [ ] en proposer des "templates"
* [ ] disposer de journaux applicatifs
  * [ ] écrit ?
  * [ ] monitorable à distance ?
  * [ ] activable à distance ? (niveau de log ?)
* [ ] modules Nuxt
  * [x] disposer de Tailwind CSS dans l'écriture du module
  * [x] disposer des composants PrimeVue3 dans l'écriture du module
    * [x] ajouter des layouts
  * [x] ajouter des composants
  * [x] ajouter des routes dans l'app Nuxt utilisant le module
    * [x] playground
    * [x] app
  * [ ] disposer des composants automatiquement dans l'app Nuxt utilisant le module
    * [x] playground
    * [ ] app
  * [ ] disposer des composants Prime dans une app Nuxt utilisant le module ?
    * [x] dans le playground
    * [ ] dans l'app
    * [x] attention à la CSS ? (différente de Tailwind) => pas d'import de primeflex, privilégier tailwind
    * [ ] il faut ajouter prime en tant que plugin néanmoins ?
  * [ ] disposer de Tailwind CSS dans l'app Nuxt utilisant le module ? (ou pas ?)
    * [ ] vérifié avec l'usage d'une classe CSS absente des composants / layouts / pages du module lui-même
      * [x] dans le playground
      * [ ] dans l'app nuxt utilisant le module
        * [ ] permettre ou pas le fait d'avoir tailwind dans l'app nuxt via options du module locokit
        * [ ] idem pour les composants prime ?
  * [ ] vérifier la possibilité de surcharger Tailwind CSS utilisé dans le module ?
    * [ ] permettrait de reprendre le fonctionnement des thèmes ?
  * [x] vérifier la possibilité de mettre un prefix pour les routes du module
  * [x] pouvoir écraser certaines pages (page d'accueil, de login par ex.)
    * [x] vérifié avec la home page, elle existe dans le module (et enregistrée avec extendRoutes), mais est écrasée dans l'app et le playground si fournie
  * [ ] coté configuration, pouvoir surcharger la configuration
    * [ ] de Tailwind
    * [ ] de prime ?
  * [x] côté conf, pouvoir étendre routage
    * [x] via options du module (par ex. activer/désactiver backoffice)
    * [x] via l'extension de l'app nuxt utilisant le module
* [ ] arriver à produire le build
  * [ ] nuxt
  * [ ] Feathers
  * [ ] et l'envoyer sur un serveur et le faire fonctionner
* [ ] industrialiser déploiement
* [ ] qualité via
  * [ ] tests unitaires back
  * [ ] tests unitaires nuxt
  * [ ] eslint + prettier


Concernant les instances de déploiement de ces expériences,
si elles sont concluantes, nous pouvons organiser l'architecture comme ceci :

* app.locokit.io : service SAAS, avec inscriptions autorisées, stabilisé, redondé, backupé
* demo.locokit.io : service de démo (et staging), avec templates ?
* blog.locokit.io : contiendrait des articles de blog en/fr sur LocoKit, les évolutions et les défis techniques (repris aussi sur blog Makina ?)
* docs.locokit.io : documentation du projet
* locokit.io : site vitrine, traduit en différentes langues, de présentation marketing
