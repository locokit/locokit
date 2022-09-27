<template>
  <div class="container mx-auto">
    <h1 class="my-4 text-primary text-4xl">
      {{ $t('pages.workspace.title') }}
    </h1>

    <div class="p-grid">
      <div v-if="loading" class="p-col-12 p-md-4 p-lg-3 workspaces-item">
        <div class="workspaces-button">
          <div class="workspaces-detail">
            <p-skeleton
              class="workspaces-detail-title"
              width="10rem"
              height="2rem"
            ></p-skeleton>
          </div>
        </div>
      </div>
      <p-button @click="storeWorkspaces.fetch">Reload</p-button>

      <p v-if="!loading && workspaces.length === 0" class="p-col-12">
        {{ $t('pages.workspace.noWorkspace') }}
      </p>

      <div v-for="workspace in workspaces" :key="workspace.id" class="p-col-12 p-md-4 p-lg-3 workspaces-item">
        <div
          class="workspaces-button p-mr-2"
          :style="{
            backgroundColor: workspace.settings.backgroundColor || 'inherit'
          }"
        >
<!--           <router-link
            class="workspaces-detail"
            :to="`${ROUTES.WORKSPACE}/${workspace.id}`"
            :style="{
              color: workspace.color || 'inherit'
            }"
          >
            <p class="workspaces-detail-title">{{ workspace.name || $t('pages.workspace.noName') }}</p>
          </router-link>

          <router-link
            v-if="workspace.isManager"
            class="workspaces-admin"
            :to="`${ROUTES.WORKSPACE}/${workspace.id}${ROUTES.ADMIN}`"
            :style="{
              color: workspace.color || 'inherit',
            }"
            :title="$t('pages.workspace.adminWorkspaceLinkTitle', { workspaceText: workspace.name })"
          >
            <i class="bi bi-sliders"></i>
          </router-link>
 -->
          <i v-if="workspace.icon" class="workspaces-icon bi" :class="workspace.icon" />
        </div>
      </div>

<!--         v-if="$can('create', 'workspace')"
 -->  <div
        :class="'p-col-12 p-md-4 p-lg-3 workspaces-item' + ( !loading && workspaces.length === 0 ? ' p-mx-auto' : '')"
      >
        <button class="workspaces-new" @click="dialogVisible = true">
          <i class="bi bi-file-plus workspaces-new-icon"></i>
          <p class="p-button p-button-sm">{{ $t('pages.workspace.form.new') }}</p>
        </button>
      </div>

      <lck-dialog
        :header="$t('pages.workspace.form.create')"
        :modal="true"
        :visible="dialogVisible"
        @update:visible="dialogVisible = false"
      >

        <lck-workspace-form
          :submitting="submitting"
          @cancel="dialogVisible = false"
          @input="createWorkspace"
        />

      </lck-dialog>
    </div>

  </div>
</template>

<script setup lang="ts">
// import { ROUTES, ROUTES_NAMES } from '@/router/paths'
// import { AuthState, authState } from '@/store/auth'
// import { ColorScheme, COLOR_SCHEME } from '@/services/lck-utils/color'

import PSkeleton from 'primevue/skeleton'
import PButton from 'primevue/button'
import { Ref, ref } from 'vue'
import { ROUTES } from '../paths'

import { useStoreWorkspaces } from '../../store/workspaces'
import { computed } from '@vue/reactivity';

const storeWorkspaces = useStoreWorkspaces()

await storeWorkspaces.fetch()

const loading = computed(() => storeWorkspaces.loading)
const workspaces = computed(() => storeWorkspaces.workspaces?.data)

// import WorkspaceForm from '@/components/visualize/WorkspaceForm/WorkspaceForm.vue'
// import Dialog from '@/components/ui/Dialog/Dialog.vue'

// import { lckServices } from '@/services/lck-api'
// import { LckDatabase, LckWorkspace } from '@/services/lck-api/definitions'

// const WORKSPACE_ROLE = {
//   OWNER: 'OWNER',
//   ADMIN: 'ADMIN',
//   MEMBER: 'MEMBER',
// }

// const submitting = ref(false)
// const dialogVisible = ref(false)

// const workspaces: Ref<{
//   id: string;
//   text: string;
//   documentation?: string;
//   color?: string | null;
//   backgroundColor?: string | null;
//   icon?: string | null;
//   isManager: boolean;
// }[]> = ref([])

const newWorkspace = ref({
  text: '',
  documentation: '',
  settings: {},
})

// authState: AuthState;
// colorScheme: ColorScheme[];
// WORKSPACE_ROLE: typeof WORKSPACE_ROLE;
// newWorkspace: Partial<LckWorkspace>;
// newWorkspaceColorScheme: ColorScheme | null;
// newWorkspaceColorScheme: null,

</script>

<style lang="scss" scoped>
.workspaces {
  &-item {
    padding: .75rem;
  }

  &-button {
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: var(--spacing);
    min-height: 10rem;
    box-sizing: border-box;
    background: var(--color-white);
    align-content: center;
    text-align: center;
    border-radius: var(--border-radius);
    color: var(--text-color);
    box-shadow: 0 1px 3px 2px rgba(141, 27, 27, 0.04);
    transition: box-shadow .3s;
    font-weight: var(--font-weight-bold);
  }

  &-detail {
    position: relative;
    z-index: 2;
    text-decoration: none;
    cursor: pointer;

    &-title {
      margin: 0 auto;
      font-size: 1.6rem;
      word-wrap: break-word;
    }

    &:hover {
      text-decoration: underline;
    }
  }

  &-admin {
    position: absolute;
    z-index: 3;
    top: var(--spacing);
    right: var(--spacing);
    cursor: pointer;
    text-decoration: none;

    &:before {
      position: absolute;
      content: '';
      display: block;
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 3rem;
      border: 2px solid currentColor;
      padding: 2rem;
      opacity: 0.1;
      bottom: -1.125rem;
      right: -3.25rem;
      transition: ease opacity .5s;
      background-color: currentColor;
    }

    &:hover {
      &:before {
        opacity: 0.5;
      }
    }
  }

  &-icon {
    position: absolute;
    z-index: 1;
    left: -.75rem;
    bottom: -.75rem;
    font-size: 8rem;
    opacity: .1;
  }

  &-new {
    padding: var(--spacing);
    width: 100%;
    min-height: 10rem;
    width: 100%;
    border-radius: var(--border-radius);
    border: dashed 2px var(--secondary-color-light);
    cursor: pointer;
    background-color: transparent;
    color: var(--primary-color);

    &-icon {
      font-size: 2rem;
      display: block;
      margin-bottom: 1rem;
    }

    &:hover {
      border-color: var(--primary-color);
      background-color: var(--primary-color-lighten);
    }

    &:focus {
      outline: none;
      background-color: var(--primary-color-lighten);

      .p-button {
        background-color: var(--primary-color-dark);
      }
    }
  }
}
</style>
