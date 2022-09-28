Le design system au sein de LocoKit.

LocoKit permet de fabriquer des applications,
depuis la base de données jusqu'aux interfaces d'application
en passant par la gestion des permissions.

Pour ses interfaces, nous avons un ensemble de composants
à assembler.

Jusqu'alors, les composants faisaient parti du projet principal,
à savoir le dossier `/front`.

Pour cette nouvelle itération de LocoKit,
nous réfléchissons à la manière de les créer,
tester et maintenir au moyen-long terme.

Nous avons réfléchi sur la question suivante :

Devons nous fabriquer un design system dans un `package` (paquet npm) dédié
pour qu'il puisse être utilisé librement,
* dans une application VueJS,
* ou dans le module nuxt de manière indépendante,
et ainsi disposer de ses propres tests, stories,

Ou devons nous juste rajouter les tests unitaires,
et les stories des composants dans le module nuxt ?

# Nuxt modules vs design system dédié ?

Nous avons essayé d'avoir un design system, dans un `package` dédié.

Cela implique que nous devons gérer la traduction, tailwind et PrimeVue,
au sein de ce paquet.

Il y a également un sujet sur les liens,
à savoir les composants `nuxt-link` et `router-link`,
qui nécessitent respectivement Nuxt ou vue-router.

## Concernant les traductions

Nous nous sommes posés la question suivante :

Devons nous intégrer la bibliothèque vue-i18n avec des fichiers de localisation ?
Ou bien, devons nous transformer nos composants pour qu'ils disposent
des propriétés de label à afficher dans les composants ?

Nous avons réussi à injecter vue-i18n,
et en mettant à disposition le fichier de traduction,
les composants affichent la langue par défaut au seins des stories.

Si on garde le designsystem en `package`, il serait possible de créer également
un package de traduction, qui contiendrait les fichiers de traductions actuels, `en.json` et `fr.json`.
Ce paquet serait utilisé à la fois par `designsystem` et `nuxt-locokit`.
Ainsi, la traduction serait centralisée.


Dans le cas où un client souhaiterait surcharger les traductions,
que ce soit pour une application VueJS qui utiliserait l'hypothétique `designsystem`
ou pour le module `nuxt-locokit` qui autoriserait (ce qui n'est pas le cas)
de surcharger la traduction, on pourrait imaginer la solution suivante :

```ts
import { App } from 'vue'
import { createI18n } from 'vue-i18n'

import en from '@locokit/i18n/en.json'
import fr from '@locokit/i18n/fr.json'

export function definePluginI18n(app: App): void {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    messages: {
      // ici, nous surchargeons la clé components.login.email
      en: {
        ...en,
        components: {
          ...en.components,
          login: {
            ...en.components.login,
            email: 'pouet',
          },
        },
      },
      fr,
    },
  })

  app.use(i18n)
}
```

Ainsi, les projets qui utiliseraient ces paquets pourraient surcharger
la traduction officielle.

## Concernant les `router-link` / `nuxt-link`

Après analyse du code actuel,
il apparaît que seuls les composants `login.vue` et `sidebar.vue`
comportent des `router-link`.
Pour `login.vue`, en les remplaçant par des `<a>`,
ça ne pose pas de souci.
A priori, ça ne devrait pas poser de souci non plus côté `sidebar.vue`.

## Concernant PrimeVue

Il faudra, pour l'instant, l'ajouter à l'application VueJS
qui utilisera le design system.

Il serait intéressant de fournir un mécanisme du style `app.use(locokit)`,
comme on peut faire `app.use(PrimeVue)`.

Cela permettrait d'ajouter `vue-i18n`, `PrimeVue`, et le nécessaire
pour que l'application VueJS ait ce qu'il faut pour démarrer.

## Concernant TailwindCSS

Histoire est capable de détecter automatiquement la configuration Tailwind.

Nous avons reporté le thème (variables CSS) dans le projet `designsystem`,
repris la configuration de TailwindCSS, et "ça marche" directement.

Nous avons à reprendre la CSS de Prime également,
au fur et à mesure de nos migrations de composants.


## Bibliographie

https://storybook.js.org/blog/internationalize-components-with-storybook/

https://lokalise.com/blog/how-to-design-a-multilingual-web-or-mobile-app-using-lokalise-plugin-for-adobe-xd/

https://phrase.com/blog/posts/how-to-create-good-ux-design-for-multiple-languages/


Dans le module Nuxt, seront nécessairement présent `vue-i18n`,
les tests unitaires (vitest) / e2e (? cypress / autre), et des stories basées sur Histoire.
Ces stories seront a minima des stories de pages.
La question se pose autour des composants.

Si demain, un client souhaiterait changer les traductions,
* est ce que nous l'autorisons ?
* est ce que c'est faisable ?
Personnellement (mda), je pense que c'est pas une bonne idée.
L'idée de la traduction c'est qu'elle soit communautaire.
Pour autant, s'il part sur une application VueJS,
on imagine qu'il utilisera le paquet `designsystem` qui se base sur `vue-i18n` pour la traduction.
Lorsque le storybook Histoire est instancié,
nous le configurons avec une instance i18n configurée avec les fichiers de traduction de LocoKit.
Rien n'interdit, techniquement parlant, au client de créer son application VueJS
et d'instancier `vue-i18n` en lui donnant un autre fichier de localisation.

Si on applique le même raisonnement pour Nuxt,
le client instancierait son application Nuxt,
installerait le module `nuxt-locokit`,
on pourrait imaginer permettre au client
d'écraser les localisations fournies.

## Conclusion

Pas de besoin client avéré à ce jour.

Peut nous organiser/structurer dans nos développements

Représente un moindre risque de le faire maintenant que plus tard,

Et si besoin de faire un rollback, la migration `designsystem` => `nuxt-locokit` semble plus facile que l'inverse

Peut-être également un intérêt sur la séparation des "concerns",
les composants ne pourront avoir accès au store par exemple.

=> on valide l'idée d'essayer le `designsystem`
