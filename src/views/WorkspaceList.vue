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
        <div >
          <p-card
            class="p-mb-4 p-col"
            v-for="workspace in group.workspaces"
            :key="workspace.id"
          >
            <template slot="title">
              {{ workspace.text }}
            </template>
            <template slot="content">
              <div>
                <div class="action-button-content p-d-flex">
                  <router-link
                    class="no-decoration-link p-mr-2"
                    :to="`${ROUTES_PATH.WORKSPACE}/${workspace.id}${ROUTES_PATH.VISUALIZATION}`"
                  >
                    <p-button
                      :label="$t('pages.workspace.buttonVisu')"
                      icon="pi pi-globe"
                    />
                  </router-link>

                  <template v-if="workspace.databases.length > 0 && workspace.role === 'OWNER'">
                    <router-link
                      v-if="workspace.databases.length === 1"
                      class="no-decoration-link p-mr-2"
                      :to="`${ROUTES_PATH.WORKSPACE}/${workspace.id}${ROUTES_PATH.DATABASE}/${workspace.databases[0].id}`"
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
                      :model="transformDatabases(workspace.id, workspace.databases)"
                    />

                    <router-link
                      v-if="workspace.databases.length === 1"
                      :to="`${ROUTES_PATH.WORKSPACE}/${workspace.id}${ROUTES_PATH.DATABASE}/${workspace.databases[0].id}${ROUTES_PATH.DATABASESCHEMA}`"
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
  </div>
</template>

<script>
import Vue from 'vue'
import { authState } from '@/store/auth'
import { ROUTES_PATH } from '@/router/paths'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DropdownButton from '@/components/ui/DropdownButton/DropdownButton'

export default {
  name: 'WorkspaceList',
  data () {
    return {
      ROUTES_PATH,
      authState
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
    const userWorkspacesAvailable = authState?.data?.user?.groups.reduce((accu, group) => {
      group.workspaces.forEach(workspace => {
        accu.push(workspace)
      })
      return accu
    }, [])
    if (
      !userWorkspacesAvailable.some(({ role }) => role === 'OWNER') && userWorkspacesAvailable.length === 1
      // TODO: don't redirect if the current user is a workspace's admin
    ) {
      // only one workspace, user is not a SUPERADMIN
      // we redirect user on the visualization route
      next({
        path: `${ROUTES_PATH.WORKSPACE}/${userWorkspacesAvailable[0].id}${ROUTES_PATH.VISUALIZATION}`
      })
    } else {
      next()
    }
  }
}
</script>
