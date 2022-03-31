<template>
    <div class="lck-page">
      <p-card class="p-col-12 p-md-8 p-mt-2 p-mx-auto">
        <template #title>
          {{ $t('pages.workspaceAdmin.files.title') }}
        </template>
        <template #content>
          <p-datatable
            :value="attachments"
            :paginator="true"
            :rows="limit"
            :lazy="true"
            :loading="loading"
            :totalRecords="total"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
            :currentPageReportTemplate="          $t('components.paginator.currentPageReportTemplate')"
            :rowsPerPageOptions="[10,20,50]"
            :resizableColumns="true"
            @page="onPage($event)"
            @sort="onSort($event)"
          >
            <template #header>
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <p-inputtext
                  v-model="filterName"
                  placeholder="Keyword Search"
                  @keyup.enter="fetchAttachments"
                />
              </span>
            </template>

            <p-column
              field="filename"
              header="Name"
              sortable
              headerStyle="width: 10rem; max-width: 25rem;"
            >
              <template #body="slotProps">
                <lck-async-image
                  v-if="slotProps.data.element === 'img'"
                  :key="slotProps.data.id"
                  class="cell-file"
                  :title="slotProps.data.filename"
                  :src="slotProps.data.thumbnailURL"
                />
                <span
                  v-else
                  :key="slotProps.data.id"
                  class="cell-file"
                  :class="slotProps.data.class"
                  :title="slotProps.data.filename"
                />
                {{ slotProps.data.filename }}
              </template>
            </p-column>
            <p-column
              field="displaySize"
              header="Size"
              headerStyle="width: 5rem;"
              sortable
              sortField="size"
            >
              <template #body="slotProps">
                {{ slotProps.data.displaySize }} Ko
              </template>
            </p-column>
            <p-column
              field="createdAt"
              header="Created"
              headerStyle="width: 8rem"
              sortable
            />
            <p-column
              field="updatedAt"
              header="Updated"
              headerStyle="width: 8rem"
              sortable
            />
            <p-column
              headerStyle="width: 7rem"
            >
              <template #body="slotProps">
                <p-button
                  @click="downloadAttachment(
                    slotProps.data.url,
                    slotProps.data.filename,
                    slotProps.data.mime
                  )"
                  class="p-mr-1"
                  icon="bi bi-download"
                />
                <p-button
                  @click="removeAttachment(slotProps.data)"
                  class="p-button-danger"
                  icon="bi bi-trash"
                />
              </template>
            </p-column>
          </p-datatable>

        </template>
      </p-card>

      <p-confirmdialog />
    </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Vue, { PropOptions } from 'vue'

import { lckServices, lckHelpers } from '@/services/lck-api'
import { LckAttachment } from '@/services/lck-api/definitions'
import { getAttachmentsToDisplay } from '@/components/ui/ColumnType/File/helpers'
import LckAsyncImage from '@/components/ui/AsyncImage/AsyncImage.vue'

import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import ConfirmDialog from 'primevue/confirmdialog'

import { Paginated } from '@feathersjs/feathers'

export default Vue.extend({
  name: 'WorkspaceFiles',
  components: {
    'p-card': Vue.extend(Card),
    'p-datatable': Vue.extend(DataTable),
    'p-column': Vue.extend(Column),
    'p-button': Vue.extend(Button),
    'p-inputtext': Vue.extend(InputText),
    'p-confirmdialog': Vue.extend(ConfirmDialog),
    LckAsyncImage,
  },
  props: {
    workspaceId: {
      type: String,
      required: true,
    } as PropOptions<string>,
  },
  data () {
    return {
      loading: false,
      attachments: [],
      limit: 10,
      page: 0,
      total: 0,
      filterName: '',
      sortField: 'filename',
      sortOrder: 1,
    } as {
      loading: boolean;
      attachments: LckAttachment[];
      limit: 10 | 20 | 50;
      page: number;
      total: number;
      filterName: string;
      sortField: string;
      sortOrder: number;
    }
  },
  async mounted () {
    await this.fetchAttachments()
  },
  methods: {
    /**
     * Fetch the workspace.
     */
    async fetchAttachments () {
      this.loading = true
      try {
        const queryParams = {
          query: {
            workspace_id: this.workspaceId,
            $skip: this.page * this.limit,
            $limit: this.limit,
            $sort: { [this.sortField]: this.sortOrder },
          },
        }
        if (this.filterName) queryParams.query.filename = { $ilike: `%${this.filterName}%` }
        const result = await lckServices.attachment.find(queryParams) as Paginated<LckAttachment>
        this.total = result.total
        this.attachments = getAttachmentsToDisplay(result.data, this.workspaceId)
      } catch (error) {
        this.displayToastOnError(error)
      }
      this.loading = false
    },
    async onPage (event: {page: number }) {
      this.page = event.page
      this.fetchAttachments()
    },
    async onSort (event: { sortField: string; sortOrder: number }) {
      this.sortField = event.sortField
      this.sortOrder = event.sortOrder
      this.fetchAttachments()
    },
    /**
     * Display an error toast whose the content is based on the error code.
     */
    displayToastOnError (error: Error & { code: number }) {
      this.$toast.add({
        severity: 'error',
        summary: this.$t('error.basic'),
        detail: this.$t('error.http.' + error.code),
        life: 5000,
      })
    },

    downloadAttachment: lckHelpers.downloadAttachment,

    removeAttachment (attachment: LckAttachment) {
      console.log('coucou')
      this.$confirm.require({
        message: this.$t('pages.workspaceAdmin.files.removeConfirmationDialog.message', { file: attachment.filename }),
        header: this.$t('pages.workspaceAdmin.files.removeConfirmationDialog.header'),
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          try {
            await lckServices.attachment.remove(attachment.id)
            this.$toast.add({
              severity: 'success',
              summary: this.$t('pages.workspaceAdmin.files.removeSuccessToast.summary', { file: attachment.filename }),
              life: 3000,
            })
            this.fetchAttachments()
          } catch (error) {
            this.$toast.add({
              severity: 'error',
              summary: this.$t('pages.workspaceAdmin.files.removeErrorToast.summary', { file: attachment.filename }),
              detail: this.$t('pages.workspaceAdmin.files.removeErrorToast.detail', { error }),
            })
          }
        },
        reject: () => {
          this.$confirm.close()
        },
      })
    },
  },
})
</script>

<style>
.p-confirm-dialog.p-dialog {
  max-width: 30rem;
}
</style>
