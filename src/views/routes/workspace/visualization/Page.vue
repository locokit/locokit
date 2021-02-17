<template>
  <div
    v-if="page"
    class="p-mx-2"
  >
    <div class="lck-page-content" :style="{ marginRight: showUpdateContainerSidebar ? editableSidebarWidth : 0 }">
      <div class="lck-color-page-title p-my-4">
        <h1>{{ page.text }}</h1>
      </div>
      <div
        v-if="page.hidden"
        class="p-mb-4"
      >
        <p-breadcrumb
          :home="{ icon: 'pi pi-home', to: '/' }"
          :model="breadcrumb"
          />
      </div>
      <draggable
        :key="page.id"
        v-model="page.containers"
        handle=".handle"
        @change="onContainerReorderClick"
      >
        <div
          v-for="container in page.containers"
          :key="container.id"
          :class="{
            'editable-container': editMode
          }"
        >
          <div v-if="editMode" class="edit-container-line">
            <span>
              <p-button
                :title="$t('pages.workspace.dragContainer')"
                class="p-button-lg p-button-text handle "
                icon="pi pi-ellipsis-v"
              />
            </span>
            <h2 class="lck-color-title">{{ container.text }}</h2>
            <span class="p-buttonset">
              <p-button
                :title="$t('pages.workspace.editContainer')"
                class="p-button-lg p-button-text edit-container-button"
                icon="pi pi-pencil"
                @click="onContainerEditClick(container)"
              />
              <p-button
                :title="$t('pages.workspace.deleteContainer')"
                class="p-button-lg p-button-text remove-container-button"
                icon="pi pi-trash"
                @click="onContainerDeleteClick(container)"
              />
            </span>
          </div>
          <draggable
            :key="container.id"
            v-model="container.blocks"
            @change="onBlockReorderClick(container, $event)"
            handle=".handle-block"
          >
            <Block
              v-for="block in container.blocks"
              :key="block.id"
              :block="block"
              :autocompleteSuggestions="autocompleteSuggestions"
              :exporting="exporting"
              :cellState="cellState"
              :editMode="editMode"
              :class="{ 'p-mb-4': !editMode }"
              v-on="$listeners"
              @update-cell="onUpdateCell(block, $event)"
              @update-content="onUpdateContentBlockTableView(block, $event)"
              @update-suggestions="onUpdateSuggestions"
              @sort="onSort(block, $event)"
              @open-detail="onPageDetail(block, $event)"
              @create-row="onCreateRow(block, $event)"
              @export-view="onExportView(block)"
              @update-filters="onUpdateFilters(block, $event)"
              @update-block="onBlockEditClick(container, block)"
              @delete-block="onBlockDeleteClick(container, block)"
            />
          </draggable>
          <p-button
            v-if="editMode"
            :title="$t('pages.workspace.block.create')"
            icon="pi pi-plus"
            class="new-block-button p-button-text"
            @click="onBlockEditClick(container, { id: '' })"
          />
        </div>
      </draggable>
      <p-button
        v-if="editMode"
        :title="$t('pages.workspace.createContainer')"
        icon="pi pi-plus"
        class="new-container-button p-button-text"
        @click="onContainerEditClick({})"
      />
    </div>
    <update-container-sidebar
      :submitting="submitting"
      :showSidebar="showUpdateContainerSidebar"
      :container="currentContainerToEdit"
      :block="currentBlockToEdit"
      :width="editableSidebarWidth"
      :autocompleteSuggestions="editableAutocompleteSuggestions"
      :relatedChapterPages="relatedChapterPages"
      @update-container="onContainerEditInput"
      @click-block="onBlockEditClickFromSidebar"
      @update-block="onBlockEditInput"
      @delete-block="onBlockDeleteClickFromSidebar"
      @close="onCloseUpdateContainerSidebar"
      @search-table-view="onSearchTableView"
    />
    <delete-confirmation-dialog
      :submitting="submitting"
      :visible="dialogVisibility.containerDelete"
      :value="currentContainerToDelete"
      :itemCategory="$t('pages.workspace.container')"
      @close="onContainerDeleteClose"
      @input="onContainerDeleteInput"
    />
    <delete-confirmation-dialog
      :submitting="submitting"
      :visible="dialogVisibility.blockDelete"
      :itemCategory="$t('pages.workspace.block.block')"
      fieldToDisplay="title"
      :value="currentBlockToDelete"
      @close="onBlockDeleteClose"
      @input="onBlockDeleteInput"
    />
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/camelcase */
import Vue from 'vue'

import saveAs from 'file-saver'
import Button from 'primevue/button'
import draggable from 'vuedraggable'
import { formatISO, isValid, parseISO } from 'date-fns'

import { BLOCK_TYPE, COLUMN_TYPE } from '@locokit/lck-glossary'

import Breadcrumb from 'primevue/breadcrumb'

import Block from '@/components/visualize/Block/Block'

import {
  retrievePageWithContainersAndBlocks,
  retrieveViewDefinition,
  retrieveViewData
} from '@/store/visualize'
import {
  patchTableData, saveTableData
} from '@/store/database'
import { lckHelpers, lckServices } from '@/services/lck-api'
import UpdateContainerSidebar from '@/components/visualize/UpdateContainerSidebar/UpdateContainerSidebar.vue'
import DeleteConfirmationDialog from '@/components/ui/DeleteConfirmationDialog/DeleteConfirmationDialog.vue'

export default {
  name: 'Page',
  components: {
    Block,
    'p-breadcrumb': Vue.extend(Breadcrumb),
    'p-button': Vue.extend(Button),
    draggable: Vue.extend(draggable),
    'update-container-sidebar': UpdateContainerSidebar,
    'delete-confirmation-dialog': DeleteConfirmationDialog
  },
  props: {
    pageId: {
      type: [String, Number], // param is string because its form url params
      required: true
    },
    pageDetailId: {
      type: [String, Number], // param is string because its form url params
      required: false
    },
    editMode: {
      type: Boolean,
      default: false
    },
    chapters: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      page: {},
      blocksOptions: {

      },
      autocompleteSuggestions: null,
      exporting: false,
      cellState: {},
      showUpdateContainerSidebar: false,
      currentContainerToEdit: {},
      currentContainerToDelete: {},
      currentBlockToEdit: {},
      currentBlockToDelete: {},
      submitting: false,
      dialogVisibility: {
        containerDelete: false,
        blockDelete: false
      },
      editableSidebarWidth: '40rem',
      editableAutocompleteSuggestions: null
    }
  },
  watch: {
    page (newVal) {
      // Hide the updated container sidebar
      this.onCloseUpdateContainerSidebar()
      // retrieve for each blocks the definition / data of the block
      if (!newVal || !newVal.containers || !newVal.containers.length > 0) return
      newVal.containers.sort((a, b) => a.position - b.position).forEach(container => {
        container.blocks.sort((a, b) => a.position - b.position)
        container.blocks.forEach(async block => {
          await this.loadBlockContentAndDefinition(block)
        })
      })
    }
  },
  computed: {
    breadcrumb: function () {
      const parent = this.$parent.sidebarItems.reduce((acc, chapter) => {
        chapter.subitems.find(page => {
          if (page.id === this.$route.params.pageId) acc = page
        })
        return acc
      }, {})
      return [
        {
          label: parent.label,
          to: this.$route.params.pageId
        },
        {
          label: this.page.text,
          disabled: true
        }
      ]
    },
    relatedChapterPages: function () {
      let relatedChapterPages = []
      if (this.page && Array.isArray(this.chapters)) {
        relatedChapterPages = this.chapters.find(
          chapter => chapter.id === this.page.chapter_id
        )?.pages.filter(
          page => page.id !== this.page.id
        )
      }
      return relatedChapterPages || []
    }
  },
  methods: {
    searchItems: lckHelpers.searchItems,
    async loadBlockTableViewContentAndDefinition (block) {
      this.blocksOptions[block.id] = {
        sort: {
          createdAt: 1
        },
        page: 0,
        itemsPerPage: 20,
        filters: {}
      }
      if (this.$route.query.rowId) {
        this.blocksOptions[block.id].filters.rowId = this.$route.query.rowId
      }
      this.$set(block, 'definition', await retrieveViewDefinition(block.settings?.id))
      if (block.definition?.id) await this.loadBlockTableViewContent(block)
    },
    async loadBlockTableViewContent (block) {
      const currentOptions = this.blocksOptions[block.id]
      if (this.$route.query.rowId) {
        this.blocksOptions[block.id].filters.rowId = this.$route.query.rowId
      }
      this.$set(block, 'content', await retrieveViewData(
        block.definition.id,
        currentOptions.page * currentOptions.itemsPerPage,
        currentOptions.itemsPerPage,
        currentOptions.sort,
        currentOptions.filters
      ))
    },
    async loadBlockContentAndDefinition (block) {
      switch (block.type) {
        case BLOCK_TYPE.TABLE_VIEW:
          this.$set(block, 'loading', true)
          await this.loadBlockTableViewContentAndDefinition(block)
          this.$set(block, 'loading', false)
          break
        case BLOCK_TYPE.DETAIL_VIEW:
          this.$set(block, 'definition', await retrieveViewDefinition(block.settings?.id))
          break
      }
    },
    async onUpdateContentBlockTableView (block, pageIndexToGo) {
      block.loading = true
      switch (block.type) {
        case BLOCK_TYPE.TABLE_VIEW:
          this.blocksOptions[block.id].page = pageIndexToGo
          await this.loadBlockTableViewContent(block)
          break
      }
      block.loading = false
    },
    async onUpdateSuggestions ({ column_type_id: columnTypeId, settings }, { query }) {
      this.autocompleteSuggestions = await this.searchItems({
        columnTypeId: columnTypeId,
        tableId: settings?.tableId,
        query
      })
    },
    async onUpdateCell ({
      id: blockId
    }, {
      rowId,
      columnId,
      newValue
    }) {
      let currentBlock = null
      this.page.containers.forEach(container => {
        const blockIdIndex = container.blocks.findIndex(b => b.id === blockId)
        blockIdIndex > -1 && (currentBlock = container.blocks[blockIdIndex])
      })
      const currentRow = currentBlock.content.data.find(d => d.id === rowId)
      this.cellState = {
        rowId: currentRow.id,
        columnId,
        waiting: true,
        isValid: false // don't know if we have to set to false or null
      }
      try {
        const res = await patchTableData(currentRow.id, {
          data: {
            [columnId]: newValue
          }
        })
        this.cellState.isValid = true
        currentRow.data = res.data
      } catch (error) {
        this.cellState.isValid = false
      }
      this.cellState.waiting = false
    },
    async onSort (block, { field, order }) {
      block.loading = true
      switch (block.type) {
        case BLOCK_TYPE.TABLE_VIEW:
          this.blocksOptions[block.id].sort = {}
          // find the matching column_type_id to adapt
          this.blocksOptions[block.id].sort[`ref(data:${field})`] = order
          await this.loadBlockTableViewContent(block)
          break
      }
      block.loading = false
    },
    async onUpdateFilters (block, filters) {
      block.loading = true
      switch (block.type) {
        case BLOCK_TYPE.TABLE_VIEW:
          this.blocksOptions[block.id].filters = filters
          await this.loadBlockTableViewContent(block)
          break
      }
      block.loading = false
    },
    async onPageDetail (block, rowId) {
      await this.$router.push({ name: 'PageDetail', params: { pageId: this.$route.params.pageId, pageDetailId: block.settings.pageDetailId }, query: { rowId } })
    },
    async onCreateRow (block, newRow) {
      const data = { ...newRow.data }
      if (this.$route.query.rowId) {
        const columnTargetDetail = block.definition.columns.find(column => column.default === '{rowId}' && column.displayed === false)
        data[columnTargetDetail.id] = this.$route.query.rowId
      }
      this.$set(block, 'submitting', true)

      /**
       * For date columns, we format the date to ISO, date only
       */
      block.definition.columns
        .filter(c => c.column_type_id === COLUMN_TYPE.DATE)
        .forEach(c => {
          if (isValid(parseISO(newRow.data[c.id]))) {
            data[c.id] = formatISO(new Date(newRow.data[c.id]), { representation: 'date' })
          } else {
            data[c.id] = null
          }
        })
      await saveTableData({
        data,
        // eslint-disable-next-line @typescript-eslint/camelcase
        table_id: block.definition.table_id
      })
      this.$set(block, 'submitting', false)
      this.$set(block, 'displayNewDialog', false)
      await this.loadBlockTableViewContent(block)
    },
    async onExportView (block) {
      if (!block.settings?.id) return
      this.exporting = true
      const data = await lckHelpers.exportTableRowData(block.settings?.id, this.blocksOptions[block.id]?.filters)
      saveAs(
        new Blob([data]),
        block.title + '.csv',
        {
          type: 'text/csv;charset=utf-8'
        })
      this.exporting = false
    },
    onContainerEditClick (containerToEdit) {
      this.currentContainerToEdit = containerToEdit.id ? containerToEdit : {}
      this.currentBlockToEdit = {}
      this.showUpdateContainerSidebar = true
    },
    async onContainerEditInput (containerToEdit) {
      try {
        this.submitting = true
        if (containerToEdit.id) {
          // On update
          const updatedContainer = await lckServices.container.patch(containerToEdit.id, {
            text: containerToEdit.text
          })
          for (const key in updatedContainer) {
            this.currentContainerToEdit[key] = updatedContainer[key]
          }
        } else {
          // On create
          this.currentContainerToEdit = await lckServices.container.create({
            text: containerToEdit.text,
            page_id: this.page.id
          })
          this.page.containers.push(this.currentContainerToEdit)
        }
      } catch (error) {
        this.displayToastOnError(`${this.$t('pages.workspace.container')} ${containerToEdit.text}`, error)
      } finally {
        this.submitting = false
      }
    },
    onContainerDeleteClick (containerToDelete) {
      this.currentContainerToDelete = containerToDelete
      this.dialogVisibility.containerDelete = true
    },
    async onContainerDeleteInput (containerToDelete = {}) {
      try {
        this.submitting = true
        if (containerToDelete.id) {
          await lckServices.container.remove(containerToDelete.id)
          const containerIndex = this.page.containers.findIndex(container => container.id === containerToDelete.id)
          if (containerIndex >= 0) this.page.containers.splice(containerIndex, 1)
        }
        if (containerToDelete.id === this.currentContainerToEdit.id) {
          this.onCloseUpdateContainerSidebar()
        }
        this.onContainerDeleteClose()
      } catch (error) {
        this.displayToastOnError(`${this.$t('pages.workspace.container')} ${containerToDelete.text}`, error)
      } finally {
        this.submitting = false
      }
    },
    onContainerDeleteClose () {
      this.currentContainerToDelete = {}
      this.dialogVisibility.containerDelete = false
    },
    async onContainerReorderClick ({ moved }) {
      if (moved) {
        const minIndex = Math.min(moved.oldIndex, moved.newIndex)
        const maxIndex = Math.max(moved.oldIndex, moved.newIndex)

        const updatedContainerPromises = []
        for (let index = minIndex; index <= maxIndex; index++) {
          updatedContainerPromises.push(
            lckServices.container.patch(this.page.containers[index].id, { position: index })
          )
        }
        await Promise.all(updatedContainerPromises)
          .catch(error => {
            this.displayToastOnError(`${this.$t('pages.workspace.page')} ${this.page.text}`, error)
          })
      }
    },
    onCloseUpdateContainerSidebar () {
      this.currentContainerToEdit = {}
      this.currentBlockToEdit = {}
      this.showUpdateContainerSidebar = false
    },
    onBlockEditClickFromSidebar (blockToEdit) {
      this.currentBlockToEdit = blockToEdit
    },
    onBlockEditClick (containerToEdit, blockToEdit) {
      this.currentContainerToEdit = containerToEdit
      this.currentBlockToEdit = blockToEdit
      this.showUpdateContainerSidebar = true
    },
    async onBlockEditInput ({ blockToEdit, blockRefreshRequired }) {
      try {
        this.submitting = true
        if (blockToEdit.id) {
          // On update
          const updatedBlock = await lckServices.block.patch(blockToEdit.id, {
            title: blockToEdit.title,
            type: blockToEdit.type,
            settings: blockToEdit.settings
          })
          for (const key in updatedBlock) {
            this.currentBlockToEdit[key] = updatedBlock[key]
          }
        } else {
          // On create
          this.currentBlockToEdit = await lckServices.block.create({
            container_id: this.currentContainerToEdit.id,
            title: blockToEdit.title,
            type: blockToEdit.type,
            settings: blockToEdit.settings
          })
          if (Array.isArray(this.currentContainerToEdit.blocks)) {
            this.currentContainerToEdit.blocks.push(this.currentBlockToEdit)
          } else {
            this.$set(this.currentContainerToEdit, 'blocks', [this.currentBlockToEdit])
          }
        }
        // Reload the block definition and content if it is necessary
        if (blockRefreshRequired) await this.loadBlockContentAndDefinition(this.currentBlockToEdit)
      } catch (error) {
        this.displayToastOnError(`${this.$t('pages.workspace.block.block')} ${this.currentBlockToEdit.title}`, error)
      } finally {
        this.submitting = false
      }
    },
    onBlockDeleteClick (containerToEdit, blockToDelete) {
      this.currentContainerToDelete = containerToEdit
      this.currentBlockToDelete = blockToDelete
      this.dialogVisibility.blockDelete = true
    },
    onBlockDeleteClickFromSidebar (blockToDelete) {
      this.onBlockDeleteClick(this.currentContainerToEdit, blockToDelete)
    },
    onBlockDeleteClose () {
      this.currentContainerToDelete = {}
      this.currentBlockToDelete = {}
      this.dialogVisibility.blockDelete = false
    },
    async onBlockDeleteInput (blockToDelete) {
      try {
        this.submitting = true
        if (blockToDelete.id) {
          await lckServices.block.remove(blockToDelete.id)
          const blockToDeleteIndex = this.currentContainerToDelete.blocks.findIndex(block => block.id === blockToDelete.id)
          if (blockToDeleteIndex >= 0) this.currentContainerToDelete.blocks.splice(blockToDeleteIndex, 1)
          if (blockToDelete.id === this.currentBlockToEdit.id) {
            this.currentBlockToEdit = {}
          }
          this.onBlockDeleteClose()
        }
      } catch (error) {
        this.displayToastOnError(`${this.$t('pages.workspace.block.block')} ${blockToDelete.title}`, error)
      } finally {
        this.submitting = false
      }
    },
    async onBlockReorderClick (container, { moved }) {
      if (moved) {
        const minIndex = Math.min(moved.oldIndex, moved.newIndex)
        const maxIndex = Math.max(moved.oldIndex, moved.newIndex)

        const updatedBlockPromises = []
        for (let index = minIndex; index <= maxIndex; index++) {
          updatedBlockPromises.push(
            lckServices.block.patch(container.blocks[index].id, { position: index })
          )
        }
        await Promise.all(updatedBlockPromises)
          .catch(error => {
            this.displayToastOnError(`${this.$t('pages.workspace.container')} ${container.text}`, error)
          })
      }
    },
    async onSearchTableView ({ query }) {
      try {
        const tableViewResult = await lckServices.tableView.find({
          query: {
            'table:database.workspace_id': this.workspaceId,
            $limit: 10,
            $joinRelation: 'table.[database]',
            $sort: {
              createdAt: 1
            },
            'table_view.text': {
              $ilike: `%${query}%`
            }
          }
        })
        this.editableAutocompleteSuggestions = tableViewResult.data.map(tr => ({
          text: tr.text,
          value: tr.id
        }))
      } catch (error) {
        this.displayToastOnError(this.$t('components.multiAutocomplete.error'), error)
      }
    },
    displayToastOnError (summary, error) {
      this.$toast.add({
        severity: 'error',
        summary,
        detail: error.code ? this.$t('error.http.' + error.code) : this.$t('error.basic'),
        life: 3000
      })
    }
  },
  async mounted () {
    if (this.$route.params.pageDetailId) {
      this.page = await retrievePageWithContainersAndBlocks(this.$route.params.pageDetailId)
    } else {
      this.page = await retrievePageWithContainersAndBlocks(this.pageId)
    }
  },
  async beforeRouteUpdate (to, from, next) {
    if (to.params.pageId !== from.params.pageId) {
      this.page = await retrievePageWithContainersAndBlocks(to.params.pageId)
      next()
    }
    if (to.params.pageDetailId !== from.params.pageDetailId) {
      this.page = await retrievePageWithContainersAndBlocks(to.params.pageDetailId)
      next()
    }
  },
  async beforeRouteLeave (to, from, next) {
    if (to.params.pageDetailId) {
      this.page = await retrievePageWithContainersAndBlocks(to.params.pageDetailId)
      next()
    }
    if (from.params.pageDetailId) {
      this.page = await retrievePageWithContainersAndBlocks(to.params.pageId)
      next()
    }
    next()
  }
}
</script>

<style scoped>
.lck-page-content {
  min-width: 20rem;
  transition-duration: 0.3s;
}

.editable-container {
  margin-bottom: 1rem;
  border: 2px solid var(--primary-color);
  overflow: hidden;
}

.edit-container-line {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid var(--primary-color);
}

.edit-container-line .p-button {
  color: var(--primary-color);
  height: 100%;
}

.edit-container-line .p-buttonset {
  flex-shrink: 0;
}

.edit-container-line .handle {
  cursor: move;
}

.p-button.new-block-button {
  color: var(--primary-color-darken);
  width: 100%;
  height: 3rem;
}

.p-button.new-container-button {
  color: var(--primary-color);
  height: 3rem;
  width: 100%;
  margin-bottom: 0.5rem;
  border: 1px solid var(--primary-color) !important;
}
</style>
