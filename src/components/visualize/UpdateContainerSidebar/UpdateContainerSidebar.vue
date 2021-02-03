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
        <p-tab-panel :header="containerCopy.id ? $t('pages.workspace.containerConfiguration') : $t('pages.workspace.newContainer')" :active.sync="activePanel[0]">
          <template>
            <form class="p-d-flex lck-color-content" @submit.prevent="$emit('update-container', containerCopy)">
              <div class="p-col">
                <h4 class="lck-color-content">
                  <label for="container-name" >{{ $t('pages.workspace.containerName') }}</label>
                </h4>
                <p-input-text
                  id="container-name"
                  type="text"
                  v-model="containerCopy.text"
                  required
                />
              </div>
              <div class="p-d-flex p-ai-end">
                <p-button
                  disabled
                  v-if="submitting"
                  :label="$t('form.waiting')"
                  icon="pi pi-spin pi-spinner"
                  class="p-button-text"
                />
                <p-button
                  v-else
                  type="submit"
                  :label="containerCopy.id ? $t('form.update') : $t('form.save')"
                  icon="pi pi-check"
                  class="p-button-text"
                />
              </div>
            </form>
            <div v-if="containerCopy.id" class="containerBlocks">
              <h4 class="lck-color-content">{{ $t('pages.workspace.block.list') }}</h4>
              <p-datatable
                :value="containerCopy.blocks"
                dataKey="id"
              >
                <template #empty>
                  {{ $t('pages.workspace.noBlock') }}
                </template>
                <p-column field="title" :header="$t('pages.workspace.block.title')"></p-column>
                <p-column field="type" :header="$t('pages.workspace.block.type')"></p-column>
                <p-column headerStyle="width: 7em">
                  <template #body="slotProps">
                    <span class="p-buttonset">
                      <p-button
                        :title="$t('pages.workspace.block.edit')"
                        icon="pi pi-pencil"
                        class="p-button-text p-mr-2 p-ml-auto p-button-lg"
                        @click="$emit('click-block', slotProps.data)"
                      />
                      <p-button
                        :title="$t('pages.workspace.block.delete')"
                        icon="pi pi-trash"
                        class="p-button-text p-button-lg"
                        @click="$emit('delete-block', slotProps.data)"
                      />
                    </span>
                  </template>
                </p-column>
                <template #footer>
                  <p-button
                    :title="$t('pages.workspace.block.create')"
                    icon="pi pi-plus"
                    class="p-button-text p-button-lg"
                    @click="setNewBlock"
                  />
                </template>
              </p-datatable>
            </div>
            </template>
        </p-tab-panel>
        <p-tab-panel
          v-if="activePanel[1]"
          :header="$t(`pages.workspace.block.${block.id ? 'edit' : 'create'}`)"
          :active.sync="activePanel[1]"
        >
          <template>
            <update-block-form
              :block="block"
              :autocompleteSuggestions="autocompleteSuggestions"
              :relatedChapterPages="relatedChapterPages"
              @input="onBlockEditInput"
              @close="resetSidebar"
              @search-table-view="$emit('search-table-view', $event)"
            />
          </template>
        </p-tab-panel>
      </p-tab-view>
    </div>
  </p-sidebar>
</template>

<script lang="ts">

import Vue from 'vue'
import Button from 'primevue/button'
import Sidebar from 'primevue/sidebar'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'

import { LckBlockExtended, LckContainer } from '@/services/lck-api/definitions'

import UpdateBlockForm from '@/components/visualize/UpdateBlockForm/UpdateBlockForm.vue'

export default {
  name: 'UpdateContainerSidebar',
  components: {
    'p-sidebar': Vue.extend(Sidebar),
    'p-input-text': Vue.extend(InputText),
    'p-button': Vue.extend(Button),
    'p-datatable': Vue.extend(DataTable),
    'p-column': Vue.extend(Column),
    'p-tab-view': Vue.extend(TabView),
    'p-tab-panel': Vue.extend(TabPanel),
    'update-block-form': UpdateBlockForm
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
        this.resetBlockToEdit()
      }
    },
    resetSidebar () {
      this.resetBlockToEdit()
    },
    onBlockEditInput (event: { updatedBlock: LckBlockExtended; blockRefreshRequired: boolean }) {
      this.$emit('update-block', event)
    },
    resetBlockToEdit () {
      this.$emit('click-block', new LckBlockExtended())
    },
    setNewBlock () {
      const newBlock = new LckBlockExtended()
      newBlock.id = ''
      this.$emit('click-block', newBlock)
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

h3, h4 {
  margin-bottom: 0.5em;
}

/deep/ .p-highlight .p-tabview-nav-link {
  color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
}

/deep/ .p-datatable .p-datatable-footer {
  text-align: center;
}

/deep/ .p-datatable-wrapper .p-datatable-thead th {
  position: static;
}
</style>
