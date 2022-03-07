<template>
  <layout-with-header>
    <div class="generic-view-container p-mx-auto">
      <h1 class="p-my-4 lck-color-title">
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

        <p v-if="!loading && workspaces.length === 0" class="p-col-12">
          {{ $t('pages.workspace.noWorkspace') }}
        </p>

        <div v-for="workspace in workspaces" :key="workspace.id" class="p-col-12 p-md-4 p-lg-3 workspaces-item">
          <div
            class="workspaces-button p-mr-2"
            :style="{
              backgroundColor: workspace.backgroundColor || 'inherit'
            }"
          >
            <router-link
              class="workspaces-detail"
              :to="`${ROUTES_PATH.WORKSPACE}/${workspace.id}`"
              :style="{
                color: workspace.color || 'inherit'
              }"
            >
              <p class="workspaces-detail-title">{{ workspace.text }}</p>
            </router-link>

            <router-link
              v-if="workspace.isManager"
              class="workspaces-admin"
              :to="`${ROUTES_PATH.WORKSPACE}/${workspace.id}${ROUTES_PATH.ADMIN}`"
              :style="{
                color: workspace.color || 'inherit',
              }"
            >
              <i class="bi bi-sliders"></i>
            </router-link>

            <i v-if="workspace.icon" class="workspaces-icon bi" :class="workspace.icon" />
          </div>
        </div>

        <div
          v-if="$can('create', 'workspace')"
          :class="'p-col-12 p-md-4 p-lg-3 workspaces-item' + ( workspaces.length === 0 ? ' p-mx-auto' : '')"
        >
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

        <lck-workspace-form
          :submitting="submitting"
          @cancel="dialogVisible = false"
          @input="createWorkspace"
        />

      </p-dialog>
    </div>
  </layout-with-header>
</template>

<script lang="ts">
import Vue from 'vue'
import { ROUTES_PATH, ROUTES_NAMES } from '@/router/paths'
import { AuthState, authState } from '@/store/auth'
import { ColorScheme, COLOR_SCHEME } from '@/services/lck-utils/color'

import Skeleton from 'primevue/skeleton'

import WorkspaceForm from '@/components/visualize/WorkspaceForm/WorkspaceForm.vue'

import { lckServices } from '@/services/lck-api'
import Dialog from 'primevue/dialog/Dialog'
import { LckDatabase, LckWorkspace } from '@/services/lck-api/definitions'
import WithHeader from '@/layouts/WithHeader.vue'

const WORKSPACE_ROLE = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
}

export default {
  name: 'WorkspaceList',
  components: {
    'layout-with-header': Vue.extend(WithHeader),
    'lck-workspace-form': Vue.extend(WorkspaceForm),
    'p-dialog': Vue.extend(Dialog),
    'p-skeleton': Vue.extend(Skeleton),
  },
  data (): {
    loading: boolean;
    submitting: boolean;
    dialogVisible: boolean;
    ROUTES_PATH: typeof ROUTES_PATH;
    ROUTES_NAMES: typeof ROUTES_NAMES;
    authState: AuthState;
    colorScheme: ColorScheme[];
    WORKSPACE_ROLE: typeof WORKSPACE_ROLE;
    newWorkspace: Partial<LckWorkspace>;
    newWorkspaceColorScheme: ColorScheme | null;
    workspaces: {
      id: string;
      text: string;
      documentation?: string;
      color?: string | null;
      backgroundColor?: string | null;
      icon?: string | null;
      isManager: boolean;
    }[];
    } {
    return {
      loading: false,
      submitting: false,
      dialogVisible: false,
      ROUTES_PATH,
      ROUTES_NAMES,
      authState,
      WORKSPACE_ROLE,
      colorScheme: COLOR_SCHEME,
      newWorkspace: {
        text: '',
        documentation: '',
        settings: {},
      },
      newWorkspaceColorScheme: null,
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
    onColorSelect (event: { value: ColorScheme | null}) {
      this.newWorkspaceColorScheme = event.value
      if (event.value) {
        if (!this.newWorkspace.settings) {
          this.newWorkspace.settings = {}
        }
        this.newWorkspace.settings.color = event.value.color
        this.newWorkspace.settings.backgroundColor = event.value.backgroundColor
      }
    },
    async createWorkspace (newWorkspace: LckWorkspace) {
      this.submitting = true
      try {
        await lckServices.workspace.create(newWorkspace)
        this.$toast.add({
          severity: 'success',
          summary: this.$t('pages.workspace.form.createdSummary'),
          detail: this.$t('pages.workspace.form.createdDetail'),
          life: 5000,
        })
        this.dialogVisible = false
        this.fetchUserGroups()
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: this.$t('error.http.' + error.code),
          detail: this.$t('error.lck.' + error.data.code),
          life: 5000,
        })
      }
      this.submitting = false
    },
    async fetchUserGroups () {
      this.loading = true
      const userWorkspaces = await lckServices.workspace.find({
        query: {
          $modify: 'ofUser',
          $limit: -1,
        },
      }) as LckWorkspace[]
      this.workspaces = userWorkspaces.map((w: LckWorkspace) => {
        const currentWorkspace = {
          id: w.id,
          text: w.text,
          documentation: w.documentation,
          icon: w.settings?.icon,
          color: w.settings?.color,
          backgroundColor: w.settings?.backgroundColor,
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
    if (to.name !== ROUTES_NAMES.WORKSPACELIST) next()
    const userWorkspacesAvailable = authState?.data?.user?.groups
    if (
      !userWorkspacesAvailable?.some(({ aclset }) => aclset?.manager) &&
      userWorkspacesAvailable?.length === 1
    ) {
      // only one workspace, user is not a member of a group-aclset manager
      // we redirect user on the visualization route
      authState.data.currentGroupId = userWorkspacesAvailable[0].id
      next({
        name: ROUTES_NAMES.WORKSPACE,
        params: {
          workspaceId: userWorkspacesAvailable[0].aclset?.workspace_id as string,
          groupId: authState.data.currentGroupId,
        },
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
        padding: 2rem;
        opacity: 0.1;
        bottom: -1.125rem;
        right: -3.25rem;
        transition: ease background-color .2s;
      }

    &:hover {
      &:before {
        background: currentColor;
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
