<template>
  <div
    v-if="containers"
    class="internal-nav sticky-top-nav"
  >
    <div
      class="internal-nav-content"
    >
      <!-- Demo Navbar with Anchor Link -->
      <ul
        v-if="editMode && containersToDisplayed.length === 0"
        class="page-nav"
      >
        <li
          class="page-nav-item anchor-link-container"
        >
          <a>
            <span>Container 1</span>
          </a>
        </li>
        <li
          class="page-nav-item anchor-link-container"
        >
          <a>
            <i
              class="p-mr-1 visible pi pi-exclamation-triangle"
            />
            <span>Container 2</span>
          </a>
        </li>
        <li
          class="page-nav-item anchor-link-container"
        >
          <a>
            <i
              class="p-mr-1 viisble pi pi-info"
            />
            <span>Container 3</span>
          </a>
        </li>
      </ul>
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
              :class="[container.anchor_icon, container.anchor_class]"
            />
            <span>
              {{ container.anchor_label }}
            </span>
          </a>
        </li>
      </ul>
    </div>
    <span>
    <p-button
      v-if="editMode"
      :title="$t('pages.workspace.container.edit')"
      class="p-button-lg p-button-text edit-container-button"
      icon="pi pi-pencil"
      @click="$emit('edit-nav')"
    />
  </span>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import Button from 'primevue/button'

enum ANCHOR_CLASS {
  VISIBLE = 'visible',
  CLASSIC = 'classic'
}

interface Containers {
  id: string;
  text?: string;
  position?: number;
  displayed_in_navbar: boolean;
  anchor_label?: string;
  anchor_icon?: string;
  anchor_class?: ANCHOR_CLASS;
  settings?: {};
}

export default Vue.extend({
  name: 'NavAnchorLink',
  components: {
    'p-button': Vue.extend(Button)
  },
  props: {
    containers: {
      type: Array as PropType<Containers[]>
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      anchorContainerActive: this.$route.hash
    }
  },
  computed: {
    containersToDisplayed (): Containers[] {
      // eslint-disable-next-line @typescript-eslint/camelcase
      return this.containers.filter(container => container.displayed_in_navbar)
    }
  }
})
</script>

<style scoped>
.internal-nav {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 500;
  background-color: var(--text-color);
  margin: 1rem 0;
  display: flex;
  justify-content: space-between;
  border: 4px solid #fafafa;
  height: 4rem;
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
  border-left: 1px solid rgba(0, 122, 217, 0.2);
  height: 100%;
}

.page-nav-item > a > .visible {
  color: var(--color-warning);
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
  border-bottom: 2px solid var(--primary-color-darken);
  width: 100%;
}

.anchor-link-container:first-child {
  border-left: unset;
}
</style>
