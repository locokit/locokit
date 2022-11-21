<template>
  <WithThinNavAndSidebar
    v-model:open-panel="openPanelToAddNewWorkspace"
    :can-manage-close-sidebar="false"
  >
    <template v-if="navMenuItems.length > 0" #navMenu>
      <NuxtLink
        v-for="navMenuItem in navMenuItems"
        :key="navMenuItem.label"
        :aria-label="navMenuItem.label"
      >
        <PrimeButton :icon="navMenuItem.icon" />
      </NuxtLink>
    </template>
    <template #main>
      <div
        class="max-w-4xl xl:max-w-6xl mx-auto mt-8"
        @keyup.esc="handlePanelForm(false)"
      >
        <h1 class="text-primary font-medium">
          {{ $t('pages.workspace.title') }}
        </h1>
        <div class="mt-12">
          <h2 class="text-primary">Mes Workspaces</h2>
          <div class="flex lg:gap-4 xl:gap-6 mt-8 flex-wrap shrink-0">
            <div
              v-for="workspace in test"
              :key="workspace"
              class="md-4 box-border lg:w-52 xl:w-56 rounded h-40"
              :class="`${workspace.settings?.backgroundColor} hover:!${workspace.settings?.backgroundColor}`"
            >
              <div
                class="relative overflow-hidden flex flex-col h-full justify-center text-center font-bold cursor-pointer"
              >
                <NuxtLink :class="workspace.settings?.color">
                  <p class="text-2xl">
                    {{ workspace.name }}
                  </p>
                </NuxtLink>
                <i
                  class="absolute -left-3 -bottom-3 text-9xl opacity-10"
                  :class="`pi ${workspace.settings?.icon}`"
                />
                <span
                  v-if="workspace.public"
                  class="px-2 max-w-fit rounded absolute bottom-2 right-2 bg-gray-300 text-black text-sm"
                >
                  {{ $t('pages.workspace.public') }}
                </span>
              </div>
            </div>
            <PrimeButton
              class="md-4 h-40 p-button-link box-border lg:w-52 xl:w-56 !border-dashed !border-2 !border-gray-300 rounded !p-0 hover:!border-primary"
              @click="handlePanelForm(true)"
            >
              <div
                class="relative overflow-hidden flex flex-col justify-center text-center font-bold w-full"
              >
                <i class="pi pi-plus-circle block text-2xl" />
                <p class="block mx-autotext-primary mt-4">
                  {{ $t('pages.workspace.newWorkspace') }}
                </p>
              </div>
            </PrimeButton>
          </div>
        </div>
      </div>
    </template>
    <template #panelHeader>
      <h2>
        {{ $t('pages.workspace.form.title') }}
      </h2>
    </template>
    <template #panelContent>
      <div class="m-4">
        <Form
          v-slot="{ meta: { valid } }"
          class="text-left p-fluid"
          @submit="onSubmit"
        >
          <Field
            v-slot="{ field, errorMessage }"
            v-model="name"
            class="mb-4"
            name="workspace.name"
            rules="required"
            as="div"
          >
            <label for="name" class="label-field-required">
              {{ $t('pages.workspace.form.name') }}
            </label>
            <PrimeInputText id="name" v-bind="field" v-focus required />
            <span
              v-if="errorMessage"
              class="p-text-error"
              role="alert"
              aria-live="assertive"
            >
              {{ errorMessage }}
            </span>
          </Field>
          <Field
            v-slot="{ field, errorMessage }"
            v-model="slug"
            class="mb-4"
            name="workspace.slug"
            rules="required"
            as="div"
          >
            <label for="slug" class="label-field-required">
              {{ $t('pages.workspace.form.slug') }}
            </label>
            <PrimeInputText id="slug" :value="autogenerateSlug" />
            <!--            <PrimeInputText id="slug" v-bind="field" />-->
            <small id="icon-slug">
              {{ $t('pages.workspace.form.slugHelp') }}
            </small>
            <span
              v-if="errorMessage"
              class="p-text-error"
              role="alert"
              aria-live="assertive"
            >
              {{ errorMessage }}
            </span>
          </Field>
          <Field
            v-slot="{ field }"
            v-model="summary"
            class="mb-4"
            name="workspace.summary"
            as="div"
          >
            <label for="summary">
              {{ $t('pages.workspace.form.summary') }}
            </label>
            <PrimeTextarea id="summary" :auto-resize="true" v-bind="field" />
          </Field>
          <Field
            v-slot="{ field }"
            v-model="color"
            class="mb-4"
            name="workspace.color"
            as="div"
          >
            <label for="color">
              {{ $t('pages.workspace.form.color') }}
            </label>
            <PrimeInputText id="color" v-bind="field" required />
          </Field>
          <Field
            v-slot="{ field }"
            v-model="icon"
            class="mb-4"
            name="workspace.icon"
            as="div"
          >
            <label for="icon">
              {{ $t('pages.workspace.form.icon') }}
            </label>
            <PrimeInputText id="icon" v-bind="field" />
            <small id="icon-help">
              {{ $t('pages.workspace.form.iconHelp') }}
            </small>
          </Field>
          <span class="block border-gray-300 border-solid border-2 mb-4" />
          <Field
            v-slot="{ field }"
            v-model="activeSQL"
            class="mb-4"
            name="workspace.activeSQL"
            as="div"
          >
            <div class="flex">
              <PrimeCheckbox id="activeSQL" v-bind="field" />
              <label for="activeSQL" class="mb-0 ml-2">
                {{ $t('pages.workspace.form.activeSQL') }}
              </label>
            </div>
            <small id="activeSQL-help" class="flex">
              {{ $t('pages.workspace.form.activeSQLHelp') }}
            </small>
          </Field>
          <div class="flex flex-col">
            <PrimeButton
              type="submit"
              :icon="loading ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'"
              :label="$t('pages.workspace.form.submit')"
              :disabled="loading || !valid"
            />
          </div>
        </Form>
      </div>
    </template>
  </WithThinNavAndSidebar>
</template>

<script setup lang="ts">
import PrimeButton from 'primevue/button'
import PrimeTextarea from 'primevue/textarea'
import PrimeCheckbox from 'primevue/checkbox'
import PrimeSkeleton from 'primevue/skeleton'
import { useI18n } from 'vue-i18n'
import PrimeInputText from 'primevue/inputtext'
import { Form, Field } from 'vee-validate'
import { ROUTES_NAMES } from '../../paths'
import WithThinNavAndSidebar from '../../layouts/WithThinNavAndSidebar.vue'
import { createSlug } from '../../helpers/transformText'
import { computed, ref, useHead } from '#imports'

const { t } = useI18n({ useScope: 'global' })
// const storeWorkspaces = useStoreWorkspaces()

const openPanelToAddNewWorkspace = ref(false)
const name = ref()
const slug = ref()
const summary = ref()
const color = ref()
const icon = ref()
const activeSQL = ref(false)

const autogenerateSlug = computed(() => {
  if (name.value) return createSlug(name.value)
  return null
})

const onSubmit = () => {}
const handlePanelForm = (value: boolean) => {
  openPanelToAddNewWorkspace.value = value
}
const loading = true

const navMenuItems = [
  {
    label: 'Test',
    icon: 'pi pi-home',
    routeName: ROUTES_NAMES.HOME,
  },
]

const test = [
  {
    name: 'Centre de ressources',
    slug: 'centre_de_ressources',
    documentation: 'blabla',
    public: true,
    settings: {
      color: 'text-yellow-600',
      backgroundColor: 'bg-sky-600',
      icon: ' pi pi-home',
    },
  },
  {
    name: 'CaPeL',
    slug: 'capel',
    documentation: 'blabla',
    public: false,
    settings: null,
  },
  {
    name: 'Aperture',
    slug: 'aperture',
    documentation: 'blabla',
    public: false,
    settings: {
      color: '#ffd859',
      backgroundColor: '#111827',
      icon: ' pi pi-home',
    },
  },
  {
    name: 'Nobu',
    slug: 'nobu',
    documentation: 'blabla',
    public: false,
    settings: null,
  },
]
// await storeWorkspaces.fetch()
useHead({
  titleTemplate: `${t('pages.workspace.title')} | %s`,
})
</script>
