# LocoKit - Vue components library

This repository holds VueJS components.

Those components are used in the LocoKit back-office application,
and can also be used for front-office applications.

The storybook of this library is available here:

https://????

## Getting started

On a VueJS project, you can install this library :

`npm install @locokit/vue-components`

Each component is exposed through a dedicated file if needed.

To import them, you can :

```js
// import separately
import { SingleTag } from '@locokit/vue-components'
// then use it with <single-tag /> or <SingleTag />

// import components & layouts
import { components, layouts } from '@locokit/vue-components'
// then use <components.SingleTag />
```

**@locokit/definitions**

`npm install @locokit/vue-definitions`

**i18n**

This library use `vue-i18n` and the `t` function for translation purpose.

**primevue**

This library use `primevue` components.

And so your project needs it too.

See https://primevue.org/vite/ for further information.

**tailwindcss**

You need to have installed Tailwind CSS,
as it is not bundled in the `vue-components` package.

Please see https://tailwindcss.com/docs/guides/vite#vue for an installation process.

You can add some configurations in your `tailwind.config.{ts,js}` file:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    ...
    // adding the vue-components is mandatory to detect all used classes
    './node_modules/@locokit/vue-components/dist/**/*.js',
  ],
  ...
  safelist: [
    // add also this bg-slate safelist
    {
      pattern: /bg-slate-(100|200|300|400|500|600|700|800|900)/,
    },
  ],
}
```

**tailwindcss-primeui**

We advise you to install also `tailwindcss-primeui` for better tooling
between PrimeVue and TailwindCSS.

See https://primevue.org/tailwind/

At the end, in your `main.ts` file, when adding the `PrimeVue` plugin,
you should have something like this:

```ts
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config'
import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'
import { TAILWIND_COLORS } from '@locokit/definitions'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: definePreset(Aura, {
      semantic: TAILWIND_COLORS,
    }),
    options: {
      cssLayer: {
        name: 'primevue',
        order: 'tailwind-base, primevue, tailwind-utilities',
      },
    },
  },
})
app.mount('#app')

```

## For library developers

A storybook is included in this project.

`pnpm dev` will run it.

Accessibility a11y addon is included.

Tests also ?

To run tests, ... ?
