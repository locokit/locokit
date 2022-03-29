<template>
  <div v-if="page" :class="[layoutPageClass, 'lck-workspace-admin-cms-page']">
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

      <draggable
        :key="page.id"
        v-model="page.containers"
        handle=".handle"
        @change="onContainerReorderClick"
        class="lck-container-parent p-mx-2"
        :class="{
          'editable-container-parent': editMode,
        }"
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
                icon="bi bi-grip-vertical"
              />
              <p-button
                :title="$t('pages.workspace.container.edit')"
                class="p-button-lg p-button-text edit-container-button"
                icon="bi bi-pencil"
                @click="onContainerEditClick(container)"
              />
              <p-button
                :title="$t('pages.workspace.container.delete')"
                class="p-button-lg p-button-text remove-container-button"
                icon="bi bi-trash"
                @click="onContainerDeleteClick(container)"
              />
            </span>
          </div>
          <draggable
            :key="container.id"
            v-model="container.blocks"
            @change="onBlockReorderClick(container, $event)"
            handle=".handle-block"
            class="lck-block-parent"
          >
            <template v-for="block in container.blocks">
              <lck-block
                :key="block.id"
                v-if="editMode || isBlockDisplayed(block)"
                class="lck-block"
                :class="{
                  'p-pb-4': !editMode
                }"
                :block="block"
                :content="getBlockContent(block)"
                :definition="getBlockDefinition(block)"
                :workspaceId="workspaceId"
                :groupId="groupId"
                :userId="userId"
                :autocompleteSuggestions="autocompleteSuggestions"
                :exporting="exporting"
                :cellState="cellState"
                :editMode="editMode"
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
                @update-block="onBlockEditClick(container, block)"
                @confirm-delete-block="onBlockDeleteClick(container, block)"
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
          </draggable>
          <button
            v-if="editMode"
            class="p-mx-auto page-new-button"
            @click="onBlockEditClick(container, { id: 'temp' })"
          >
            <i class="bi bi-plus page-new-icon"></i>
            <p class="p-button p-button-sm">
              {{ $t('pages.workspace.block.create') }}
            </p>
          </button>
        </div>
      </draggable>
      <button
        v-if="editMode"
        class="p-mx-auto page-new-button"
        @click="onContainerEditClick(container, { id: 'temp' })"
      >
        <i class="bi bi-plus page-new-icon"></i>
        <p class="p-button p-button-sm">
          {{ $t('pages.workspace.container.create') }}
        </p>
      </button>
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

      @updateModeNavigation="updateModeNavigation"

      @add-new-block="onBlockEditClickFromSidebar"
      @edit-block="onBlockEditClickFromSidebar"
      @confirm-delete-block="onBlockDeleteClick(currentContainerToEdit, $event)"

      @add-new-container="onContainerEditClickFromSidebar"
      @edit-container="onContainerEditClickFromSidebar"
      @confirm-delete-container="onContainerDeleteClick($event)"

      @reset-current-block="onBlockEditClickFromSidebar"
      @reset-current-container="onContainerEditClickFromSidebar"
      @close="onCloseUpdateContainerSidebar"
      @search-table-view="onSearchTableView"
      @search-field="onSearchFieldByColumnType"

      @search-block-display-table-view="onSearchBlockDisplayTableView"
      @search-block-display-field="onSearchBlockDisplayField"
    />
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import Vue from 'vue'
import draggable from 'vuedraggable'

import CommonCMSPage from '../../../common/cms/CommonCMSPage.vue'
import { ROUTES_NAMES } from '@/router/paths'

import Button from 'primevue/button'

import UpdateSidebar from '@/components/visualize/UpdateSidebar/UpdateSidebar.vue'
import NavAnchorLink from '@/components/ui/NavAnchorLink/NavAnchorLink.vue'

import { lckServices } from '@/services/lck-api'
import {
  LckBlockSource,
  LckBlockGeoSource,
  LckBlockSecondarySource,
  LckPage,
  LckContainer,
  LckBlockExtended,
} from '@/services/lck-api/definitions'

export default Vue.extend({
  name: 'WorkspaceAdminCMSPage',
  extends: CommonCMSPage,
  components: {
    'update-sidebar': UpdateSidebar,
    'lck-nav-anchor-link': NavAnchorLink,
    'p-button': Button,
    draggable: Vue.extend(draggable),
  },
  props: {
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
  },
  data (): {
    page: LckPage;
    sources: Record<string, LckBlockSource>;
    blocksOptions: object;
    autocompleteSuggestions: null;
    exporting: boolean;
    cellState: {
      columnId?: string;
      rowId?: string;
      isValid?: boolean;
      waiting?: boolean;
    };
    showUpdateSidebar: boolean;
    currentContainerToEdit: LckContainer | null;
    currentContainerToDelete: LckContainer | null;
    currentBlockToEdit: LckBlockExtended | null;
    currentBlockToDelete: LckBlockExtended | null;
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
      autocompleteSuggestions: null,
      exporting: false,
      cellState: {},
      showUpdateSidebar: false,
      currentContainerToEdit: null,
      currentContainerToDelete: null,
      currentBlockToEdit: null,
      currentBlockToDelete: null,
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
    routeNamePage () {
      return ROUTES_NAMES.WORKSPACE_ADMIN.CMS_PAGE
    },
    routeNamePageDetail () {
      return ROUTES_NAMES.WORKSPACE_ADMIN.CMS_PAGE_DETAIL
    },
  },
  methods: {
    /**
     * Edition part
     */
    async updateModeNavigation (modeNavigation: string) {
      try {
        this.submitting = true
        await lckServices.page.patch(this.page.id, { modeNavigation })
        this.page.modeNavigation = modeNavigation
        this.$toast.add({
          severity: 'success',
          summary: this.$t('components.processPanel.SUCCESS'),
          detail: this.$t('success.updated'),
          life: 5000,
        })
      } catch (error) {
        this.displayToastOnError(`${this.$t('pages.workspace.page')} ${this.page.text}`, error)
      } finally {
        this.submitting = false
      }
    },
    onContainerEditClick (containerToEdit: LckContainer) {
      this.currentContainerToEdit = containerToEdit?.id ? containerToEdit : null
      this.currentBlockToEdit = null
      this.showUpdateSidebar = true
    },
    onNavAnchorLinkEditClick () {
      this.currentContainerToEdit = null
      this.currentBlockToEdit = null
      this.showUpdateSidebar = true
    },
    async onContainerEditInput (containerToEdit: LckContainer) {
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
          this.currentContainerToEdit = await lckServices.container.create({
            ...data,
            page_id: this.page.id,
          })
          this.page.containers.push(this.currentContainerToEdit)
        }
      } catch (error) {
        this.displayToastOnError(`${this.$t('pages.workspace.container')} ${containerToEdit.text}`, error)
      } finally {
        this.submitting = false
      }
    },
    onContainerDeleteClick (containerToDelete: LckContainer) {
      this.currentContainerToDelete = containerToDelete
      this.$confirm.require({
        message: `${this.$t('form.specificDeleteConfirmation')} ${containerToDelete.text}`,
        header: this.$t('form.confirmation'),
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          try {
            await this.onContainerDeleteInput(containerToDelete)
            this.$toast.add({
              severity: 'success',
              summary: this.$t('components.processPanel.SUCCESS'),
              detail: this.$t('success.removed'),
              life: 5000,
            })
          } catch (error) {
            this.displayToastOnError(`${this.$t('pages.workspace.container.title')} ${containerToDelete.text}`, error)
          }
        },
      })
    },
    async onContainerDeleteInput (containerToDelete: LckContainer) {
      if (containerToDelete?.id) {
        await lckServices.container.remove(containerToDelete.id)
        const containerIndex = this.page.containers.findIndex(container => container.id === containerToDelete.id)
        if (containerIndex >= 0) this.page.containers.splice(containerIndex, 1)
      }
      if (containerToDelete?.id === this.currentContainerToEdit?.id) {
        this.onCloseUpdateContainerSidebar()
      }
    },
    async onContainerReorderClick ({ moved }: { moved: { oldIndex: number; newIndex: number }}) {
      if (moved) {
        const minIndex = Math.min(moved.oldIndex, moved.newIndex)
        const maxIndex = Math.max(moved.oldIndex, moved.newIndex)

        const updatedContainerPromises = []
        for (let index = minIndex; index <= maxIndex; index++) {
          updatedContainerPromises.push(
            lckServices.container.patch(this.page.containers[index].id, { position: index }),
          )
        }
        await Promise.all(updatedContainerPromises)
          .catch(error => {
            this.displayToastOnError(`${this.$t('pages.workspace.page')} ${this.page.text}`, error)
          })
      }
    },
    onCloseUpdateContainerSidebar () {
      this.currentContainerToEdit = null
      this.currentBlockToEdit = null
      this.showUpdateSidebar = false
    },
    onBlockEditClickFromSidebar (blockToEdit: LckBlockExtended) {
      this.currentBlockToEdit = {
        ...blockToEdit,
        definition: this.getBlockDefinition(blockToEdit),
      }
    },
    onContainerEditClickFromSidebar (containerToEdit: LckContainer) {
      this.currentContainerToEdit = containerToEdit
    },
    onBlockEditClick (containerToEdit: LckContainer, blockToEdit: LckBlockExtended) {
      this.currentContainerToEdit = containerToEdit
      this.currentBlockToEdit = {
        ...blockToEdit,
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
          const updatedBlock = await lckServices.block.patch(id, data)
          // Update the existing block in page>container>block with its new properties
          const currentBlock = this.page.containers.find(c => c.id === updatedBlock.containerId).blocks.find(b => b.id === updatedBlock.id)
          for (const key in updatedBlock) {
            currentBlock[key] = updatedBlock[key]
          }
        } else {
          // On create
          this.currentBlockToEdit = await lckServices.block.create({
            ...data,
            container_id: this.currentContainerToEdit.id,
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
    onBlockDeleteClick (containerToEdit: LckContainer, blockToDelete: LckBlockExtended) {
      this.currentContainerToDelete = containerToEdit
      this.currentBlockToDelete = blockToDelete
      this.$confirm.require({
        message: `${this.$t('form.specificDeleteConfirmation')} ${blockToDelete.title}`,
        header: this.$t('form.confirmation'),
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          try {
            await this.onBlockDeleteInput(blockToDelete)
            this.$toast.add({
              severity: 'success',
              summary: this.$t('components.processPanel.SUCCESS'),
              detail: this.$t('success.removed'),
              life: 5000,
            })
          } catch (error) {
            this.displayToastOnError(`${this.$t('pages.workspace.block.title')} ${blockToDelete.title}`, error)
          }
        },
      })
    },
    async onBlockDeleteInput (blockToDelete: LckBlockExtended) {
      if (blockToDelete.id) {
        await lckServices.block.remove(blockToDelete.id)
        const blockToDeleteIndex = this.currentContainerToDelete?.blocks.findIndex(block => block.id === blockToDelete.id)
        if (blockToDeleteIndex && blockToDeleteIndex >= 0) {
          (this.currentContainerToDelete as LckContainer).blocks.splice(blockToDeleteIndex, 1)
        }
        if (blockToDelete.id === this.currentBlockToEdit?.id) {
          this.currentBlockToEdit = null
        }
      }
    },
    async onBlockReorderClick (
      container: LckContainer,
      { moved }: { moved: { oldIndex: number; newIndex: number}},
    ) {
      if (moved) {
        const minIndex = Math.min(moved.oldIndex, moved.newIndex)
        const maxIndex = Math.max(moved.oldIndex, moved.newIndex)

        const updatedBlockPromises = []
        for (let index = minIndex; index <= maxIndex; index++) {
          updatedBlockPromises.push(
            lckServices.block.patch(container.blocks[index].id, { position: index }),
          )
        }
        await Promise.all(updatedBlockPromises)
          .catch(error => {
            this.displayToastOnError(`${this.$t('pages.workspace.container')} ${container.text}`, error)
          })
      }
    },
  },
})
</script>

<style lang="scss">

/**
 * We don't use a component-scoped CSS to apply the parent component style.
 */

.lck-workspace-admin-cms-page {
  /**
  * Editable container, draggable & co.
  */
  .editable-container {
    margin-bottom: 1rem;
    border: 2px solid var(--color-white);
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

  .lck-container.editable-container .edit-container-line {
    flex-direction: row;
  }

  .lck-container.editable-container .edit-container-line .lck-color-title {
    color: var(--primary-color)
  }

  /* Flex (2/n columns) */
  @media (min-width: 900px) {
    .lck-layout-flex .lck-page-content .editable-container-parent {
      height: calc(100% - 12rem);
      max-height: calc(100% - 12rem);
    }
    .lck-layout-flex .lck-container .edit-container-line {
      align-self: flex-start;
      width: 100%;
    }
  }

  /* Full */
  @media (min-width: 900px) {
    .lck-layout-full .lck-page-content .editable-container-parent {
      height: calc(100% - 12rem);
      min-height: unset;
      max-height: calc(100% - 12rem);
      overflow: auto;
    }
  }

  /**
  * Button for creating a new block or a new container
  */
  .page-new-button {
    padding: var(--spacing);
    width: 100%;
    min-height: 10rem;
    width: 100%;
    border-radius: var(--border-radius);
    border: dashed 2px var(--secondary-color-light);
    cursor: pointer;
    background-color: transparent;
    color: var(--primary-color);
  }

  .page-new-button-icon {
    font-size: 2rem;
    display: block;
    margin-bottom: 1rem;
  }

  .page-new-button:hover {
    border-color: var(--primary-color);
    background-color: var(--primary-color-lighten);
  }

  .page-new-button:focus {
    outline: none;
    background-color: var(--primary-color-lighten);
  }

  .page-new-button:focus.p-button {
    background-color: var(--primary-color-dark);
  }
}
</style>
