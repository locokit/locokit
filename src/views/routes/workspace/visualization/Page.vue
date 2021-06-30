<template>
  <div
    v-if="page"
    class="p-mx-2"
    :class="setLayoutPage"
  >
    <div
      class="lck-page-content"
      :style="{ marginRight: showUpdateSidebar ? editableSidebarWidth : 0 }"
    >
      <div
        v-if="page.hidden"
        class="lck-color-primary p-mb-4"
      >
        <p-breadcrumb
          :home="{ icon: 'pi pi-home', to: '/' }"
          :model="breadcrumb"
        />
      </div>

      <div class="lck-color-primary p-my-4">
        <h1>{{ page.text }}</h1>
      </div>

      <lck-nav-anchor-link
        v-if="isNavBarAnchorLinkDisplayed || editMode"
        :containers="page.containers"
        :editMode="editMode"
        @edit-nav="onNavAnchorLinkEditClick"
      />

      <draggable
        :key="page.id"
        v-model="page.containers"
        handle=".handle"
        @change="onContainerReorderClick"
      >
        <div
          v-for="container in page.containers"
          :id="container.id"
          :key="container.id"
          class="lck-container"
          :class="{
            'editable-container': editMode,
            'lck-elevation': container.elevation
          }"
        >
          <h2 v-if="container.display_title && !editMode" class="lck-color-title">{{ container.text }}</h2>
          <div v-if="editMode" class="edit-container-line">
            <h2 class="lck-color-title">{{ container.text }}</h2>
            <span class="p-buttonset">
              <p-button
                :title="$t('pages.workspace.container.drag')"
                class="p-button-lg p-button-text handle "
                icon="pi pi-ellipsis-v"
              />
              <p-button
                :title="$t('pages.workspace.container.edit')"
                class="p-button-lg p-button-text edit-container-button"
                icon="pi pi-pencil"
                @click="onContainerEditClick(container)"
              />
              <p-button
                :title="$t('pages.workspace.container.delete')"
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
            <template v-for="block in container.blocks">
              <Block
                :key="block.id"
                v-if="editMode || isBlockDisplayed(block)"
                class="lck-block"
                :class="{
                  'p-mb-4': !editMode,
                }"
                :block="block"
                :definition="getBlockDefinition(block)"
                :content="getBlockContent(block)"
                :workspaceId="workspaceId"
                :autocompleteSuggestions="autocompleteSuggestions"
                :exporting="exporting"
                :cellState="cellState"
                :editMode="editMode"
                v-on="$listeners"
                @update-row="onUpdateCell(block, $event)"
                @update-cell="onUpdateCell(block, $event)"
                @update-content="onUpdateContentBlockTableView(block, $event)"
                @update-suggestions="onUpdateSuggestions"
                @sort="onSort(block, $event)"
                @open-detail="onPageDetail(block, $event)"
                @create-row="onCreateRow(block, $event)"
                @export-view-csv="onExportViewCSV(block)"
                @export-view-xls="onExportViewXLS(block)"
                @update-filters="onUpdateFilters(block, $event)"
                @update-block="onBlockEditClick(container, block)"
                @delete-block="onBlockDeleteClick(container, block)"

                @download-attachment="onDownloadAttachment"
                @upload-files="onUploadFiles(block, $event)"
                @remove-attachment="onRemoveAttachment(block, $event)"

                @go-to-page-detail="goToPage"
                @create-process-run="onTriggerProcess(block, $event)"

                @update-features="onGeoDataEdit(block, $event)"
                @remove-features="onGeoDataRemove(block, $event)"
              />
            </template>
          </draggable>
          <p-button
            v-if="editMode"
            :title="$t('pages.workspace.block.create')"
            icon="pi pi-plus"
            class="new-block-button p-button-text"
            @click="onBlockEditClick(container, { id: 'temp' })"
          />
        </div>
      </draggable>
      <p-button
        v-if="editMode"
        :title="$t('pages.workspace.container.create')"
        icon="pi pi-plus"
        class="new-container-button p-button-text"
        @click="onContainerEditClick({ id: 'temp' })"
      />
    </div>
    <update-sidebar
      :submitting="submitting"
      :showSidebar="showUpdateSidebar"
      :container="currentContainerToEdit"
      :block="currentBlockToEdit"
      :page="page"
      :width="editableSidebarWidth"
      :autocompleteSuggestions="editableAutocompleteSuggestions"
      :blockDisplayTableViewSuggestions="blockDisplayTableViewSuggestions"
      :blockDisplayFieldSuggestions="blockDisplayFieldSuggestions"
      :relatedChapterPages="relatedChapterPages"
      @update-container="onContainerEditInput"
      @update-block="onBlockEditInput"

      @add-new-block="onBlockEditClickFromSidebar"
      @edit-block="onBlockEditClickFromSidebar"
      @delete-block="onBlockDeleteClick(currentContainerToEdit, $event)"

      @add-new-container="onContainerEditClickFromSidebar"
      @edit-container="onContainerEditClickFromSidebar"
      @delete-container="onContainerDeleteClick($event)"

      @reset-current-block="onBlockEditClickFromSidebar"
      @reset-current-container="onContainerEditClickFromSidebar"
      @close="onCloseUpdateContainerSidebar"
      @search-table-view="onSearchTableView"

      @search-block-display-table-view="onSearchBlockDisplayTableView"
      @search-block-display-field="onSearchBlockDisplayField"
    />
    <delete-confirmation-dialog
      :submitting="submitting"
      :visible="dialogVisibility.containerDelete"
      :value="currentContainerToDelete"
      :itemCategory="$t('pages.workspace.container.title')"
      @close="onContainerDeleteClose"
      @input="onContainerDeleteInput"
    />
    <delete-confirmation-dialog
      :submitting="submitting"
      :visible="dialogVisibility.blockDelete"
      :value="currentBlockToDelete"
      :itemCategory="$t('pages.workspace.block.title')"
      fieldToDisplay="title"
      @close="onBlockDeleteClose"
      @input="onBlockDeleteInput"
    />
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/camelcase */
import Vue from 'vue'

import draggable from 'vuedraggable'
import {
  formatISO,
  isValid,
  parseISO
} from 'date-fns'

import {
  BLOCK_TYPE,
  COLUMN_TYPE
} from '@locokit/lck-glossary'

import {
  lckHelpers,
  lckServices
} from '@/services/lck-api'
import {
  isGeoBlock,
  transformFeatureToWKT
} from '@/services/lck-utils/map/transformWithOL'
import {
  objectFromArray
} from '@/services/lck-utils/arrays'
import Breadcrumb from 'primevue/breadcrumb'
import Button from 'primevue/button'
import {
  createProcessRun
} from '@/services/lck-helpers/process'

import Block from '@/components/visualize/Block/Block.vue'
import UpdateSidebar from '@/components/visualize/UpdateSidebar/UpdateSidebar.vue'
import DeleteConfirmationDialog from '@/components/ui/DeleteConfirmationDialog/DeleteConfirmationDialog.vue'
import NavAnchorLink from '@/components/ui/NavAnchorLink/NavAnchorLink.vue'
import { ROUTES_NAMES } from '@/router/paths'
import { PROCESS_RUN_STATUS } from '@/services/lck-api/definitions'

export default {
  name: 'Page',
  components: {
    Block,
    'update-sidebar': UpdateSidebar,
    'delete-confirmation-dialog': DeleteConfirmationDialog,
    'lck-nav-anchor-link': NavAnchorLink,
    'p-breadcrumb': Vue.extend(Breadcrumb),
    'p-button': Vue.extend(Button),
    draggable: Vue.extend(draggable)
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
    },
    workspaceId: {
      type: String,
      required: true
    },
    groupId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      page: {},
      sources: {},
      blocksOptions: {},
      autocompleteSuggestions: null,
      exporting: false,
      cellState: {},
      showUpdateSidebar: false,
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
      editableAutocompleteSuggestions: null,
      blockDisplayTableViewSuggestions: null,
      blockDisplayFieldSuggestions: null
    }
  },
  computed: {
    breadcrumb () {
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
    isNavBarAnchorLinkDisplayed () {
      return this.page?.containers?.some(container => container.displayed_in_navbar)
    },
    relatedChapterPages () {
      let relatedChapterPages = []
      if (this.page && Array.isArray(this.chapters)) {
        relatedChapterPages = this.chapters.find(
          chapter => chapter.id === this.page.chapter_id
        )?.pages.filter(
          page => page.id !== this.page.id
        )
      }
      return relatedChapterPages || []
    },
    setLayoutPage () {
      if (this.page) {
        switch (this.page.layout) {
          case 'center':
            return 'lck-layout-centered'
          case 'flex':
            return 'lck-layout-flex'
          case 'full':
            return 'lck-layout-full'
          default :
            return 'lck-layout-classic'
        }
      }
      return ''
    }
  },
  methods: {
    searchItems: lckHelpers.searchItems,
    resetSources () {
      this.sources = {}
    },
    createOrExtendSource (tableViewId, blockId, blockType) {
      /**
       * is the block type a multi-line one,
       * all _SET blocks
       */
      const multi = [
        BLOCK_TYPE.TABLE_SET,
        BLOCK_TYPE.MAP_SET,
        BLOCK_TYPE.KANBAN_SET,
        BLOCK_TYPE.CARD_SET
      ].indexOf(blockType) > -1
      if (this.sources[tableViewId]) {
        if (multi !== this.sources[tableViewId].multi) {
          this.$toast.add({
            severity: 'warn',
            summary: this.$t('error.cms.blockMultiConflictSummary'),
            detail: this.$t('error.cms.blockMultiConflictDetail')
          })
        }
        this.sources[tableViewId].blocks.push(blockId)
        /**
         * If the source already exist,
         * and if the block is not a geo one,
         * we set the itemsPerPage to the default (20).
         * This means that, if a source is shared between a Table / Card / ... Set
         * AND a MapSet,
         * the pagination is enabled.
         * The map will only display the paginated result.
         * If we need to have "more" results in the Map (all for examples),
         * the map need to have its own source, so not the same TableView
         */
        if (!isGeoBlock(blockType) && multi) this.sources[tableViewId].options.itemsPerPage = 20
      } else {
        /**
         * For the mapview block, we don't limit the result
         * And for data records (or action button), we limit to 1
         * TODO: we must optimize the way we manage data...
         */
        let itemsPerPage = 20
        if (isGeoBlock(blockType)) itemsPerPage = -1
        if (!multi) itemsPerPage = 1

        this.$set(this.sources, tableViewId, {
          definition: null,
          content: null,
          blocks: [blockId],
          options: {
            sort: {
              createdAt: 1
            },
            page: 0,
            itemsPerPage,
            filters: {}
          },
          // this option allows us to know if we need to use find or get methods for retrieving content
          multi
        })
      }
    },
    /**
     * Parse all blocks to regroup all block sources,
     * depending on their type.
     * We need to inventory
     * * conditional display sources
     * * usual table_view_id for display (TableSet, ...)
     * * map sources ?
     */
    inventorySources () {
      // Reset sources at each pages change
      this.resetSources()

      if (!this.page || !this.page.containers || !this.page.containers.length > 0) return

      this.page.containers.sort((a, b) => a.position - b.position)
      this.page.containers.forEach(container => {
        container.blocks.sort((a, b) => a.position - b.position)
        container.blocks.forEach(block => {
          /**
           * For each block, we'll collect
           * the conditional display source (if any),
           * and the data display source (if any)
           */
          if (block.conditionalDisplayTableViewId) {
            // we use BLOCK_TYPE.DATA_RECORD to explicit this is a one record source
            this.createOrExtendSource(block.conditionalDisplayTableViewId, block.id, BLOCK_TYPE.DATA_RECORD)
          }
          if (isGeoBlock(block.type)) {
            // For a geo column, we get the definition of all specified views
            block.settings.sources.forEach(mapSource => this.createOrExtendSource(mapSource.id, block.id, block.type))
          }
          if (block.settings.id) {
            this.createOrExtendSource(block.settings.id, block.id, block.type)
          }
        })
      })
    },
    async loadSourcesDefinitions () {
      const tableViews = await lckHelpers.retrieveViewDefinition(Object.keys(this.sources))
      tableViews.forEach(tv => {
        this.$set(this.sources[tv.id], 'definition', tv)
      })
    },
    /**
     * Load all content sources
     */
    async loadSourcesContents () {
      await Promise.all(Object.keys(this.sources).map(tableViewId => this.loadSourceContent(tableViewId)))
    },
    /**
     * Load a single content source from its tableViewId
     * Depending it's a multi or mono source,
     * or if a {rowId} is in the query params,
     * we use a find or get method
     */
    async loadSourceContent (tableViewId) {
      const currentSource = this.sources[tableViewId]
      if (this.$route.query.rowId) {
        currentSource.options.filters.rowId = this.$route.query.rowId
      }
      if (!currentSource.multi && this.$route.query.rowId) {
        currentSource.content = {
          data: [
            await lckServices.tableRow.get(this.$route.query.rowId, {
              query: {
                $lckGroupId: this.groupId
              }
            })
          ]
        }
      } else {
        currentSource.content = await lckHelpers.retrieveViewData(
          tableViewId,
          this.groupId,
          currentSource.options.page * currentSource.options.itemsPerPage,
          currentSource.options.itemsPerPage,
          currentSource.options.sort,
          currentSource.options.filters
        )
      }
    },
    async refreshDefinitionAndContent () {
      this.inventorySources()
      await this.loadSourcesDefinitions()
      await this.loadSourcesContents()
    },
    getBlockDefinition (block) {
      if (block.id === 'temp') return null
      /**
       * Special case for MapSet components,
       * definition is a Record<tableViewId, LckTableView>
       */
      if (isGeoBlock(block.type)) {
        const definitions = block.settings.sources?.map(mapSource => this.sources[mapSource.id].definition) || []
        return objectFromArray(definitions, 'id')
      }
      if (!block.settings.id) return null

      return this.sources[block.settings.id].definition
    },
    getBlockContent (block) {
      switch (block.type) {
        case BLOCK_TYPE.MAP_SET:
          // The result in an object whose the keys are the views ids and the values are the corresponding rows
          return block.settings.sources.reduce(
            (allContents, mapSource) => {
              /**
               * To manage shared sources between a MapSet and a TableSet or other set,
               * we need to check if the source content is an array (source is only used by MapSet)
               * or an { total, limit, skip, data } object (shared source)
               * If it's an object, we return data (paginated array), else only the content (already an array)
               */
              const sourceContent = this.sources[mapSource.id].content
              let currentContent = []
              if (Array.isArray(sourceContent)) {
                currentContent = sourceContent
              } else if (sourceContent?.data) {
                currentContent = sourceContent.data
              }
              return Object.assign(allContents, { [mapSource.id]: currentContent })
            },
            {}
          )
        case BLOCK_TYPE.MAP_FIELD:
          return {
            [block.settings.sources[0].id]: [this.sources[block.settings.sources[0].id].content]
          }
        case BLOCK_TYPE.TABLE_SET:
        case BLOCK_TYPE.DATA_RECORD:
        case BLOCK_TYPE.ACTION_BUTTON:
        case BLOCK_TYPE.MARKDOWN_FIELD:
        default:
          if (!block.settings.id) return null
          return this.sources[block.settings.id]?.content
      }
    },
    /**
     * Compute if the block need to be displayed,
     * depends on conditional display if set
     */
    isBlockDisplayed (block) {
      if (!block.conditionalDisplayTableViewId) return true
      if (!block.conditionalDisplayFieldId) return true
      const currentData = this.sources[block.conditionalDisplayTableViewId]?.content?.data?.[0]
      if (!currentData) return false
      return currentData.data[block.conditionalDisplayFieldId] === block.conditionalDisplayFieldValue
    },
    async onUpdateContentBlockTableView (block, pageIndexToGo) {
      block.loading = true
      switch (block.type) {
        case BLOCK_TYPE.TABLE_SET:
          const currentSource = this.sources[block.settings.id]
          currentSource.options.page = pageIndexToGo
          await this.loadSourceContent(block.settings.id)
          break
      }
      block.loading = false
    },
    async onUpdateSuggestions ({ columnTypeId, settings }, { query }) {
      this.autocompleteSuggestions = await this.searchItems({
        columnTypeId: columnTypeId,
        tableId: settings?.tableId,
        query,
        groupId: this.groupId
      })
    },
    async onUpdateCell (block, {
      rowId,
      columnId,
      newValue,
      tableViewId = ''
    }) {
      let currentBlock = null
      const blockId = block.id
      this.page.containers.forEach(container => {
        const blockIdIndex = container.blocks.findIndex(({ id }) => id === blockId)
        blockIdIndex > -1 && (currentBlock = container.blocks[blockIdIndex])
      })
      const blockContent = this.getBlockContent(block)
      const currentRow = isGeoBlock(currentBlock.type)
        ? blockContent[tableViewId].find(({ id }) => id === rowId)
        : blockContent.data.find(({ id }) => id === rowId)

      if (newValue.reference) newValue = newValue.reference

      this.cellState = {
        rowId: currentRow.id,
        columnId,
        waiting: true,
        isValid: false // don't know if we have to set to false or null
      }
      try {
        const res = await lckServices.tableRow.patch(currentRow.id, {
          data: {
            [columnId]: newValue
          },
          $lckGroupId: this.groupId
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
        case BLOCK_TYPE.TABLE_SET:
          // find the matching column_type_id to adapt
          const currentSource = this.sources[block.settings.id]
          currentSource.options.sort = {}
          currentSource.options.sort[`ref(data:${field})`] = order
          await this.loadSourceContent(block.settings.id)
          break
      }
      block.loading = false
    },
    async onUpdateFilters (block, filters) {
      block.loading = true
      switch (block.type) {
        case BLOCK_TYPE.TABLE_SET:
          const currentSource = this.sources[block.settings.id]
          currentSource.options.filters = filters
          await this.loadSourceContent(block.settings.id)
          break
      }
      block.loading = false
    },
    async onPageDetail (block, { rowId, pageDetailId }) {
      await this.$router.push({
        name: ROUTES_NAMES.PAGEDETAIL,
        params: {
          pageId: this.$route.params.pageId,
          pageDetailId: pageDetailId || block.settings.pageDetailId
        },
        query: { rowId }
      })
    },
    async onCreateRow (block, newRow) {
      const data = { ...newRow.data }
      const currentBlockDefinition = this.getBlockDefinition(block)
      if (this.$route.query.rowId) {
        const columnTargetDetail = currentBlockDefinition.columns.find(column => column.default === '{rowId}' && column.displayed === false)
        data[columnTargetDetail.id] = this.$route.query.rowId
      }
      this.$set(block, 'submitting', { inProgress: true })

      /**
       * For date columns, we format the date to ISO, date only
       */
      currentBlockDefinition.columns
        .forEach(c => {
          switch (c.column_type_id) {
            case COLUMN_TYPE.DATE:
              if (isValid(parseISO(newRow.data[c.id]))) {
                data[c.id] = formatISO(new Date(newRow.data[c.id]), { representation: 'date' })
              } else {
                data[c.id] = null
              }
              break
            case COLUMN_TYPE.RELATION_BETWEEN_TABLES:
            case COLUMN_TYPE.USER:
            case COLUMN_TYPE.GROUP:
            case COLUMN_TYPE.MULTI_USER:
              if (data[c.id]?.reference) {
                data[c.id] = data[c.id].reference
              }
              break
          }
        })
      try {
        await lckServices.tableRow.create({
          data,
          // eslint-disable-next-line @typescript-eslint/camelcase
          table_view_id: currentBlockDefinition.id,
          $lckGroupId: this.groupId
        })
        this.$set(block, 'displayNewDialog', false)
        this.$set(block, 'submitting', { inProgress: false })
        await this.loadSourceContent(block.settings.id)
      } catch (error) {
        this.$set(block, 'submitting', { inProgress: false, errors: [error] })
        this.$toast.add({
          severity: 'error',
          summary: this.$t('error.http.' + error.code),
          detail: this.$t('error.basic'),
          life: 3000
        })
      }
    },
    async onExportViewCSV (block) {
      if (!block.settings?.id) return
      this.exporting = true
      await lckHelpers.exportTableRowDataCSV(block.settings?.id, this.blocksOptions[block.id]?.filters, this.fileName = block.title, this.groupId)
      this.exporting = false
    },
    async onExportViewXLS (block) {
      if (!block.settings?.id) return
      this.exporting = true
      await lckHelpers.exportTableRowDataXLS(block.settings?.id, this.blocksOptions[block.id]?.filters, this.fileName = block.title, this.groupId)
      this.exporting = false
    },
    async onUploadFiles ({
      id: blockId
    }, {
      rowId,
      columnId,
      fileList
    }, newRow) {
      let currentBlock = null
      this.page.containers.forEach(container => {
        const blockIdIndex = container.blocks.findIndex(b => b.id === blockId)
        blockIdIndex > -1 && (currentBlock = container.blocks[blockIdIndex])
      })
      const currentRow = newRow || this.getBlockContent(currentBlock).data.find(d => d.id === rowId)
      this.cellState = {
        rowId: currentRow.id,
        columnId,
        waiting: true,
        isValid: false // don't know if we have to set to false or null
      }

      try {
        const newUploadedFiles = await lckHelpers.uploadMultipleFiles(fileList, this.workspaceId)
        /**
         * Here we need to know if we are in a creation or in a row update
         */
        if (newRow) {
          if (!currentRow.data[columnId]) this.$set(currentRow.data, columnId, [])
          currentRow.data[columnId].push(...newUploadedFiles)
        } else {
          const newDataFiles = currentRow.data[columnId]?.map(a => a.id) || []
          newDataFiles.push(...newUploadedFiles.map(u => u.id))

          /**
           * Need to update the data with the new files uploaded + the old files
           */
          const res = await lckServices.tableRow.patch(currentRow.id, {
            data: {
              [columnId]: newDataFiles
            }
          })
          this.cellState.isValid = true
          currentRow.data = res.data
        }
      } catch (error) {
        this.cellState.isValid = false
        this.$toast.add({
          severity: 'error',
          summary: this.$t('error.http.' + error.code),
          detail: error.message,
          life: 3000
        })
      }
      this.cellState.waiting = false
    },
    async onRemoveAttachment ({
      id: blockId
    }, {
      rowId,
      columnId,
      attachmentId
    }) {
      let currentBlock = null
      this.page.containers.forEach(container => {
        const blockIdIndex = container.blocks.findIndex(b => b.id === blockId)
        blockIdIndex > -1 && (currentBlock = container.blocks[blockIdIndex])
      })
      const currentRow = this.getBlockContent(currentBlock).data.find(d => d.id === rowId)
      this.cellState = {
        rowId: currentRow.id,
        columnId,
        waiting: true,
        isValid: false // don't know if we have to set to false or null
      }

      try {
        const newDataFiles = currentRow.data[columnId]?.filter(a => a.id !== attachmentId).map(a => a.id) || []
        const res = await lckServices.tableRow.patch(currentRow.id, {
          data: {
            [columnId]: newDataFiles
          }
        })
        this.cellState.isValid = true
        currentRow.data = res.data
      } catch (error) {
        this.cellState.isValid = false
        this.$toast.add({
          severity: 'error',
          summary: this.$t('error.http.' + error.code),
          detail: error.message,
          life: 3000
        })
      }
      this.cellState.waiting = false
    },
    async onDownloadAttachment ({ url, filename, mime }) {
      lckHelpers.downloadAttachment(url, filename, mime)
    },
    async onGeoDataEdit (block, features = []) {
      const { rowId, columnId, sourceId } = features[0]?.properties
      if (rowId && columnId && sourceId) {
        await this.onUpdateCell(block, {
          rowId,
          columnId,
          newValue: transformFeatureToWKT(features[0]),
          tableViewId: sourceId
        })
      }
    },
    async onGeoDataRemove (block, features = []) {
      const { rowId, columnId, sourceId } = features[0]?.properties
      if (rowId && columnId && sourceId) {
        await this.onUpdateCell(block, {
          rowId,
          columnId,
          newValue: null,
          tableViewId: sourceId
        })
      }
    },
    onContainerEditClick (containerToEdit) {
      this.currentContainerToEdit = containerToEdit.id ? containerToEdit : {}
      this.currentBlockToEdit = {}
      this.showUpdateSidebar = true
    },
    onNavAnchorLinkEditClick () {
      this.currentContainerToEdit = {}
      this.currentBlockToEdit = {}
      this.showUpdateSidebar = true
    },
    async onContainerEditInput (containerToEdit) {
      try {
        this.submitting = true
        const { id, ...data } = containerToEdit
        if (id !== 'temp') {
          // On update
          const updatedContainer = await lckServices.container.patch(id, data)
          for (const key in updatedContainer) {
            this.currentContainerToEdit[key] = updatedContainer[key]
          }
        } else {
          // On create
          this.currentContainerToEdit = await lckServices.container.create({ ...data, page_id: this.page.id })
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
    async onContainerDeleteInput (containerToDelete) {
      try {
        this.submitting = true
        if (containerToDelete?.id) {
          await lckServices.container.remove(containerToDelete.id)
          const containerIndex = this.page.containers.findIndex(container => container.id === containerToDelete.id)
          if (containerIndex >= 0) this.page.containers.splice(containerIndex, 1)
        }
        if (containerToDelete?.id === this.currentContainerToEdit.id) {
          this.onCloseUpdateContainerSidebar()
        }
        this.onContainerDeleteClose()
      } catch (error) {
        this.displayToastOnError(`${this.$t('pages.workspace.container.title')} ${containerToDelete.text}`, error)
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
      this.showUpdateSidebar = false
    },
    onBlockEditClickFromSidebar (blockToEdit) {
      this.currentBlockToEdit = {
        ...blockToEdit,
        definition: this.getBlockDefinition(blockToEdit)
      }
    },
    onContainerEditClickFromSidebar (containerToEdit) {
      this.currentContainerToEdit = containerToEdit
    },
    onBlockEditClick (containerToEdit, blockToEdit) {
      this.currentContainerToEdit = containerToEdit
      this.currentBlockToEdit = {
        ...blockToEdit
      }
      const currentBlockDefinition = this.getBlockDefinition(blockToEdit)
      if (currentBlockDefinition) this.currentBlockToEdit.definition = currentBlockDefinition
      this.showUpdateSidebar = true
    },
    async onBlockEditInput ({ blockToEdit, blockRefreshRequired }) {
      try {
        this.submitting = true
        const { id, ...data } = blockToEdit
        if (id !== 'temp') {
          // On update
          // Todo: Impossible to use data directly, sometimes we have definition and loading keys
          const updatedBlock = await lckServices.block.patch(id, data)
          // Update the existing block in page>container>block with its new properties
          const currentBlock = this.page.containers.find(c => c.id === updatedBlock.container_id).blocks.find(b => b.id === updatedBlock.id)
          for (const key in updatedBlock) {
            currentBlock[key] = updatedBlock[key]
          }
        } else {
          // On create
          this.currentBlockToEdit = await lckServices.block.create({
            ...data,
            container_id: this.currentContainerToEdit.id
          })
          // Add the block to the related container
          if (Array.isArray(this.currentContainerToEdit.blocks)) {
            this.currentContainerToEdit.blocks.push(this.currentBlockToEdit)
          } else {
            this.$set(this.currentContainerToEdit, 'blocks', [this.currentBlockToEdit])
          }
        }
        // Load the block definition and content if it is necessary
        if (blockRefreshRequired) await this.refreshDefinitionAndContent(this.currentBlockToEdit)
      } catch (error) {
        this.displayToastOnError(`${this.$t('pages.workspace.block.title')} ${this.currentBlockToEdit.title}`, error)
      } finally {
        this.submitting = false
      }
    },
    onBlockDeleteClick (containerToEdit, blockToDelete) {
      this.currentContainerToDelete = containerToEdit
      this.currentBlockToDelete = blockToDelete
      this.dialogVisibility.blockDelete = true
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
        this.displayToastOnError(`${this.$t('pages.workspace.block.title')} ${blockToDelete.title}`, error)
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
    async searchTableView (query, workspaceId) {
      const tableViewResult = await lckServices.tableView.find({
        query: {
          'table:database.workspace_id': workspaceId,
          $joinRelation: 'table.[database]',
          $sort: {
            text: 1
          },
          $select: ['table_view.text'],
          'table_view.text': {
            $ilike: `%${query}%`
          }
        }
      })
      return tableViewResult.data.map(tr => ({
        text: tr.text,
        value: tr.id
      }))
    },
    async searchField (query, tableViewId) {
      const tableColumnResult = await lckServices.tableColumn.find({
        query: {
          'views.id': tableViewId,
          $joinRelation: 'views',
          $sort: {
            text: 1
          },
          $select: ['table_column.text'],
          'table_column.text': {
            $ilike: `%${query}%`
          },
          $or: [{
            column_type_id: COLUMN_TYPE.BOOLEAN
          }, {
            settings: {
              formula_type_id: COLUMN_TYPE.BOOLEAN
            }
          }]
        }
      })
      return tableColumnResult.data.map(tc => ({
        text: tc.text,
        value: tc.id
      }))
    },
    async onSearchTableView ({ query }) {
      try {
        this.editableAutocompleteSuggestions = await this.searchTableView(query, this.workspaceId)
      } catch (error) {
        this.displayToastOnError(this.$t('components.multiAutocomplete.error'), error)
      }
    },
    async onSearchBlockDisplayTableView ({ query }) {
      try {
        this.blockDisplayTableViewSuggestions = await this.searchTableView(query, this.workspaceId)
      } catch (error) {
        this.displayToastOnError(this.$t('components.multiAutocomplete.error'), error)
      }
    },
    async onSearchBlockDisplayField ({ query, tableViewId }) {
      try {
        this.blockDisplayFieldSuggestions = await this.searchField(query, tableViewId)
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
    },
    goToPage ({ pageDetailId, pageQueryFieldId, rowData = null }) {
      const queryRowId = pageQueryFieldId ? rowData[pageQueryFieldId]?.reference : rowData.id

      this.$router.push({
        name: ROUTES_NAMES.PAGEDETAIL,
        params: {
          ...this.$route.params,
          pageDetailId
        },
        query: {
          rowId: queryRowId || this.$route.query.rowId
        }
      })
    },
    async onTriggerProcess (
      block,
      {
        processId,
        typePageTo,
        pageRedirectId,
        pageQueryFieldId,
        notificationSuccessTitle,
        notificationSuccessDescription,
        notificationErrorTitle,
        notificationErrorDescription,
        rowData = null
      }) {
      const tableRowId = rowData?.id || this.$route.query.rowId
      if (tableRowId) {
        this.$set(block, 'loading', true)
        const res = await createProcessRun({
          table_row_id: tableRowId,
          process_id: processId,
          waitForOutput: true
        })
        this.$set(block, 'loading', false)

        if (res && (res.code || res.status === PROCESS_RUN_STATUS.ERROR)) {
          this.$toast.add({
            severity: 'error',
            summary: notificationErrorTitle || this.$t('components.processPanel.failedNewRun'),
            detail: notificationErrorDescription || (res.code ? this.$t('error.http.' + res.code) : this.$t('error.basic')),
            life: 3000
          })
        } else {
          this.$toast.add({
            severity: 'success',
            summary: notificationSuccessTitle || this.$t('components.processPanel.successNewRun'),
            detail: notificationSuccessDescription || this.$t('components.processPanel.successNewRun'),
            life: 3000
          })

          /**
           * Redirect the user when process succeed
           */
          if (typePageTo && pageRedirectId) {
            if (typePageTo === ROUTES_NAMES.PAGEDETAIL) {
              this.goToPage({ pageRedirectId, pageQueryFieldId, rowData })
            } else {
              await this.$router.push({
                name: ROUTES_NAMES.PAGE,
                params: {
                  ...this.$route.params,
                  pageId: pageRedirectId
                }
              })
            }
          }
        }
      }
    }
  },
  async mounted () {
    if (this.$route?.params?.pageDetailId) {
      this.page = await lckHelpers.retrievePageWithContainersAndBlocks(this.$route.params.pageDetailId)
    } else {
      this.page = await lckHelpers.retrievePageWithContainersAndBlocks(this.pageId)
    }
  },
  async beforeRouteUpdate (to, from, next) {
    if (to.params.pageId !== from.params.pageId) {
      this.page = await lckHelpers.retrievePageWithContainersAndBlocks(to.params.pageId)
      next()
    }
    if (to.params.pageDetailId !== from.params.pageDetailId) {
      this.page = await lckHelpers.retrievePageWithContainersAndBlocks(to.params.pageDetailId)
      next()
    }
  },
  async beforeRouteLeave (to, from, next) {
    if (to.params.pageDetailId) {
      this.page = await lckHelpers.retrievePageWithContainersAndBlocks(to.params.pageDetailId)
      next()
    }
    if (from.params.pageDetailId && to.params.pageId) {
      this.page = await lckHelpers.retrievePageWithContainersAndBlocks(to.params.pageId)
      next()
    }
    next()
  },
  watch: {
    async page () {
      // Hide the updated container sidebar
      this.onCloseUpdateContainerSidebar()
      await this.refreshDefinitionAndContent()
      this.page.containers.forEach(container => {
        container.blocks.forEach(block => {
          this.$set(block, 'pageLoaded', true)
        })
      })
    }
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
  border: 2px solid var(--surface-lck-2);
  background-color: #ffffff;
  border-radius: var(--border-radius);
  box-shadow: 0px 0px 6px 0px rgba(194, 194, 194, 0.7);
  overflow: hidden;
}

.edit-container-line {
  padding-left: 0.5rem;
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

::v-deep .editable-block .block-content {
  padding: 0.5rem;
}

::v-deep .edit-block-line {
  padding-left: 0.5rem;
}

.lck-container {
  border-radius: var(--border-radius);
}

.lck-container:target {
  scroll-margin-top: 50px;
}

.lck-container.editable-container .edit-container-line {
  flex-direction: row;
}

.lck-container.editable-container .edit-container-line .lck-color-title {
  color: var(--primary-color)
}

::v-deep .p-breadcrumb {
  background: unset;
  border: unset;
  padding-left: 0;
}
/* classic content */

.lck-layout-classic .lck-container {
  display: flex;
  flex-direction: column;
}

/* Contenu Centré */

.lck-layout-centered .lck-container {
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  justify-content: space-between;
  overflow: auto;
  padding: 1rem;
}

.lck-layout-centered .lck-block {
  display: flex;
  flex: 0 1 100%;
}

.lck-layout-centered .lck-block.lck-media {
  justify-content: center;
}

/* Contenu Flex (2/n colonnes) */

.lck-layout-flex .lck-container div {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  flex-basis: 0;
  flex-wrap: wrap;
  column-gap: 1rem;
}

.lck-layout-flex .lck-container .lck-block.lck-media {
  justify-content: center;
}

.lck-layout-flex .lck-container .edit-container-line {
  align-self: flex-start;
  width: 100%;
}

@media (max-width: 900px) {
  .lck-layout-flex .lck-container div {
    flex-direction: column;
    flex-wrap: unset;
  }
}

/* Contenu Full */

.lck-layout-full {
  width: 100%;
  height: 100%;
}

.lck-layout-full .lck-container div {
  height: 100%;
  width: 100%;
  overflow: scroll;
}

</style>
