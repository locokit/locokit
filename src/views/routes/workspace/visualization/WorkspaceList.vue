<template>
  <div
    class="generic-view-container p-mx-auto"
  >
    <header class="p-my-4 lck-color-title">
      {{ $t('pages.workspace.title') }}
    </header>

    <p-card v-if="loading">
      <template slot="content">
        <p-skeleton width="10rem" class="p-mb-2"></p-skeleton>
        <p-skeleton class="p-mb-2"></p-skeleton>
        <p-skeleton width="10rem" height="2rem"></p-skeleton>
      </template>
    </p-card>

    <p-card
      class="p-mb-4 p-col"
      v-for="group in groups"
      :key="group.id"
    >
      <template slot="title">
        {{ group.aclset.workspace.text }}
      </template>
      <template slot="content">
        <p>
          Group: {{ group.name }}
        </p>
        <p>
          {{ group.aclset.workspace.documentation }}
        </p>
        <div class="action-button-content p-d-flex">
          <router-link
            class="no-decoration-link p-mr-2"
            :to="`${ROUTES_PATH.WORKSPACE}/${group.id}${ROUTES_PATH.VISUALIZATION}`"
          >
            <p-button
              :label="$t('pages.workspace.buttonVisualization')"
              icon="bi bi-eye"
            />
          </router-link>
          <template v-if="group.aclset.workspace.databases.length > 0 && group.aclset.manager">
            <router-link
              v-if="group.aclset.workspace.databases.length === 1"
              class="no-decoration-link p-mr-2"
              :to="`${ROUTES_PATH.WORKSPACE}/${group.id}${ROUTES_PATH.DATABASE}/${group.aclset.workspace.databases[0].id}`"
            >
              <p-button
                :label="$t('pages.workspace.buttonDatabase')"
                icon="bi bi-server"
              />
            </router-link>
            <lck-dropdown-button
              v-else
              class="no-decoration-link p-mr-2"
              :label="$t('pages.workspace.buttonDatabase')"
              :model="transformDatabases(group.id, group.aclset.workspace.databases)"
            />
            <router-link
              v-if="group.aclset.workspace.databases.length === 1"
              class="no-decoration-link p-mr-2"
              :to="`${ROUTES_PATH.WORKSPACE}/${group.id}${ROUTES_PATH.DATABASE}/${group.aclset.workspace.databases[0].id}${ROUTES_PATH.DATABASESCHEMA}`"
            >
              <p-button
                :label="$t('pages.workspace.buttonSchema')"
                icon="bi bi-diagram-3"
              />
            </router-link>
            <lck-dropdown-button
              v-else
              class="no-decoration-link p-mr-2"
              :label="$t('pages.workspace.buttonSchema')"
              :model="transformDatabases(group.id, group.aclset.workspace.databases, true)"
            />
            <router-link
              class="no-decoration-link p-mr-2"
              :to="`${ROUTES_PATH.WORKSPACE}/${group.id}${ROUTES_PATH.PROCESS}`"
            >
              <p-button
                :label="$t('pages.workspace.buttonProcess')"
                icon="bi bi-lightning"
              />
            </router-link>
          </template>
        </div>
      </template>
    </p-card>

    <header
      class="p-my-4 lck-color-title"
      v-if="$can('create', 'workspace')"
    >
      {{ $t('pages.workspace.form.create') }}
    </header>
    <p-card
      class="p-mb-4 p-col p-fluid"
      v-if="$can('create', 'workspace')"
    >
      <template slot="title">
        <p-input-text
          :placeholder="$t('pages.workspace.form.textPlaceholder')"
          v-model="newWorkspace.text"
        />
      </template>
      <template slot="content">
        <label>{{ $t('pages.workspace.form.docLabel') }}</label>
        <p-textarea
          :placeholder="$t('pages.workspace.form.docPlaceholder')"
          class="p-mb-2"
          :autoResize="true"
          v-model="newWorkspace.documentation"
        />
        <br/>
        <p-button
          icon="pi pi-plus-circle"
          :label="$t('pages.workspace.form.create')"
          @click="createWorkspace"
        />
      </template>
    </p-card>

  </div>
</template>

<script>
import Vue from 'vue'
import { authState } from '@/store/auth'
import { ROUTES_PATH } from '@/router/paths'

import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Skeleton from 'primevue/skeleton'

import DropdownButton from '@/components/ui/DropdownButton/DropdownButton'
import { lckServices } from '@/services/lck-api'

const WORKSPACE_ROLE = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
}

export default {
  name: 'WorkspaceList',
  components: {
    'p-card': Vue.extend(Card),
    'p-button': Vue.extend(Button),
    'p-input-text': Vue.extend(InputText),
    'p-textarea': Vue.extend(Textarea),
    'p-skeleton': Vue.extend(Skeleton),
    'lck-dropdown-button': Vue.extend(DropdownButton),
  },
  data () {
    return {
      loading: false,
      ROUTES_PATH,
      authState,
      WORKSPACE_ROLE,
      newWorkspace: {
        text: '',
        documentation: '',
      },
      groups: [],
    }
  },
  methods: {
    transformDatabases (groupId, databases, schema = false) {
      return databases.map(({ text, id }) => ({
        id,
        label: text,
        to: `${ROUTES_PATH.WORKSPACE}/${groupId}${ROUTES_PATH.DATABASE}/${id}${schema ? ROUTES_PATH.DATABASESCHEMA : ''}`,
      }))
    },
    async createWorkspace () {
      try {
        await lckServices.workspace.create(this.newWorkspace)
        this.$toast.add({
          severity: 'success',
          summary: this.$t('pages.workspace.form.createdSummary'),
          detail: this.$t('pages.workspace.form.createdDetail'),
          life: 5000,
        })
        this.newWorkspace = {
          text: '',
          documentation: '',
        }
        this.fetchUserGroups()
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: this.$t('error.http.' + error.code),
          detail: this.$t('error.lck.' + error.data.code),
          life: 5000,
        })
      }
    },
    async fetchUserGroups () {
      this.loading = true
      this.groups = await lckServices.group.find({
        query: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          $eager: '[aclset.[workspace.[databases]]]',
          $joinRelation: 'users',
          'users.id': authState.data.user.id,
          $limit: -1,
        },
      })
      this.loading = false
    },
  },
  mounted () {
    this.fetchUserGroups()
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
      !userWorkspacesAvailable.some(({ aclset }) => aclset.manager) &&
      userWorkspacesAvailable.length === 1
    ) {
      // only one workspace, user is not a member of a group-aclset manager
      // we redirect user on the visualization route
      authState.data.currentGroupId = userWorkspacesAvailable[0].id
      next({
        path: `${ROUTES_PATH.WORKSPACE}/${authState.data.currentGroupId}${ROUTES_PATH.VISUALIZATION}`,
      })
    } else {
      next()
    }
  },
}
</script>
