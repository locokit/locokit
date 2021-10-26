<template>
  <div
    v-if="containers"
    class="internal-nav sticky-top-nav"
  >
    <div
      class="internal-nav-content"
    >
      <!-- Navbar with no Anchor Link -->
      <div v-if="editMode && containersToDisplayed.length === 0">
        {{ $t('pages.workspace.page.navigationSubject') }}
        <br/>
        {{ $t('pages.workspace.page.navigationExplain') }}
      </div>
      <!-- Navbar with Anchor Link -->
      <ul
        v-else
        class="page-nav"
      >
        <li
          v-for="container in containersToDisplayed"
          :key="container.id"
          class="page-nav-item anchor-link-container"
          :class="{
           'active': anchorContainerActive === `#${container.id}`
          }"
        >
          <a
            :href="`#${container.id}`"
            @click="anchorContainerActive = `#${container.id}`"
          >
            <i
              v-if="container.anchor_icon"
              class="p-mr-1"
              :class="[container.anchor_icon, container.anchor_icon_class]"
            />
            <span>
              {{ container.anchor_label }}
            </span>
          </a>
        </li>
      </ul>
    </div>
    <span class="edit-mode-toggle">
    <p-button
      v-if="editMode"
      :title="$t('pages.workspace.container.edit')"
      class="p-button-lg p-button-text edit-container-button"
      icon="bi bi-pencil"
      @click="$emit('edit-nav')"
    />
  </span>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import Button from 'primevue/button'

enum ANCHOR_CLASS {
  DANGER = 'danger',
  WARNING = 'warning',
  SUCCESS = 'success',
  PRIMARY = 'primary',
  SECONDARY = 'secondary'
}

interface Containers {
  id: string;
  text?: string;
  position?: number;
  displayed_in_navbar: boolean;
  anchor_label?: string;
  anchor_icon?: string;
  anchor_icon_class?: ANCHOR_CLASS;
  settings?: {};
}

export default Vue.extend({
  name: 'NavAnchorLink',
  components: {
    'p-button': Vue.extend(Button),
  },
  props: {
    containers: {
      type: Array as PropType<Containers[]>,
    },
    editMode: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      anchorContainerActive: this.$route?.hash,
    }
  },
  computed: {
    containersToDisplayed (): Containers[] {
      // eslint-disable-next-line @typescript-eslint/camelcase
      return this.containers.filter(container => container.displayed_in_navbar)
    },
  },
})
</script>

<style scoped>
.internal-nav {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 500;
  background-color: rgba(255, 255, 255, 0.9);
  margin: 1rem 0;
  display: flex;
  justify-content: space-between;
  border: 1px solid var(--primary-color);
  height: 3rem;
}

.internal-nav-content {
  flex: 1;
}

.page-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  list-style-type: none;
  padding: 0;
  margin: 0;
  height: 100%;
}

.page-nav-item {
  position: relative;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;
  text-align: center;
  border-left: 1px solid var(--primary-color);
  height: 100%;
}

.anchor-link-container:first-child {
  border-left: unset;
}
.page-nav-item > a > i {
  border-radius: 4px;
  margin-right: 0.5rem;
  background-color: unset;
}
.page-nav-item > a > i.danger {
color: var(--color-error);
}

.page-nav-item > a > i.warning {
  color: var(--color-warning);
}

.page-nav-item > a > i.success {
  color: var(--color-success);
}

.page-nav-item > a > i.primary {
  color: var(--primary-color);
}

.page-nav-item > a > i.secondary {
  color: var(--secondary-color);
}

.page-nav-item > a {
  text-decoration: none;
}

.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-bottom: 2px solid var(--primary-color-dark);
  width: 100%;
}

.edit-mode-toggle {
  position: absolute;
  right: 0;
}
</style>
