<template>
  <p-sidebar
    class="p-fluid"
    position="right"
    :style="{ width }"
    :modal="false"
    :visible="showSidebar"
    @update:visible="$emit('close')"
  >
    <div class="sidebar-content lck-color-content">
      <p-tab-view @tab-change="onTabChange">
        <p-tab-panel
          :header="$t('pages.workspace.page.pageConfiguration')"
          :active.sync="activePanel[0]"
        >
          <update-page-form
            :containers="page.containers"
            :autocompleteSuggestions="autocompleteSuggestions"
            @close="resetSidebar"
            v-on="$listeners"
          />
        </p-tab-panel>
        <p-tab-panel
          v-if="activePanel[1] || activePanel[2]"
          :header="$t(`pages.workspace.container.${container.createdAt ? 'edit' : 'create'}`)"

          :active.sync="activePanel[1]"
        >
          <update-container-form
            :container="container"
            :autocompleteSuggestions="autocompleteSuggestions"
            :submitting="submitting"
            @input="$emit('update-container', $event)"
            @close="resetSidebar"
            v-on="$listeners"
          />
        </p-tab-panel>
        <p-tab-panel
          v-if="activePanel[2]"
          :header="$t(`pages.workspace.block.${block.createdAt ? 'edit' : 'create'}`)"
          :active.sync="activePanel[2]"
        >
          <update-block-form
            :block="block"
            :autocompleteSuggestions="autocompleteSuggestions"
            :blockDisplayTableViewSuggestions="blockDisplayTableViewSuggestions"
            :blockDisplayFieldSuggestions="blockDisplayFieldSuggestions"
            :relatedChapterPages="relatedChapterPages"
            :submitting="submitting"
            @input="$emit('update-block', $event)"
            @close="resetSidebar"
            @search-table-view="$emit('search-table-view', $event)"
            @search-block-display-table-view="$emit('search-block-display-table-view', $event)"
            @search-block-display-field="$emit('search-block-display-field', $event)"
          />
        </p-tab-panel>
      </p-tab-view>
    </div>
  </p-sidebar>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import Sidebar from 'primevue/sidebar'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'

import {
  LckBlockExtended,
  LckContainer
} from '@/services/lck-api/definitions'

import UpdateBlockForm from '@/components/visualize/UpdateSidebar/UpdateBlockForm/UpdateBlockForm.vue'
import UpdateContainerForm from '@/components/visualize/UpdateSidebar/UpdateContainerForm/UpdateContainerForm.vue'
import UpdatePageForm from '@/components/visualize/UpdateSidebar/UpdatePageForm/UpdatePageForm.vue'

export default {
  name: 'UpdateSidebar',
  components: {
    'update-block-form': UpdateBlockForm,
    'update-container-form': UpdateContainerForm,
    'update-page-form': UpdatePageForm,
    'p-sidebar': Vue.extend(Sidebar),
    'p-tab-view': Vue.extend(TabView),
    'p-tab-panel': Vue.extend(TabPanel)
  },
  props: {
    showSidebar: {
      type: Boolean,
      default: false
    },
    container: {
      type: Object as PropType<LckContainer>,
      default: () => (new LckContainer())
    },
    block: {
      type: Object as PropType<LckBlockExtended>,
      default: () => (new LckBlockExtended())
    },
    page: {
      type: Object,
      default: () => ({})
    },
    submitting: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '40rem'
    },
    autocompleteSuggestions: {
      type: Array as PropType<{ label: string; value: string }[]>,
      default: () => ([])
    },
    blockDisplayTableViewSuggestions: {
      type: Array as PropType<{ label: string; value: string }[]>,
      default: () => ([])
    },
    blockDisplayFieldSuggestions: {
      type: Array as PropType<{ label: string; value: string }[]>,
      default: () => ([])
    },
    relatedChapterPages: {
      type: Array,
      default: () => ([])
    }
  },
  computed: {
    activePanel (): boolean[] {
      if (this.block.id) {
        return [false, false, true]
      } else {
        if (this.container.id) return [false, true, false]
        return [true, false, false]
      }
    }
  },
  methods: {
    onTabChange () {
      if (this.activePanel[1]) {
        this.$emit('reset-current-block', {})
      }
      if (this.activePanel[0]) {
        this.$emit('reset-current-block', {})
        this.$emit('reset-current-container', {})
      }
    },
    resetSidebar () {
      this.$emit('reset-current-block', {})
    }
  }
}
</script>

<style scoped>
.p-sidebar {
  top: var(--header-height);
  height: calc(100vh - var(--header-height));
  overflow-y: auto;
  max-width: 100vw;
}

::v-deep .p-tabview > .p-tabview-nav > li.p-highlight > .p-tabview-nav-link {
  color: var(--primary-color);
  border-color: var(--primary-color);
}
</style>
