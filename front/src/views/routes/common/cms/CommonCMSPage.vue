<template>
  <div v-if="page" :class="layoutPageClass">
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

      <div class="lck-color-title p-m-4">
        <h1>{{ page.text }}</h1>
      </div>

      <lck-nav-anchor-link
        v-if="isNavBarAnchorLinkDisplayed || editMode"
        :containers="page.containers"
        :editMode="editMode"
        @edit-nav="onNavAnchorLinkEditClick"
      />

      <div class="lck-container-parent p-mx-2">
        <div
          v-for="container in page.containers"
          v-show="page.modeNavigation === 'tab' ? container.id === currentHash : true"
          :id="container.id"
          :key="container.id"
          class="lck-container"
        >
          <div
            class="p-px-4 w-full-without-px-4"
            :class="{
              'lck-elevation': container.elevation,
              'lck-container-active': page.modeNavigation === 'tab' && container.id === currentHash,
            }"
          >
            <h2 v-show="container.display_title" class="lck-color-title">
              {{ container.text }}
            </h2>
            <div class="lck-block-parent">
              <template v-for="block in container.blocks">
                <lck-block
                  :key="block.id"
                  v-if="isBlockDisplayed(block)"
                  class="lck-block"
                  :block="block"
                  :content="getBlockContent(block)"
                  :definition="getBlockDefinition(block)"
                  :workspaceId="workspaceId"
                  :groupId="groupId"
                  :userId="userId"
                  :autocompleteSuggestions="autocompleteSuggestions"
                  :exporting="exporting"
                  :cellState="cellState"
                  :secondarySources="secondarySources[block.id]"
                  v-on="$listeners"

                  @row-delete="onRowDelete(block, $event)"
                  @row-duplicate="onRowDuplicate(block, $event)"

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
                  @get-secondary-sources="getSecondarySources(block, $event)"

                  @download-attachment="onDownloadAttachment"
                  @upload-files="onUploadFiles(block, $event)"
                  @remove-attachment="onRemoveAttachment(block, $event)"

                  @go-to-page-detail="goToPage"
                  @create-process-run="onTriggerProcess(block, $event)"

                  @update-features="onGeoDataEdit(block, $event)"
                  @remove-features="onGeoDataRemove(block, $event)"
                />
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/* eslint-disable @typescript-eslint/camelcase */
import Vue, { PropOptions } from 'vue'

import {
  BLOCK_TYPE,
  EXTERNAL_APP_URL_PART_TYPE,
} from '@locokit/lck-glossary'

import { ROUTES_NAMES } from '@/router/paths'
import {
  LckBlock,
  LckBlockExtended,
  LckBlockSource,
  LckBlockSecondarySource,
  LckBlockGeoSource,
  LckPage,
  LckTableView,
  PROCESS_RUN_STATUS,
  LckChapter,
  LckTableColumn,
  LckTableRow,
  LckTableRowData,
} from '@/services/lck-api/definitions'
import {
  lckHelpers,
  lckServices,
} from '@/services/lck-api'
import {
  isGeoBlock,
  transformFeatureToWKT,
} from '@/services/lck-utils/map/transformWithOL'
import {
  objectFromArray,
} from '@/services/lck-utils/arrays'
import {
  createProcessRun,
} from '@/services/lck-helpers/process'

import Breadcrumb from 'primevue/breadcrumb'
import NavAnchorLink from '@/components/ui/NavAnchorLink/NavAnchorLink.vue'

import Block from '@/components/visualize/Block/Block.vue'
import { TranslateResult } from 'vue-i18n'
import { Paginated } from '@feathersjs/feathers'

export default {
  name: 'Page',
  components: {
    'lck-block': Block,
    'lck-nav-anchor-link': NavAnchorLink,
    'p-breadcrumb': Vue.extend(Breadcrumb),
  },
  props: {
    pageId: {
      type: String, // param is string because its from url params
      required: true,
    },
    pageDetailId: {
      type: String, // param is string because its from url params
      required: false,
    },
    chapters: {
      type: Array,
      default: () => ([]),
      required: false,
    } as PropOptions<LckChapter[]>,
    workspaceId: {
      type: String,
      required: true,
    },
    groupId: {
      type: String,
      required: false,
    },
    userId: {
      type: Number,
      required: false,
    },
    editMode: {
      type: Boolean,
      default: false,
    },
    sidebarItems: {
      type: Array,
      required: false,
    } as PropOptions<{
      id: string;
      label: string;
      subitems: {
        id: string;
        label: string;
        to: string;
        hidden: boolean;
      }[];
    }[]>,
  },
  data (): {
    page: LckPage;
    sources: Record<string, LckBlockSource>;
    blocksOptions: object;
    autocompleteSuggestions: { label: string; value: string | number }[];
    exporting: boolean;
    cellState: {
      columnId?: string;
      rowId?: string;
      isValid?: boolean;
      waiting?: boolean;
    };
    showUpdateSidebar: boolean;
    submitting: boolean;
    editableSidebarWidth: string;
    editableAutocompleteSuggestions: object | null;
    blockDisplayTableViewSuggestions: object | null;
    blockDisplayFieldSuggestions: object | null;
    geoSources: Record<string, LckBlockGeoSource>;
    secondarySources: Record<string, LckBlockSecondarySource>;
    } {
    return {
      page: new LckPage(),
      sources: {},
      blocksOptions: {},
      autocompleteSuggestions: [],
      exporting: false,
      cellState: {},
      showUpdateSidebar: false,
      submitting: false,
      editableSidebarWidth: '30rem',
      editableAutocompleteSuggestions: null,
      blockDisplayTableViewSuggestions: null,
      blockDisplayFieldSuggestions: null,
      geoSources: {},
      secondarySources: {},
    }
  },
  computed: {
    breadcrumb () {
      if (!this.sidebarItems || this.sidebarItems.length === 0) {
        return [{
          label: this.page?.text,
          disabled: true,
        }]
      }
      const parent: {
        id?: string;
        label?: string;
        to?: string;
        hidden?: boolean;
      } = this.sidebarItems.reduce((acc, chapter) => {
        chapter.subitems.find(page => {
          if (page.id === this.$route.params.pageId) acc = page
        })
        return acc
      }, {})

      return [
        {
          label: parent.label,
          to: this.$route.params.pageId,
        },
        {
          label: this.page?.text,
          disabled: true,
        },
      ]
    },
    isNavBarAnchorLinkDisplayed () {
      return this.page?.containers?.some(container => container.displayed_in_navbar)
    },
    currentHash (): string {
      return this.$route.hash.slice(1)
    },
    relatedChapterPages () {
      let relatedChapterPages = []
      if (this.page && Array.isArray(this.chapters)) {
        relatedChapterPages = this.chapters.find(
          chapter => chapter.id === this.page?.chapter_id,
        )?.pages.filter(
          page => page.id !== this.page?.id
        )
      }
      return relatedChapterPages || []
    },
    layoutPageClass () {
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
    },
    routeNamePage () {
      return ROUTES_NAMES.WORKSPACE_VISUALIZATION.PAGE
    },
    routeNamePageDetail () {
      return ROUTES_NAMES.WORKSPACE_VISUALIZATION.PAGE_DETAIL
    },
  },
  methods: {
    searchItems: lckHelpers.searchItems,
    onNavAnchorLinkEditClick (): void {
      this.currentContainerToEdit = null
      this.currentBlockToEdit = null
      this.showUpdateSidebar = true
    },
    async forceHashToNavigate (route) {
      if (this.isNavBarAnchorLinkDisplayed) {
        if (route) {
          // Execute when beforeRouteUpdate
          await this.$router.replace({ ...route, hash: `#${this.page.containers[0].id}` })
        } else if (!this.$route.hash) {
          // Execute when mounted
          await this.$router.replace({ ...this.$route, hash: `#${this.page.containers[0].id}` })
        }
      }
    },
    resetSources () {
      this.sources = {}
      this.secondarySources = {}
    },
    resetGeoSources () {
      this.geoSources = {}
    },
    resetSecondarySources (block: LckBlockExtended) {
      this.$set(this.secondarySources, block.id, {})
    },
    async getSecondarySources (block: LckBlock, tableViewIds: string[]) {
      const oldSecondarySources: LckBlockSecondarySource = this.secondarySources[block.id] || {}
      const newSecondarySources: LckBlockSecondarySource = {}
      const tableViewDefinitionsToGet: string[] = []
      // Loop on the secondary sources
      tableViewIds.forEach(id => {
        newSecondarySources[id] = {}
        if (oldSecondarySources[id]?.definition) {
          // Keep the previous source definition
          newSecondarySources[id].definition = oldSecondarySources[id].definition
        } else {
          // Need to get this new definition from the API
          tableViewDefinitionsToGet.push(id)
        }
      })
      if (tableViewDefinitionsToGet.length) {
        // Load the new definitions
        const tableViewDefinitions: LckTableView[] = await lckHelpers.retrieveViewDefinition(tableViewDefinitionsToGet)
        tableViewDefinitions.forEach(tableViewDefinition => {
          newSecondarySources[tableViewDefinition.id].definition = tableViewDefinition
        })
      }
      // Load the contents
      await Promise.all(tableViewIds.map(async tableViewId => {
        newSecondarySources[tableViewId].content = await lckHelpers.retrieveViewData(tableViewId, this.groupId, 0, -1) as LckTableRow[]
      }))
      this.$set(this.secondarySources, block.id, newSecondarySources)
    },
    createOrExtendSource (tableViewId: string, blockId: string, blockType: BLOCK_TYPE, pagination = 20) {
      /**
       * is the block type a multi-line one,
       * all _SET blocks
       */
      const multi = [
        BLOCK_TYPE.TABLE_SET,
        BLOCK_TYPE.MAP_SET,
        BLOCK_TYPE.KANBAN_SET,
        BLOCK_TYPE.CARD_SET,
      ].indexOf(blockType) > -1
      if (this.sources[tableViewId]) {
        if (multi !== this.sources[tableViewId].multi) {
          this.$toast.add({
            severity: 'warn',
            summary: this.$t('error.cms.blockMultiConflictSummary'),
            detail: this.$t('error.cms.blockMultiConflictDetail'),
          })
        }
        this.sources[tableViewId].blocks.push(blockId)
        /**
         * If the source already exist,
         * and if the block is not a geo one,
         * we set the itemsPerPage to the value coming from the block settings or to the default value : 20.
         * This means that, if a source is shared between a Table / Card / ... Set
         * AND a MapSet,
         * the pagination is enabled.
         * The map will only display the paginated result.
         * If we need to have "more" results in the Map (all for examples),
         * the map need to have its own source, so not the same TableView
         */
        if (!isGeoBlock(blockType) && multi) this.sources[tableViewId].options.itemsPerPage = pagination
      } else {
        /**
         * For the MapSet block, we don't limit the result
         * And for data records (or action button), we limit to 1
         */
        let itemsPerPage = pagination
        if (isGeoBlock(blockType)) itemsPerPage = -1
        if (!multi) itemsPerPage = 1

        this.$set(this.sources, tableViewId, {
          definition: null,
          content: null,
          blocks: [blockId],
          options: {
            sort: {
              createdAt: 1,
            },
            page: 0,
            itemsPerPage,
            filters: {},
          },
          // this option allows us to know if we need to use find or get methods for retrieving content
          multi,
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

      if (
        !this.page ||
        !this.page.containers ||
        this.page.containers.length === 0
      ) return

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
            // we could handle also a record creation
            if (block.settings.addSourceId) this.createOrExtendSource(block.settings.addSourceId, block.id, block.type)
          }
          if (block.settings.id) {
            this.createOrExtendSource(block.settings.id, block.id, block.type, block.settings.pagination)
          }
          if (block.settings.parts) {
            block.settings.parts.filter(p => p.type === EXTERNAL_APP_URL_PART_TYPE.SOURCE).forEach(s => {
              this.createOrExtendSource(s.id, block.id, block.type)
            })
          }
          this.resetSecondarySources(block)
        })
      })
    },
    async loadSourcesDefinitions () {
      if (Object.keys(this.sources).length === 0) return
      const tableViews = await lckHelpers.retrieveViewDefinition(Object.keys(this.sources)) || []
      tableViews.forEach(tv => {
        // find sortable columns
        const sort = tv.columns.filter(c => !!c.sort).reduce((pv, cv) => {
          pv[`ref(data:${cv.id})`] = cv.sort
          return pv
        }, {})
        // affect options of the source too for sorting
        this.$set(this.sources[tv.id], 'definition', tv)
        this.$set(this.sources[tv.id].options, 'sort', sort)
      })
    },
    getSourcesByTableId (tableId: string) {
      return Object.keys(this.sources).filter(tableViewId => {
        return this.sources[tableViewId].definition?.table_id === tableId
      }).map(tableViewId => (this.sources[tableViewId]))
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
    async loadSourceContent (tableViewId: string) {
      const currentSource = this.sources[tableViewId]
      if (this.$route.query.rowId) {
        currentSource.options.filters.rowId = this.$route.query.rowId
      }
      if (!currentSource.multi && this.$route.query.rowId) {
        this.$set(currentSource, 'content', {
          data: [
            await lckServices.tableRow.get(this.$route.query.rowId as string, {
              query: {
                $lckGroupId: this.groupId,
              },
            }),
          ],
        })
      } else {
        this.$set(currentSource, 'content', await lckHelpers.retrieveViewData(
          tableViewId,
          this.groupId,
          currentSource.options.page * currentSource.options.itemsPerPage,
          currentSource.options.itemsPerPage,
          currentSource.options.sort,
          currentSource.options.filters,
        ))
      }
      // if the source is a multi one with $limit = -1,
      if (Array.isArray(currentSource.content)) {
        lckHelpers.convertDateInRecords(
          currentSource.content,
          currentSource.definition?.columns as LckTableColumn[],
        )
      } else {
        // we are on a paginated result
        lckHelpers.convertDateInRecords(
          currentSource.content?.data as LckTableRow[],
          currentSource.definition?.columns as LckTableColumn[],
        )
      }
      // Reset the geo sources that use the same source
      for (const blockId in this.geoSources) {
        if (this.geoSources[blockId]?.definition?.[tableViewId]) {
          this.geoSources[blockId] = {}
        }
      }
    },
    async refreshDefinitionAndContent () {
      this.inventorySources()
      await this.loadSourcesDefinitions()
      await this.loadSourcesContents()
      this.resetGeoSources()
    },
    getBlockDefinition (block: LckBlockExtended) {
      if (block.id === 'temp') return null
      /**
       * Special case for MapSet components,
       * definition is a Record<tableViewId, LckTableView>
       */
      if (isGeoBlock(block.type)) {
        if (!this.geoSources[block.id]) this.geoSources[block.id] = {}
        if (
          !this.geoSources[block.id].definition ||
          Object.keys(this.geoSources[block.id].definition).length === 0
        ) {
          const definitions: LckTableView[] = block.settings?.sources?.map(mapSource => this.sources[mapSource.id]?.definition as LckTableView) || []
          if (block.settings?.addSourceId) {
            definitions.push(this.sources[block.settings?.addSourceId]?.definition as LckTableView)
          }
          this.$set(this.geoSources[block.id], 'definition', objectFromArray(definitions, 'id'))
        }
        return this.geoSources[block.id].definition
      }
      if (!block?.settings?.id) return null

      return this.sources[block.settings.id]?.definition
    },
    getBlockContent (block: LckBlockExtended): Record<string, LckTableRow[] | Paginated<LckTableRow> | LckTableRow | undefined> {
      switch (block.type) {
        case BLOCK_TYPE.MAP_SET:
          return block.settings?.sources.reduce(
            (allContents, mapSource) => {
              /**
               * To manage shared sources between a MapSet and a TableSet or other set,
               * we need to check if the source content is an array (source is only used by MapSet)
               * or an { total, limit, skip, data } object (shared source)
               * If it's an object, we return data (paginated array), else only the content (already an array)
               */
              const sourceContent = this.sources[mapSource.id]?.content
              let currentContent = null
              if (Array.isArray(sourceContent)) {
                currentContent = sourceContent
              } else if (sourceContent?.data) {
                currentContent = sourceContent.data
              }
              return Object.assign(allContents, { [mapSource.id]: currentContent })
            },
            {},
          )
        case BLOCK_TYPE.MAP_FIELD:
          return {
            [block.settings?.sources[0].id]: [this.sources[block.settings?.sources[0].id]?.content],
          }
        case BLOCK_TYPE.TABLE_SET:
          /**
           * A TableSet block uses paginated result but we can receive unpaginated result
           * so we encapsulate the received one if necessary.
           */
          if (!block.settings?.id) return null
          const sourceContent = this.sources[block.settings?.id]?.content
          return Array.isArray(sourceContent)
            ? {
              data: sourceContent,
              total: sourceContent.length,
              skip: 0,
              limit: sourceContent.length,
            }
            : sourceContent
        case BLOCK_TYPE.EXTERNAL_APP:
          /**
           * For the external app,
           * we build an object with key = source id
           * and value = content of the source (only one element)
           */
          const result: Record<string, LckTableRow> = {}
          block.settings.parts
            .filter(p => p.type === EXTERNAL_APP_URL_PART_TYPE.SOURCE)
            .forEach(s => {
              const sourceContent = this.sources[s.id]?.content
              if (!sourceContent) return
              if (Array.isArray(sourceContent)) {
                result[s.id] = sourceContent[0]
              } else {
                result[s.id] = sourceContent.data[0]
              }
            })
          return result
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
    isBlockDisplayed (block: LckBlockExtended) {
      if (!block.conditionalDisplayTableViewId) return true
      if (!block.conditionalDisplayFieldId) return true
      const currentData = (this.sources[block.conditionalDisplayTableViewId]?.content as Paginated<LckTableRow>)?.data?.[0]
      if (!currentData) return false
      return currentData.data[block.conditionalDisplayFieldId] === block.conditionalDisplayFieldValue
    },
    async onUpdateContentBlockTableView (block: LckBlockExtended, pageIndexToGo: number) {
      this.$set(block, 'loading', true)
      switch (block.type) {
        case BLOCK_TYPE.TABLE_SET:
          const currentSource = this.sources[block.settings.id as string]
          currentSource.options.page = pageIndexToGo
          await this.loadSourceContent(block.settings.id as string)
          break
      }
      this.$set(block, 'loading', false)
    },
    async onUpdateSuggestions (
      { columnTypeId, settings, filter }: { columnTypeId: number; settings: { tableId: string }; filter: {} },
      { query }: { query: string },
    ) {
      this.autocompleteSuggestions = await this.searchItems({
        columnTypeId: columnTypeId,
        tableId: settings?.tableId,
        query,
        groupId: this.groupId,
        filter,
      })
    },
    async onUpdateCell (block: LckBlockExtended, {
      rowId,
      columnId,
      newValue,
      tableViewId = '',
    }: { rowId: string; columnId: string; newValue: unknown; tableViewId: string }) {
      let currentBlock: LckBlockExtended | null = null
      const blockId = block.id
      this.page.containers.forEach(container => {
        const blockIdIndex = container.blocks.findIndex(({ id }) => id === blockId)
        blockIdIndex > -1 && (currentBlock = container.blocks[blockIdIndex])
      })
      const blockContent = this.getBlockContent(block)
      const currentRow = isGeoBlock(currentBlock?.type)
        ? blockContent[tableViewId].find(({ id }) => id === rowId)
        : blockContent.data.find(({ id }) => id === rowId)

      const blockDefinition = this.getBlockDefinition(block)
      const currentDefinition = isGeoBlock(currentBlock.type)
        ? blockDefinition[tableViewId]
        : blockDefinition

      const updatedColumn = currentDefinition.columns.find(c => c.id === columnId)
      const formattedData = lckHelpers.formatRowData(
        { [columnId]: newValue },
        { [columnId]: updatedColumn },
      )

      this.cellState = {
        rowId: currentRow.id,
        columnId,
        waiting: true,
        isValid: false, // don't know if we have to set to false or null
      }
      try {
        const res = await lckServices.tableRow.patch(currentRow.id, {
          data: formattedData,
          $lckGroupId: this.groupId,
        })
        this.cellState.isValid = true

        lckHelpers.convertDateInRecords(res, currentDefinition.columns)
        currentRow.data = res.data
        currentRow.text = res.text
      } catch (error) {
        this.cellState.isValid = false
      }
      this.cellState.waiting = false
    },
    async onSort (block: LckBlockExtended, { field, order }) {
      this.$set(block, 'loading', true)
      switch (block.type) {
        case BLOCK_TYPE.TABLE_SET:
          // find the matching column_type_id to adapt
          const currentSource = this.sources[block.settings.id as string]
          currentSource.options.sort = {}
          currentSource.options.sort[`ref(data:${field})`] = order
          await this.loadSourceContent(block.settings.id as string)
          break
      }
      this.$set(block, 'loading', false)
    },
    async onUpdateFilters (block: LckBlockExtended, filters) {
      this.$set(block, 'loading', true)
      switch (block.type) {
        case BLOCK_TYPE.TABLE_SET:
          const currentSource = this.sources[block.settings.id as string]
          currentSource.options.filters = filters
          await this.loadSourceContent(block.settings.id as string)
          break
      }
      this.$set(block, 'loading', false)
    },
    async onRowDelete (block: LckBlockExtended, row) {
      try {
        await lckServices.tableRow.remove(row.id)
        await this.loadSourceContent(block.settings.id as string)
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: error.code ? this.$t('error.http.' + error.code) : this.$t('error.basic'),
          detail: this.$t('error.lck.ROW_DELETION'),
          life: 3000,
        })
      }
    },
    async onRowDuplicate (block: LckBlockExtended, { data, table_id }) {
      try {
        const currentBlockDefinition = this.getBlockDefinition(block)
        const columnsObject = objectFromArray(currentBlockDefinition.columns, 'id')
        const formattedData = lckHelpers.formatRowData(data, columnsObject, true)
        await lckServices.tableRow.create({
          data: formattedData,
          table_id,
        })
        await this.loadSourceContent(block.settings.id as string)
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: error.code ? this.$t('error.http.' + error.code) : this.$t('error.basic'),
          detail: this.$t('error.lck.ROW_DUPLICATE'),
          life: 3000,
        })
      }
    },

    async onPageDetail (
      block: LckBlockExtended,
      { rowId, pageDetailId }: { rowId: string; pageDetailId: string },
    ) {
      await this.$router.push({
        name: this.routeNamePageDetail,
        params: {
          pageId: this.$route.params.pageId,
          pageDetailId: pageDetailId || block.settings.pageDetailId,
        },
        query: { rowId },
      })
    },
    async onCreateRow (block: LckBlockExtended, newRow: LckTableRow) {
      const data = { ...newRow.data }
      const blockDefinition = this.getBlockDefinition(block)

      let currentBlockDefinition = blockDefinition
      if (isGeoBlock(block.type)) {
        if (block.settings.addSourceId) {
          currentBlockDefinition = blockDefinition[block.settings.addSourceId]
        }
      }

      if (this.$route.query.rowId) {
        const columnTargetDetail = currentBlockDefinition.columns.find(column => column.default?.value === '{rowId}' && column.displayed === false)
        data[columnTargetDetail.id] = this.$route.query.rowId
      }
      this.$set(block, 'submitting', { inProgress: true })

      const columnsObject = objectFromArray(currentBlockDefinition.columns, 'id')
      const formattedData = lckHelpers.formatRowData(data, columnsObject)

      try {
        await lckServices.tableRow.create({
          data: formattedData,
          table_view_id: currentBlockDefinition.id,
          $lckGroupId: this.groupId,
        })
        this.$set(block, 'displayNewDialog', false)
        this.$set(block, 'submitting', { inProgress: false })
        /**
         * if the block have a redirectPage option,
         * we redirect the user to the redirectPage
         */
        if (block.settings?.redirectPageId) {
          this.$router.push({
            name: this.routeNamePage,
            params: {
              ...this.$route.params,
              pageId: block.settings.redirectPageId,
            },
          })
        } else {
          await this.loadSourceContent(currentBlockDefinition.id)
          /**
           * Here we need to load all impacted sources,
           * so every multi source that share the same table_id
           * than the view that is at the origin of the record creation
           */
          const sourcesToRefresh = this.getSourcesByTableId(currentBlockDefinition.table_id)
          await Promise.all(sourcesToRefresh.map(source => {
            if (source.definition.id !== currentBlockDefinition.id && source.multi === true) {
              return this.loadSourceContent(source.definition.id)
            }
          }))
        }
      } catch (error) {
        this.$set(block, 'submitting', { inProgress: false, errors: [error] })
        this.$toast.add({
          severity: 'error',
          summary: this.$t('error.http.' + error.code),
          detail: this.$t('error.basic'),
          life: 5000,
        })
      }
    },
    async onExportViewCSV (block: LckBlockExtended) {
      if (!block.settings?.id) return
      this.exporting = true
      await lckHelpers.exportTableRowDataCSV(
        block.settings?.id,
        this.blocksOptions[block.id]?.filters,
        block.title || 'export',
        this.groupId,
      )
      this.exporting = false
    },
    async onExportViewXLS (block: LckBlockExtended) {
      if (!block.settings?.id) return
      this.exporting = true
      await lckHelpers.exportTableRowDataXLS(
        block.settings?.id,
        this.blocksOptions[block.id]?.filters,
        block.title || 'export',
        this.groupId,
      )
      this.exporting = false
    },
    async onUploadFiles ({
      id: blockId,
    }, {
      rowId,
      columnId,
      fileList,
      newRow,
    }) {
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
        isValid: false, // don't know if we have to set to false or null
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
              [columnId]: newDataFiles,
            },
          })

          const blockDefinition = this.getBlockDefinition(currentBlock)
          lckHelpers.convertDateInRecords(res, blockDefinition.columns)

          currentRow.data = res.data
        }
        this.cellState.isValid = true
      } catch (error) {
        this.cellState.isValid = false
        this.$toast.add({
          severity: 'error',
          summary: this.$t('error.http.' + error.code),
          detail: error.message,
          life: 5000,
        })
      }
      this.cellState.waiting = false
    },
    async onRemoveAttachment ({
      id: blockId,
    }, {
      rowId,
      columnId,
      attachmentId,
      newRow,
    }) {
      /**
       * Here we need to know if we are in a creation or in a row update
       */
      if (newRow) {
        // Row creation -> only update local data
        if (!Array.isArray(newRow.data[columnId])) {
          this.$set(newRow.data, columnId, [])
        } else {
          const deletedAttachmentIndex = newRow.data[columnId].findIndex(a => a.id === attachmentId)
          if (deletedAttachmentIndex >= 0) newRow.data[columnId].splice(deletedAttachmentIndex, 1)
        }
        this.cellState.isValid = true
      } else {
        // Row update -> update database and local data
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
          isValid: false, // don't know if we have to set to false or null
        }

        try {
          const newDataFiles = currentRow.data[columnId]?.filter(a => a.id !== attachmentId).map(a => a.id) || []
          const res = await lckServices.tableRow.patch(currentRow.id, {
            data: {
              [columnId]: newDataFiles,
            },
          })
          this.cellState.isValid = true

          const blockDefinition = this.getBlockDefinition(currentBlock)
          lckHelpers.convertDateInRecords(res, blockDefinition.columns)

          currentRow.data = res.data
        } catch (error) {
          this.cellState.isValid = false
          this.$toast.add({
            severity: 'error',
            summary: this.$t('error.http.' + error.code),
            detail: error.message,
            life: 5000,
          })
        }
      }
      this.cellState.waiting = false
    },
    async onDownloadAttachment ({ url, filename, mime }) {
      lckHelpers.downloadAttachment(url, filename, mime)
    },
    async onGeoDataEdit (block: LckBlockExtended, features = []) {
      const { rowId, columnId, sourceId } = features[0]?.properties
      const column = this.getBlockDefinition(block)[sourceId].columns.find(c => c.id === columnId)
      if (rowId && columnId && sourceId && column) {
        await this.onUpdateCell(block, {
          rowId,
          columnId,
          newValue: transformFeatureToWKT(features[0], column.column_type_id),
          tableViewId: sourceId,
        })
      }
    },
    async onGeoDataRemove (block: LckBlock, features = []) {
      const { rowId, columnId, sourceId } = features[0]?.properties
      if (rowId && columnId && sourceId) {
        await this.onUpdateCell(block, {
          rowId,
          columnId,
          newValue: null,
          tableViewId: sourceId,
        })
      }
    },

    async searchTableView (query: string, workspaceId: string) {
      return await lckHelpers.searchTableView(query, workspaceId)
    },
    async searchField (query: string, tableViewId: string, filters = {}) {
      return await lckHelpers.searchColumnsFromTableView(query, tableViewId, filters)
    },
    async onSearchTableView ({ query }) {
      try {
        this.editableAutocompleteSuggestions = await this.searchTableView(query, this.workspaceId)
      } catch (error) {
        this.displayToastOnError(this.$t('components.multiAutocomplete.error'), error)
      }
    },
    async onSearchFieldByColumnType ({ query, tableViewId, columnTypes, settings }) {
      const additionalFilters = []
      if (settings) additionalFilters.push({ settings })
      if (columnTypes) {
        additionalFilters.push({
          column_type_id: { $in: columnTypes },
        })
      }
      try {
        this.editableAutocompleteSuggestions = await this.searchField(query, tableViewId, { $and: additionalFilters })
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
        this.blockDisplayFieldSuggestions = await lckHelpers.searchBooleanColumnsFromTableView(query, tableViewId)
      } catch (error) {
        this.displayToastOnError(this.$t('components.multiAutocomplete.error'), error)
      }
    },
    displayToastOnError (summary: TranslateResult, error: unknown) {
      this.$toast.add({
        severity: 'error',
        summary,
        detail: error.code ? this.$t('error.http.' + error.code) : this.$t('error.basic'),
        life: 5000,
      })
    },
    goToPage (page: { pageDetailId: string; pageQueryFieldId: string; rowData: LckTableRowData | null }) {
      const query: { rowId?: string } = {}
      if (page.rowData) {
        query.rowId = page.pageQueryFieldId
          ? (page.rowData[page.pageQueryFieldId] as LckTableRowDataComplex)?.reference
          : page.rowData?.id
      } else if (this.$route.query.rowId) {
        query.rowId = this.$route.query.rowId as string
      }

      this.$router.push({
        name: this.routeNamePageDetail,
        params: {
          ...this.$route.params,
          pageDetailId: page.pageDetailId,
        },
        query,
      })
    },
    async onTriggerProcess (
      block: LckBlockExtended,
      {
        processId,
        typePageTo,
        pageRedirectId,
        pageQueryFieldId,
        notificationSuccessTitle,
        notificationSuccessDescription,
        notificationErrorTitle,
        notificationErrorDescription,
        rowData = null,
      }) {
      const tableRowId = rowData?.id || this.$route.query.rowId
      if (tableRowId) {
        this.$set(block, 'loading', true)
        const res = await createProcessRun({
          table_row_id: tableRowId,
          process_id: processId,
          waitForOutput: true,
        })
        this.$set(block, 'loading', false)

        if (res && (res.code || res.status === PROCESS_RUN_STATUS.ERROR)) {
          this.$toast.add({
            severity: 'error',
            summary: notificationErrorTitle || this.$t('components.processPanel.failedNewRun'),
            detail: notificationErrorDescription || (res.code ? this.$t('error.http.' + res.code) : this.$t('error.basic')),
            life: 5000,
          })
          // Reset source when a workflow possibly updates data and failed
          await this.refreshDefinitionAndContent()
        } else {
          this.$toast.add({
            severity: 'success',
            summary: notificationSuccessTitle || this.$t('components.processPanel.successNewRun'),
            detail: notificationSuccessDescription || this.$t('components.processPanel.successNewRun'),
            life: 5000,
          })

          /**
           * Redirect the user when process succeed
           */
          if (typePageTo && pageRedirectId) {
            if (typePageTo === this.routeNamePageDetail) {
              this.goToPage({
                pageDetailId: pageRedirectId,
                pageQueryFieldId,
                rowData,
              })
            } else {
              await this.$router.push({
                name: this.routeNamePage,
                params: {
                  ...this.$route.params,
                  pageId: pageRedirectId,
                },
              })
            }
          } else {
            // Reset source when a workflow possibly updates data and when user stay in the same page
            await this.refreshDefinitionAndContent()
          }
        }
      }
    },
  },
  async mounted () {
    if (this.$route?.params?.pageDetailId) {
      this.page = await lckHelpers.retrievePageWithContainersAndBlocks(this.$route.params.pageDetailId)
    } else {
      this.page = await lckHelpers.retrievePageWithContainersAndBlocks(this.pageId)
    }
    this.forceHashToNavigate()
  },
  async beforeRouteUpdate (to, from, next) {
    if (to.params.pageId !== from.params.pageId) {
      this.page = await lckHelpers.retrievePageWithContainersAndBlocks(to.params.pageId)
      if (!to.hash) {
        this.forceHashToNavigate(to)
      }
      next()
    }
    if (to.params.pageDetailId !== from.params.pageDetailId) {
      this.page = await lckHelpers.retrievePageWithContainersAndBlocks(to.params.pageDetailId)
      next()
    }
    return next() // To allow hash insertion
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
      await this.refreshDefinitionAndContent()
      if (!this.page.containers) return
      this.page.containers.forEach(container => {
        container.blocks.forEach(block => {
          this.$set(block, 'pageLoaded', true)
        })
      })
    },
  },
}
</script>

<style scoped>
@media print {
  .lck-page-content > .lck-color-title {
    margin: 0 !important;
    padding: 0 !important;
  }

  .lck-container:not(:first-child) {
    break-before: page;
    break-inside: avoid;
  }

  .lck-container {
    box-shadow: unset;
    background-color: #FFFFFF;
    display: block !important;
  }

  .lck-container > div {
    height: auto;
    box-shadow: unset;
  }

  /*
  * Because of "display: none" on other container, map canvas is set with default size values.
  * We need to display map's container with the same width/height of map canvas
  * Otherwise the map's container is too big compared to map canvas. So attribution and scale information is mal placed.
  */
  .lck-container > :not(.lck-container-active) ::v-deep .map-container {
    width: 400px !important;
    height: 300px !important;
    min-height: unset !important;
  }

  .lck-page-content .lck-container-parent .lck-container .lck-color-title {
    display: block !important;
  }

  .lck-block {
    display: block !important;
  }

  .lck-layout-centered .lck-container {
    overflow: unset !important;
  }
}

.lck-page-content {
  min-width: 20rem;
  transition-duration: 0.3s;
}

.lck-container {
  border-radius: var(--border-radius);
}

.lck-container:target {
  scroll-margin-top: 50px;
}

::v-deep .p-breadcrumb {
  background: unset;
  border: unset;
  padding-left: 1.5rem;
}

.w-full-without-px-4 {
  width: calc(100% - 3rem);
}

/**
 * Layouts
 */

/* Classic */
.lck-layout-classic .lck-container {
  display: flex;
  flex-direction: column;
}

/* Centered */
.lck-layout-centered .lck-container {
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  justify-content: space-between;
  padding: 1rem;
  overflow: auto;
}
.lck-layout-centered .lck-block {
  display: flex;
  flex: 0 1 100%;
}
.lck-layout-centered .lck-block.lck-media {
  justify-content: center;
}

/* Flex (2/n columns) */
@media (min-width: 900px) {
  .lck-layout-flex,
  .lck-layout-flex .lck-page-content {
    height: 100%;
    max-height: 100%;
    overflow: hidden;
  }
  .lck-layout-flex .lck-page-content .lck-container-parent {
    height: calc(100% - 5rem);
    max-height: calc(100% - 5rem);
    overflow: hidden;
  }
  .lck-layout-flex .lck-block-parent {
    min-height: 100%;
    height: 100%;
    max-height: 100%;
    overflow: auto;
  }
  .lck-layout-flex .lck-block {
    flex: 1 0 0;
    display: flex;
  }
  .lck-layout-flex .lck-page-content .lck-container-parent {
    display: flex;
  }

  .lck-layout-flex .lck-container {
    flex: 1 1 0;
    min-width: 50%;
    width: 50%;
    max-width: 50%;
    padding: 0.5rem;
    overflow: auto;
    display:flex;
  }

  .lck-layout-flex .lck-container .lck-block.lck-media {
    justify-content: center;
  }

  .lck-layout-flex .lck-container .edit-container-line {
    align-self: flex-start;
    width: 100%;
  }
}

/* Full */
@media (min-width: 900px) {
  .lck-layout-full,
  .lck-layout-full .lck-page-content {
    height: 100%;
    min-height: 100%;
    overflow: hidden;
  }
  .lck-layout-full .lck-page-content .lck-container-parent {
    height: calc(100% - 5rem);
    max-height: calc(100% - 5rem);
    min-height: unset;
    overflow: hidden;
  }
  .lck-layout-full .lck-page-content .lck-container-parent .lck-container,
  .lck-layout-full .lck-page-content .lck-container-parent .lck-container .lck-block-parent,
  .lck-layout-full .lck-page-content .lck-container-parent .lck-container .lck-block-parent .lck-block {
    height: 100%;
    min-height: 100%;
    overflow: auto;
  }
}
</style>
