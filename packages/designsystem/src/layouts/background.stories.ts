import type { Meta, StoryObj } from '@storybook/vue3';

import LayoutBackground from './background.vue';
import PrimeCard from 'primevue/card'

const meta: Meta<typeof LayoutBackground> = {
  title: 'layouts/background',
  component: LayoutBackground,
}
 
export default meta;
type Story = StoryObj<typeof LayoutBackground>;

export const Default: Story = {
  name: 'default one',
  render:() => ({
    components: { LayoutBackground },
    template: `
      <layout-background>
        <p class="text-white">This is a layout background</p>
      </layout-background>
    `
  })
}

export const WithPrimeCardSlot: Story = {
  name: 'with prime card slot',
  render: () => ({
    components: { LayoutBackground, PrimeCard },
    template: `
      <layout-background>
        <prime-card class="bg-white p-4">
          <template #header> This is a header </template>
          <template #title> This is a title </template>
          This is the main part
          <template #footer> This is a footer </template>
        </prime-card>
      </layout-background>
    `
  })
}

export const WithImageAndLogo: Story = {
  name: 'with image and logo',
  render: () => ({
    components: { LayoutBackground, PrimeCard },
    template: `
      <div class="flex flex-col gap-8">
        <layout-background
          background-image-url="/davidrevoy_totoromastodon.jpg"
          logo-image-url="/logo.svg"
          text-bottom-right="This is a version emplacement"
          style="height: 600px"
        />
      </div>
    `
  })
}

export const WithImageLogoAndSlot: Story = {
  name: 'with image, logo and slot',
  render: () => ({
    components: { LayoutBackground, PrimeCard },
    template: `
      <layout-background
        background-image-url="/davidrevoy_totoromastodon.jpg"
        logo-image-url="/logo.svg"
        logo-image-href="/home"
        text-bottom-right="This is a version emplacement"
        style="height: 600px"
      >
        <prime-card class="bg-white p-4 h-full">
          <template #header> This is a header </template>
          <template #title> This is a title </template>
          This is the main part
          <template #footer> This is a footer </template>
        </prime-card>
      </layout-background>
    `
  })
}

export const WithImageLogoAndSlotSmallDevice: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'Small mobile',
    },
  },
  name: 'with image, logo and slot on a small device',
  render: () => ({
    components: { LayoutBackground, PrimeCard },
    template: `
      <layout-background
        background-image-url="/davidrevoy_totoromastodon.jpg"
        logo-image-url="/logo.svg"
        logo-image-href="/home"
        text-bottom-right="This is a version emplacement"
      >
        <div data-v-10a73ced="" class="flex-grow max-w-2xl">
          <a data-v-10a73ced="" class="text-center" href="/">
          <img data-v-10a73ced="" alt="logo" class="mb-4 mx-auto" src="/img/logo-white.svg"
           aria-hidden="true"></a>
           <main class="bg-white/75 m-4 p-4 rounded-md shadow-xl">
           <div class="flex justify-between items-center mb-4">
           <h2 class="text-xl">Authentification
           </h2>
           <select class="py-1 px-2 bg-primary text-white rounded m-2">
           <option value="fr">Français
           </option><option value="en">English</option></select></div>
           <div data-v-5b11e18b="">
           <form data-v-5b11e18b="" novalidate="" class="text-left" data-bitwarden-watching="1">
           <div data-v-5b11e18b="" class="mb-4" name="signInForm.email" value="mda+20@makina-corpus.com">
           <label data-v-5b11e18b="" for="email">E-mail
           </label>
           <input data-v-5b11e18b="" type="email" class="p-inputtext p-component w-full" id="email" name="signInForm.email" required="" autocomplete="email" data-pc-name="inputtext" data-pc-section="root" value="mda+20@makina-corpus.com" pc1="">
           <!---->
           </div>
           <div data-v-5b11e18b="" class="mb-4" name="signInForm.password" value="pouetPOUET1234@">
           <label data-v-5b11e18b="" for="password">Mot de passe
           </label>
           <div data-v-5b11e18b="" class="p-password p-component p-inputwrapper p-inputwrapper-filled w-full" name="signInForm.password" spellcheck="false" autocorrect="off" autocapitalize="none" data-pc-name="password" data-pc-section="root" pc2="" value="pouetPOUET1234@">
           <input type="password" class="p-inputtext p-component p-password-input" id="password" aria-controls="pv_id_1_overlay" aria-expanded="false" aria-haspopup="true" required="" data-pc-name="pcinput" data-pc-extend="inputtext" data-pc-section="root" value="pouetPOUET1234@">
           <!---->
           <i class="p-password-toggle-mask-icon p-password-unmask-icon bi-eye-slash" data-pc-section="unmaskicon">
           </i>
           
           <span class="p-hidden-accessible" aria-live="polite" data-pc-section="hiddenaccesible" data-p-hidden-accessible="true">Enter a password
           </span>
           </div>
           <!---->
           <a data-v-5b11e18b="" href="" class="w-fit my-4 block ml-auto text-xs primary">Vous avez oublié votre mot de passe&nbsp;?
           </a>
           </div>
           <div data-v-5b11e18b="" class="flex flex-col">
           <button data-v-5b11e18b="" class="select-none m-0 rounded-[2rem] text-white border p-2 focus:outline-none focus:ring-2 focus:ring-inset inline-flex enabled:hover:text-white cursor-not-allowed opacity-70 bg-primary border-primary focus:ring-primary-dark enabled:hover:bg-primary-dark enabled:hover:border-primary-dark w-fit !w-full" type="submit" aria-label="Se connecter" disabled="">
           <i class="mx-1 text-white bi bi-save2">
           </i>
           <span class="flex-auto mr-3">Se connecter
           </span>
           </button>
           <div class="my-4 bg-error-lighten border-l-error-light border-l-4 p-1.5 rounded-lck flex" role="alert" aria-live="assertive">
           <i class="bi bi-exclamation-triangle-fill self-center text-error-light">
           </i>
           <div class="ml-2 text-error-light">
           <p>error.notAuthenticated.description
           </p>
           <p>Si ce problème continue de se produire, merci de contacter l'administrateur de l'application.
           </p>
           </div>
           </div>
           <!---->
           </div>
           </form>
           <div data-v-5b11e18b="" class="mt-4 pl-6 flex justify-center">
           <!---->
           </div></div></main>
           <ul class="m-4 md:m-0 mt-8 flex flex-wrap justify-between items-center md:w-full px-4">
           <li class="w-1/2 md:w-auto flex justify-center my-4">
           <a title="PNPC" href="https://portcros-parcnational.fr" target="_blank">
           <img src="/img/logo_pnpc.png" class="w-auto max-h-16">
           </a>
           </li>
           <li class="w-1/2 md:w-auto flex justify-center my-4">
           <a title="Life" href="http://www.natura2000.fr/life/fran%C3%A7ais" target="_blank">
           <img src="/img/life.png" class="w-auto max-h-16">
           </a></li>
           <li class="w-1/2 md:w-auto flex justify-center my-4">
           <a title="Life Marha" href="https://www.life-marha.fr/" target="_blank">
           <img src="/img/marha.png" class="w-auto max-h-16">
           </a>
           </li>
           <li class="w-1/2 md:w-auto flex justify-center my-4">
           <a title="natura2000" href="https://www.natura2000.fr/" target="_blank">
           <img src="/img/natura2000.png" class="w-auto max-h-16">
           </a>
           </li>
           </ul></div>

        <prime-card class="bg-white p-4">
          <template #header> This is a header </template>
          <template #title> This is a title </template>
          This is the main part
          <template #footer> This is a footer </template>
        </prime-card>
      </layout-background>
    `
  })
}
// <docs lang="md">
// ### Layout background

// This layout accept an image to be displayed in the background.

// You can provide a slot to be displayed
// in the center of the layout.
// </docs>
