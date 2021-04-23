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
          :header="containerCopy.id ? $t('pages.workspace.containerConfiguration') : $t('pages.workspace.newContainer')"
          :active.sync="activePanel[0]"
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
          v-if="activePanel[1]"
          :header="$t(`pages.workspace.block.${block.id ? 'edit' : 'create'}`)"
          :active.sync="activePanel[1]"
        >
          <update-block-form
            :block="block"
            :autocompleteSuggestions="autocompleteSuggestions"
            :relatedChapterPages="relatedChapterPages"
            :submitting="submitting"
            @input="$emit('update-block', $event)"
            @close="resetSidebar"
            @search-table-view="$emit('search-table-view', $event)"
          />
        </p-tab-panel>
      </p-tab-view>
    </div>
  </p-sidebar>
</template>

<script lang="ts">
import Vue from 'vue'

import Sidebar from 'primevue/sidebar'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'

import {
  LckBlockExtended,
  LckContainer
} from '@/services/lck-api/definitions'

import UpdateBlockForm from '@/components/visualize/UpdateSidebar/UpdateBlockForm/UpdateBlockForm.vue'
import UpdateContainerForm from '@/components/visualize/UpdateSidebar/UpdateContainerForm/UpdateContainerForm.vue'

export default {
  name: 'UpdateSidebar',
  components: {
    'update-block-form': UpdateBlockForm,
    'update-container-form': UpdateContainerForm,
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
      type: Object as Vue.PropType<LckContainer>,
      default: () => new LckContainer()
    },
    block: {
      type: Object as Vue.PropType<LckBlockExtended>,
      default: () => new LckBlockExtended()
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
      type: Array,
      default: () => ([])
    } as Vue.PropOptions<{ label: string; value: string }[]>,
    relatedChapterPages: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      containerCopy: new LckContainer()
    }
  },
  computed: {
    activePanel () {
      return this.container.id === undefined || this.block.id === undefined
        ? [true, false]
        : [false, true]
    }
  },
  watch: {
    container: {
      handler (newValue = {}) {
        this.containerCopy = { ...newValue }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    onTabChange () {
      if (this.activePanel[0]) {
        this.resetSidebar()
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

/deep/ .p-tabview > .p-tabview-nav > li.p-highlight > .p-tabview-nav-link {
  color: var(--primary-color);
  border-color: var(--primary-color);
}
</style>
