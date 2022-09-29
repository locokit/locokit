# Architecture front de LocoKit

Le projet open source LocoKit a démarré en 2020.

À cette époque, techniquement parlant,
nous nous sommes orientés sur VueJS 2,
avec le routeur officiel, et un StoryBook.

Les tests unitaires avaient été réalisés avec Jest
ainsi qu'un plugin pour le storybook afin de disposer d'"imageshots". (mettre référence)

Après deux ans de développement de LocoKit,
nous avons souhaité prendre du recul
sur les fonctionnalités intégrées,
mais aussi sur les briques techniques utilisées.

Ce premier article vise à expliquer les choix
que nous avons effectués côté front-end.

# VueJS 2 à ... Nuxt 3 !

2021 a été l'année de la sortie officielle de VueJS 3.

Nous savions que LocoKit serait migré à VueJS 3
pour garantir sa maintenabilité dans le temps.

Nuxt 2 n'était pas, en 2020, une option que nous avions envisagé.
Par méconnaissance, en grande partie,
mais aussi par manque d'intérêt sur un nouveau projet.

Après observation des usages de nos différents clients,
nous pensons que Nuxt, le "meta-framework" de VueJS 3
peut représenter un intérêt pour LocoKit, et ce à plusieurs niveaux :
* le mode SSR (Server Side Rendering) qui pourrait apporter une performance accrue pour la première page visitée par les utilisateurs
* le système de modules qui nous paraît utile pour rendre LocoKit configurable, ou extensible
* le respect de conventions, ce qui permet d'avoir **une** façon de construire le projet

À l'heure où j'écris ces lignes,
Nuxt 3 n'est toujours pas en version stabilisé.
Et nous avons pris le risque de partir avec la version RC (release candidate).
L'API semble suffisamment stable pour que nous
mettions en place cette nouvelle stack.

Les premiers essais, et notre idée de modularité,
nous ont permis de valider plusieurs points :
* Nuxt est déjà très stable
* il utilise vite "en dessous", ce qui lui confère une rapidité pour le développement
* Visual Studio Code dispose de plugins (Voltar) déjà compatible à Nuxt 3
* l'équipe derrière Nuxt est très réactive et produit des versions très régulièrement
* la fabrication du module **nuxt-locokit** nous permet de mieux comprendre l'architecture de Nuxt, et nous permet de confirmer l'utilisation de Tailwind CSS (règles CSS) combiné à Prime Vue (design system)

# De storybook à ... Histoire !

Sur la première itération de LocoKit,
nous avons mis en place un storybook,
et nous avons eu - parfois - de grosses difficultés
à monter les versions de StoryBook,
ou à utiliser des plugins qualité tel que **image-snapshot**.

Deux développeurs français ont lancé récemment
une alternative qui s'appelle Histoire (pour faire honneur à cette langue de Molière, il ne vous aura pas échappé que VueJS, Vite et Histoire sont des mots français...).
L'avantage d'Histoire, c'est qu'il est beaucoup plus rapide (avec vite en dessous, toujours),
et directement compatible avec VueJS (StoryBook étant écrit en React) mais pas que (Svelte aussi par ex.).

L'écriture de nos stories est - pour nous en tout cas -
plus simple qu'avec StoryBook, et nous avons réussi
à porter facilement une bonne dizaine de stories
précédemment sur StoryBook.

Le plugin **image-snapshot** que nous avions mis en place
a son alter ego également en Histoire : [citer le nouveau paquet].
Sa mise en place sur notre repo, à travers GitHub Actions
s'est fait [dans la douleur / facilement].

# La mise en place d'un store avec Pinia



# La création d'un module Nuxt, et de son design system associé

Avec cette nouvelle itération de LocoKit,
nous souhaitons permettre à nos utilisateurs, contributeurs
et développeurs d'utiliser des morceaux de LocoKit,
à leur convenance.

Nous avons imaginé un découpage de l'application front-end
avec un module Nuxt, pour l'instant.

Lors de la fabrication de ce module,
nous avons rencontré des difficultés pour le configurer.
La version de Nuxt n'étant pas suffisamment documentée,
il nous était assez délicat de construire correctement le module.

Nous avons donc itéré afin de pouvoir :
* créer des composants dans le module
* créer des layouts dans le module
* créer des pages dans le module
* mettre à disposition ces composants, layouts et pages au sein de l'application utilisant ce module
* permettre au développeur de paramétrer plusieurs éléments : préfixe des routes, layouts à utiliser, ou même surcharger des pages précises

L'idée étant d'ajouter ce module à des projets existants,
ou de n'utiliser qu'une partie du module par exemple.
Il nous a paru utile de permettre au développeur
d'intégrer uniquement le backoffice, et pas nécessairement le frontoffice,
si un besoin de customisation fort était souhaité.
