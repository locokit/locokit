<template>
  <div
    class="generic-view-container p-mx-auto"
  >
    <h1 class="p-my-4 p-px-3 lck-color-title">
      {{ $t('pages.workspace.title') }}
    </h1>

    <p-card v-if="loading">
      <template slot="content">
        <p-skeleton
          width="10rem"
          class="p-mb-2"
        ></p-skeleton>
        <p-skeleton class="p-mb-2"></p-skeleton>
        <p-skeleton
          width="10rem"
          height="2rem"
        ></p-skeleton>
      </template>
    </p-card>

    <p v-if="!loading && groups.length === 0">{{ $t('pages.workspace.noWorkspace') }}</p>

    <div class="p-grid">
      <div v-for="group in groups" :key="group.id" class="p-col-12 p-md-6 p-lg-3 workspaces-item">
        <router-link
          class="p-component p-button p-button-outlined workspaces-button p-mr-2"
          :to="`${ROUTES_PATH.WORKSPACE}/${group.id}${ROUTES_PATH.DATABASE}/${group.aclset.workspace.databases[0].id}${ROUTES_PATH.DATABASESCHEMA}`"
        >
          <p class="workspaces-button-title">{{ group.aclset.workspace.text }}</p>
          <p class="workspaces-button-group">
            Group: {{ group.name }}
          </p>
          <p v-if="group.aclset.workspace.documentation">
            {{ group.aclset.workspace.documentation }}
          </p>
        </router-link>
      </div>

      <div v-if="$can('create', 'workspace')" class="p-col-12 p-md-6 p-lg-3 workspaces-item">
        <button class="workspaces-placeholder" @click="dialogVisible = true">
          <i class="bi bi-file-plus workspaces-placeholder-icon"></i>
          <p class="p-button p-button-sm">{{ $t('pages.workspace.form.new') }}</p>
        </button>
      </div>
    </div>

    <p-dialog
      :header="$t('pages.workspace.form.create')"
      :modal="true"
      :visible="dialogVisible"
      @update:visible="dialogVisible = false"
    >

      <form class="p-fluid">
        <div class="p-field">
          <p-input-text
            :placeholder="$t('pages.workspace.form.textPlaceholder')"
            v-model="newWorkspace.text"
          />
        </div>

        <div class="p-field">
          <label>{{ $t('pages.workspace.form.docLabel') }}</label>
          <p-textarea
            :placeholder="$t('pages.workspace.form.docPlaceholder')"
            class="p-mb-2"
            :autoResize="true"
            v-model="newWorkspace.documentation"
          />
        </div>
      </form>

      <template #footer>
        <p-button
          :label="$t('sw.cancel')"
          icon="pi pi-times"
          class="p-button-text"
          @click="dialogVisible = false"
        />
        <p-button
          :label="$t('form.save')"
          icon="pi pi-check"
          @click="createWorkspace"
          autofocus
        />
      </template>
    </p-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import { authState } from '@/store/auth'
import { ROUTES_PATH, ROUTES_NAMES } from '@/router/paths'

import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Skeleton from 'primevue/skeleton'

import { lckServices } from '@/services/lck-api'
import Dialog from 'primevue/dialog/Dialog'

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
    'p-dialog': Vue.extend(Dialog),
    'p-input-text': Vue.extend(InputText),
    'p-textarea': Vue.extend(Textarea),
    'p-skeleton': Vue.extend(Skeleton),
  },
  data () {
    return {
      loading: false,
      dialogVisible: false,
      ROUTES_PATH,
      ROUTES_NAMES,
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
