<template>
  <div
    class="generic-view-container p-mx-auto"
  >
    <header class="p-my-4 lck-color-title">
      {{ $t('pages.workspace.title') }}
    </header>

    <div v-if="authState && authState.data && authState.data.user && authState.data.user.groups">
      <div
        v-for="group in authState.data.user.groups"
        :key="group.id"
      >
        <p-card class="p-mb-4 p-col">
          <template slot="title">
            {{ group.workspace.text }}
          </template>
          <template slot="content">
            <div>
              <div class="action-button-content p-d-flex">
                <router-link
                  class="no-decoration-link p-mr-2"
                  :to="`${ROUTES_PATH.WORKSPACE}/${group.workspace.id}${ROUTES_PATH.VISUALIZATION}`"
                >
                  <p-button
                    :label="$t('pages.workspace.buttonVisualization')"
                    icon="pi pi-globe"
                  />
                </router-link>
                <template v-if="group.workspace.databases.length > 0 && [WORKSPACE_ROLE.OWNER, WORKSPACE_ROLE.ADMIN].includes(group.workspace_role)">
                  <router-link
                    v-if="group.workspace.databases.length === 1"
                    class="no-decoration-link p-mr-2"
                    :to="`${ROUTES_PATH.WORKSPACE}/${group.workspace.id}${ROUTES_PATH.DATABASE}/${group.workspace.databases[0].id}`"
                  >
                    <p-button
                      :label="$t('pages.workspace.buttonDatabase')"
                      icon="pi pi-table"
                    />
                  </router-link>
                  <p-dropdown-button
                    v-else
                    class="no-decoration-link p-mr-2"
                    :label="$t('pages.workspace.buttonDatabase')"
                    :model="transformDatabases(group.workspace.id, group.workspace.databases)"
                  />

                  <router-link
                    v-if="group.workspace.databases.length === 1"
                    :to="`${ROUTES_PATH.WORKSPACE}/${group.workspace.id}${ROUTES_PATH.DATABASE}/${group.workspace.databases[0].id}${ROUTES_PATH.DATABASESCHEMA}`"
                  >
                    <p-button
                      :label="$t('pages.workspace.buttonSchema')"
                      icon="pi pi-sitemap"
                    />
                  </router-link>
                </template>
              </div>
            </div>
          </template>
        </p-card>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { authState } from '@/store/auth'
import { ROUTES_PATH } from '@/router/paths'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DropdownButton from '@/components/ui/DropdownButton/DropdownButton'
import { WORKSPACE_ROLE } from '@locokit/lck-glossary'

export default {
  name: 'WorkspaceList',
  data () {
    return {
      ROUTES_PATH,
      authState,
      WORKSPACE_ROLE
    }
  },
  components: {
    'p-card': Vue.extend(Card),
    'p-button': Vue.extend(Button),
    'p-dropdown-button': Vue.extend(DropdownButton)
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
    const userWorkspacesAvailable = authState?.data?.user?.groups
    if (
      // eslint-disable-next-line @typescript-eslint/camelcase
      !userWorkspacesAvailable.some(({ workspace_role }) => workspace_role !== WORKSPACE_ROLE.MEMBER) && userWorkspacesAvailable.length === 1
    ) {
      // only one workspace, user is not a SUPERADMIN
      // we redirect user on the visualization route
      next({
        path: `${ROUTES_PATH.WORKSPACE}/${userWorkspacesAvailable[0].workspace_id}${ROUTES_PATH.VISUALIZATION}`
      })
    } else {
      next()
    }
  }
}
</script>
