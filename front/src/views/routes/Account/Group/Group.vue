<template>
  <div class="groups-container w-full">
    <div class="generic-view-container p-12 p-sm-10 p-md-10 p-xl-8 p-d-flex p-flex-column p-as-center p-mx-auto">
      <div class="lck-color-primary p-my-4">
        <h1>{{ $t('pages.account.groups') }}</h1>
      </div>
      <div>
        <p
          v-if="!authState.data.user || !authState.data.user.groups || authState.data.user.groups.length === 0"
        >
          {{ $t('pages.account.nodata') }}
        </p>
        <div v-else>
          <section
            class="p-mb-4"
            v-for="workspace in groupsByWorkspace"
            :key="workspace.id"
          >
            <p-card class="workspace-card">
              <template #title>
                <router-link
                  class="workspace-link"
                  :to="`${ROUTES_PATH.WORKSPACE}/${workspace.id}`"
                  :title="$t('pages.workspace.workspaceLinkTitle', { workspaceText: workspace.name })"
                >
                  <div class="p-d-flex p-flex-row">
                     <span
                       class="icon-rounded"
                       :style="{ 'background-color': workspace.backgroundColor, color: workspace.color }"
                     >
                      <i :class="workspace.icon || 'bi bi-table'" aria-hidden="true"/>
                     </span>
                    <h2>
                      {{ workspace.name }}
                    </h2>
                  </div>
                </router-link>
              </template>
              <template
                #content
              >
                <p-card
                  class="group-card"
                  v-for="group in workspace.groups"
                  :key="group.id"
                >
                  <template #title>
                    <div class="p-d-flex p-flex-row">
                      <i class="bi bi-people" aria-hidden="true"/>
                      <h3>{{ group.name }}</h3>
                      <span v-if="group.manager" class="status-mark">M</span>
                    </div>
                  </template>
                  <template #content>
                    <router-link
                      class="no-decoration-link"
                      :to="`${ROUTES_PATH.WORKSPACE}/${workspace.id}`"
                    >
                      <p-tag class="role-tag p-mb-2" :value="$t(`common.roles.${group.role}`)"/>
                    </router-link>
                  </template>
                </p-card>
              </template>
            </p-card>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Card from 'primevue/card'
import { AuthState, authState } from '@/store/auth'
import { ROUTES_PATH } from '@/router/paths'
import Tag from 'primevue/tag'
import { LckGroup, LckWorkspaceSettings } from '@/services/lck-api/definitions'
import { GROUP_ROLE } from '@locokit/lck-glossary'

interface GroupsByWorkspace extends LckWorkspaceSettings{
   id: string|undefined;
   name: string|undefined;
   groups: {
     id: string;
     name: string;
     role: GROUP_ROLE;
     manager: boolean|undefined;
   }[];
}
export default Vue.extend({
  name: 'Group',
  components: {
    'p-card': Vue.extend(Card),
    'p-tag': Vue.extend(Tag),
  },
  data (): {
    authState: AuthState;
    ROUTES_PATH: typeof ROUTES_PATH;
    } {
    return {
      authState,
      ROUTES_PATH,
    }
  },
  computed: {
    groupsByWorkspace (): GroupsByWorkspace[]|[] {
      if (this.authState.data?.user?.groups && this.authState.data.user.groups.length > 0) {
        return this.authState.data.user.groups.reduce((acc: GroupsByWorkspace[], group: LckGroup) => {
          if (group?.aclset?.workspace) {
            const workspaceId = group.aclset.workspace.id
            const workspaceIndex = acc.findIndex(({ id }) => id === workspaceId)
            if (workspaceIndex > -1) {
              acc[workspaceIndex].groups.push({
                id: group.id,
                name: group.name,
                role: group.uhg_role,
                manager: group?.aclset?.manager,
              })
            } else {
              acc.push({
                id: workspaceId,
                name: group.aclset.workspace.text,
                icon: group.aclset.workspace.settings?.icon,
                color: group.aclset.workspace.settings?.color,
                backgroundColor: group.aclset.workspace.settings?.backgroundColor,
                groups: [
                  {
                    id: group.id,
                    name: group.name,
                    role: group.uhg_role,
                    manager: group.aclset.manager,
                  },
                ],
              })
            }
          }
          return acc
        }, [])
      }
      return []
    },
  },
})
</script>

<style scoped lang="scss">
.groups-container {
  overflow: auto;
  height: 100%;
}

.icon-rounded {
  width: 2.5rem;
  height: 2.5rem;
  background-color: var(--primary-color);
  border-radius: 50%;
  padding: 0.5rem;
  margin: auto 0.5rem auto 0;

  & i {
    color: var(--color-white);
    font-size: 1.5rem !important;
  }
}

.workspace-link {
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}

.workspace-card {
  ::v-deep .p-card-content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 1em;
    grid-row-gap: 1em;
  }

  .group-card {
    .p-card-title {
      i {
        margin: auto 4px;
      }

      .status-mark {
        border-radius: 50%;
        width: 1rem;
        height: 1rem;
        line-height: 1rem;
        margin: auto 0 auto auto;
        font-size: 0.7rem;
        vertical-align: middle;
        text-align: center;
        color: var(--secondary-color-lighten);
        background-color: var(--primary-color);
      }
    }
  }
}

.role-tag {
  background-color: var(--secondary-color);
}
</style>
