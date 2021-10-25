<template>
  <div
    class="generic-view-container p-mx-auto"
  >
    <h1 class="p-my-4 lck-color-title">
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
      <div v-for="workspace in workspaces" :key="workspace.id" class="p-col-12 p-md-6 p-lg-3 workspaces-item">
        <router-link
          class="p-component p-button p-button-outlined workspaces-button p-mr-2"
          :to="`${ROUTES_PATH.WORKSPACE}/${workspace.id}`"
        >
          <p class="workspaces-button-title">{{ workspace.text }}</p>
          is manager : {{ workspace.isManager }}
        </router-link>
      </div>

      <div v-if="$can('create', 'workspace')" class="p-col-12 p-md-6 p-lg-3 workspaces-item">
        <button class="workspaces-new" @click="dialogVisible = true">
          <i class="bi bi-file-plus workspaces-new-icon"></i>
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

<script lang="ts">
import Vue from 'vue'
import { ROUTES_PATH, ROUTES_NAMES } from '@/router/paths'
import { AuthState, authState } from '@/store/auth'

import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Skeleton from 'primevue/skeleton'

import { lckServices } from '@/services/lck-api'
import Dialog from 'primevue/dialog/Dialog'
import { LckDatabase, LckWorkspace } from '@/services/lck-api/definitions'

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
  data (): {
    loading: boolean;
    dialogVisible: boolean;
    ROUTES_PATH: typeof ROUTES_PATH;
    ROUTES_NAMES: typeof ROUTES_NAMES;
    authState: AuthState;
    WORKSPACE_ROLE: typeof WORKSPACE_ROLE;
    newWorkspace: {text: string; documentation: string};
    workspaces: {text: string; color?: string; icon?: string; isManager: boolean}[];
    } {
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
      workspaces: [],
    }
  },
  methods: {
    transformDatabases (groupId: string, databases: LckDatabase[], schema = false) {
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
      } catch (error: any) {
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
      const userWorkspaces = await lckServices.workspace.find({
        query: {
          $joinEager: '[aclsets.[groups.[users]]]',
          'aclsets:groups:users.id': authState?.data?.user?.id,
          $limit: -1,
        },
      }) as LckWorkspace[]
      this.workspaces = userWorkspaces.map((w: LckWorkspace) => {
        const currentWorkspace = {
          text: w.text,
          icon: w.settings?.icon,
          color: w.settings?.color,
          isManager: false,
        }
        // eslint-disable-next-line no-unused-expressions
        w.aclsets?.forEach(function (aclset) {
          if (aclset.manager) {
            currentWorkspace.isManager = true
          }
        })
        return currentWorkspace
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
      !userWorkspacesAvailable?.some(({ aclset }) => aclset?.manager) &&
      userWorkspacesAvailable?.length === 1
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
<style lang="scss" scoped>
.workspaces {
  &-item {
    padding: .75rem;
  }

  &-button {
    flex-direction: column;
    justify-content: center;
    background: #ffffff;
    min-height: 10rem;
    border-radius: var(--border-radius);
    width: 100%;
    cursor: pointer;
    border: solid 1px var(--primary-color);
    color: var(--text-color);
    box-shadow: 0 1px 3px 2px rgba(141, 27, 27, 0.04);
    transition: box-shadow .3s;
    font-weight: var(--font-weight-regular);

    &,
    p {
      text-decoration: none;
      color: var(--text-color);
    }

    &-title {
      display: block;
      font-weight: var(--font-weight-regular);
      margin: 0;
    }

    &-group {
      font-size: var(--font-size-md);
      display: block;
      margin-top: 0;
      margin-bottom: .25rem;
    }

    &:hover {
      box-shadow: 0 0 0 0.1rem var(--primary-color);
      background-color: var(--primary-color-very-lighten);
    }

    &:focus {
      box-shadow: 0 0 0 0.1rem var(--primary-color), 0 0 0 0.3rem var(--primary-color-lighten);
    }
  }

  &-new {
    width: 100%;
    min-height: 10rem;
    border-radius: var(--border-radius);
    border: dashed 2px var(--secondary-color-lighten);
    cursor: pointer;
    background-color: transparent;
    color: var(--primary-color);

    &-icon {
      font-size: 2rem;
      display: block;
      margin-bottom: 1rem;
    }

    &:hover {
      border-color: var(--surface-a);
      background-color: var(--primary-color-very-lighten);
    }

    &:focus {
      outline: none;
      background-color: var(--primary-color-very-lighten);

      .p-button {
        background-color: var(--primary-color-darken);
      }
    }
  }
}
</style>
