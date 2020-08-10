<template>
  <div
    class="generic-view-container p-mx-auto"
  >
    <header class="p-my-4 lck-color-title">
      {{ $t('pages.workspaces.title') }}
    </header>

    <div v-if="!isAuthorized">
      <router-link
        class="no-decoration-link"
        v-for="workspace in workspaceState.data.workspaces"
        :key="workspace.id"
        :to="`${ROUTES_PATH.WORKSPACE}/${workspace.id}`"
      >
        <p-card
          class="p-mb-4"
        >
          <template slot="title">
            {{ workspace.text }}
          </template>
          <template slot="content">
            <div>
              <ul class="lck-ul-content">
                <li>#{{ workspace.id }}</li>
                <li>
                  {{ $t('pages.workspaces.created') }} {{ workspace.createdAt }}
                </li>
                <li>
                  {{ $t('pages.workspaces.updated') }} {{ workspace.updatedAt }}
                </li>
              </ul>
            </div>
          </template>
        </p-card>
      </router-link>
    </div>

    <div v-else>
      <p-card
        class="p-mb-4"
        v-for="workspace in workspaceState.data.workspaces"
        :key="workspace.id"
      >
        <template slot="title">
          {{ workspace.text }}
        </template>
        <template slot="content">
          <div>
            <ul class="lck-ul-content">
              <li>#{{ workspace.id }}</li>
              <li>
                {{ $t('pages.workspaces.created') }} {{ workspace.createdAt }}
              </li>
              <li>
                {{ $t('pages.workspaces.updated') }} {{ workspace.updatedAt }}
              </li>
            </ul>
            <div class="action-button-content p-d-flex">
              <router-link
                class="no-decoration-link p-mr-2"
                :to="`${ROUTES_PATH.WORKSPACE}/${workspace.id}${ROUTES_PATH.VISUALIZATION}`"
              >
                <p-button label="Visualization" icon="pi pi-globe" />
              </router-link>

              <template v-if="workspace.databases.length > 0">
                <router-link
                  v-if="workspace.databases.length === 1"
                  class="no-decoration-link p-mr-2"
                  :to="`${ROUTES_PATH.WORKSPACE}/${workspace.id}${ROUTES_PATH.DATABASE}/${workspace.databases[0].id}`"
                >
                  <p-button label="Database" icon="pi pi-sitemap" />
                </router-link>
                <p-dropdown-button
                  v-else
                  class="no-decoration-link p-mr-2"
                  label="Databases"
                  :model="transformDatabases(workspace.id, workspace.databases)"
                />
              </template>
            </div>
          </div>
        </template>
      </p-card>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { retrieveWorkspacesWithDatabases, workspaceState } from '@/store/visualize'
import { authState } from '@/store/auth'
import { ROUTES_PATH } from '@/router/paths'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DropdownButton from '@/components/DropdownButton/DropdownButton'

export default {
  name: 'WorkspaceList',
  data () {
    return {
      ROUTES_PATH,
      workspaceState,
      authState
    }
  },
  components: {
    'p-card': Vue.extend(Card),
    'p-button': Vue.extend(Button),
    'p-dropdown-button': Vue.extend(DropdownButton)
  },
  computed: {
    isAuthorized () {
      return authState?.data?.user?.profile === 'SUPERADMIN'
    }
  },
  methods: {
    transformDatabases (workspaceId, databases) {
      return databases.map(({ text, id }) => (
        {
          id,
          label: text,
          to: `${ROUTES_PATH.WORKSPACE}/${workspaceId}${ROUTES_PATH.DATABASE}/${id}`
        }
      ))
    }
  },
  /**
   * This hook is executed each time the WorkspaceList is matched by the vue-router
   * So, sometimes, we don't want this hook execute
   * => we check before executing we are on the "good" component...
   */
  async beforeRouteEnter (to, from, next) {
    if (to.name !== 'WorkspaceList') next()
    await retrieveWorkspacesWithDatabases()
    if (
      workspaceState.data.workspaces.length === 1 &&
      authState?.data?.user?.profile !== 'SUPERADMIN'
      // TODO: don't redirect if the current user is a workspace's admin
    ) {
      // only one workspace, user is not a SUPERADMIN
      // we redirect user on the visualization route
      next({
        path: `${ROUTES_PATH.WORKSPACE}/${workspaceState.data.workspaces[0].id}${ROUTES_PATH.VISUALIZATION}`
      })
    } else {
      next()
    }
  }
}
</script>
