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
        <p-tab-panel :header="containerCopy.id ? 'Configuration générale' : 'Nouveau conteneur'" :active.sync="activePanel[0]">
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
                <!-- <p-column>
                  <template #body>
                    <span class="pi pi-chevron-right"></span>
                  </template>
                </p-column> -->
                <p-column field="title" :header="$t('pages.workspace.block.title')"></p-column>
                <p-column field="type" :header="$t('pages.workspace.block.type')"></p-column>
                <p-column>
                  <template #body="slotProps">
                    <span class="p-buttonset">
                      <p-button
                        icon="pi pi-pencil"
                        class="p-button-text p-mr-2 p-ml-auto p-button-lg"
                        @click="onBlockEditClick(slotProps.data)"
                      />
                      <p-button
                        icon="pi pi-trash"
                        class="p-button-text p-button-lg"
                        @click="onDeleteBlockClick(slotProps.data)"
                      />
                    </span>
                  </template>
                </p-column>
                <template #footer>
                  <p-button
                    icon="pi pi-plus"
                    class="p-button-text p-button-lg"
                    @click="onBlockEditClick({})"
                  />
                </template>
              </p-datatable>
            </div>
            </template>
        </p-tab-panel>
        <p-tab-panel
          v-if="true"
          :header="$t(`pages.workspace.block.${blockToEdit.id ? 'edit' : 'create'}`)"
          :active.sync="activePanel[1]"
        >
          <template>
            <update-block-form
              :block="blockToEdit"
              @input="onBlockEditInput"
              @close="onBlockEditClose"
            />
          </template>
        </p-tab-panel>
      </p-tab-view>
    </div>
    <delete-confirmation-dialog
      :submitting="submitting"
      :visible="dialogVisibility.deleteBlock"
      :itemCategory="$t('pages.workspace.block.block')"
      :value="blockToEdit"
      @input="onDeleteBlockInput"
      @close="onDeleteBlockClose"
    />
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

import { LckBlockExtended } from '@/services/lck-api/definitions'

import UpdateBlockForm from '@/components/visualize/UpdateBlockForm/UpdateBlockForm.vue'
import DeleteConfirmationDialog from '@/components/ui/DeleteConfirmationDialog/DeleteConfirmationDialog.vue'

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
    'update-block-form': UpdateBlockForm,
    'delete-confirmation-dialog': DeleteConfirmationDialog
  },
  props: {
    showSidebar: {
      type: Boolean,
      default: false
    },
    container: {
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
    }
  },
  data () {
    return {
      containerCopy: {},
      blockToEdit: new LckBlockExtended() as LckBlockExtended,
      activePanel: [true, false],
      dialogVisibility: {
        deleteBlock: false
      }
    }
  },
  watch: {
    container: {
      handler (newValue = {}) {
        this.containerCopy = { ...newValue }
        this.resetSidebar()
      },
      immediate: true
    }
  },
  methods: {
    onTabChange () {
      this.resetBlockToEdit()
    },
    resetSidebar () {
      this.activePanel = [true, false]
      this.resetBlockToEdit()
    },
    onBlockEditClick (selectedBlock: LckBlockExtended) {
      this.blockToEdit = selectedBlock
      this.activePanel = [false, true]
    },
    onBlockEditInput (updatedBlock: LckBlockExtended) {
      this.$emit('update-block', this.blockToEdit, updatedBlock)
      if (!this.blockToEdit.id) this.resetSidebar()
    },
    onBlockEditClose () {
      this.resetSidebar()
    },
    onDeleteBlockClick (selectedBlock: LckBlockExtended) {
      this.blockToEdit = selectedBlock
      this.dialogVisibility.deleteBlock = true
    },
    onDeleteBlockInput () {
      this.$emit('delete-block', this.blockToEdit)
      this.onDeleteBlockClose()
    },
    onDeleteBlockClose () {
      this.dialogVisibility.deleteBlock = false
      this.resetBlockToEdit()
    },
    resetBlockToEdit () {
      this.blockToEdit = new LckBlockExtended()
    }
  }
}
</script>

<style scoped>
.p-sidebar {
  top: var(--header-height);
  height: calc(100vh - var(--header-height));
  overflow-y: auto;
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
</style>
