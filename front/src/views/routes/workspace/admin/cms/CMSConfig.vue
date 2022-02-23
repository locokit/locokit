<template>
  <div
    class="lck-layout-content"
    v-if="workspaceContent"
  >
    <div
      class="lck-sidebar"
      :class="{'lck-sidebar--active': sidebarActive}"
    >
      <h2 class="p-pl-3 lck-color-title">
        {{ $t('pages.cms.title') }}
      </h2>

      <lck-sidebar
        :items="sidebarItems"
        :displayEditActions="editMode"
        :createItemLabel="$t('pages.workspace.createChapter')"
        :createSubItemLabel="$t('pages.workspace.page.create')"
        @add-item="onChapterEditClick"
        @edit-item="onChapterEditClick"
        @add-subitem="onPageEditClick"
        @edit-subitem="onPageEditClick"
        @reorder-subitem="onPageReorderClick"
        v-on="$listeners"
        @confirm-delete-chapter="onConfirmationDeleteChapter($event)"
        @confirm-delete-page="onConfirmationDeletePage($event)"
      />
    </div>
    <div class="lck-page">
      <router-view
        :key="forceUpdateKey"
        :editMode="editMode"
        :sidebarItems="sidebarItems"
        :chapters="Array.isArray(workspaceContent.chapters) ? workspaceContent.chapters : []"
        :workspaceId="workspaceId"
      />
      <p-toggle-button
        v-if="isAdmin"
        v-model="editMode"
        :onLabel="$t('pages.workspace.editMode')"
        :offLabel="$t('pages.workspace.editMode')"
        onIcon="pi pi-pencil"
        offIcon="pi pi-pencil"
        class="p-button-rounded lck-edit-button"
      />
      <lck-chapter-dialog
        :visible="dialogVisibility.chapterEdit"
        :chapter="currentChapterToEdit"
        :submitting="submitting"
        @close="onChapterEditReset"
        @input="onChapterEditInput"
      />
      <lck-page-dialog
        :visible="dialogVisibility.pageEdit"
        :page="currentPageToEdit"
        :submitting="submitting"
        @close="onPageEditReset"
        @input="onPageEditInput"
      />
    </div>
    <p-confirm-dialog />
  </div>
</template>

<script>
import Vue from 'vue'

import { USER_PROFILE } from '@locokit/lck-glossary/src'

import { authState } from '@/store/auth'
import { ROUTES_PATH, ROUTES_NAMES } from '@/router/paths'
import { lckHelpers, lckServices } from '@/services/lck-api'

import ConfirmDialog from 'primevue/confirmdialog'
import ToggleButton from 'primevue/togglebutton'

import Sidebar from '@/components/visualize/Sidebar/Sidebar.vue'
import ChapterDialog from '@/components/visualize/ChapterDialog/ChapterDialog.vue'
import PageDialog from '@/components/visualize/PageDialog/PageDialog.vue'

export default {
  name: 'CMSConfig',
  components: {
    'lck-sidebar': Sidebar,
    'lck-chapter-dialog': ChapterDialog,
    'lck-page-dialog': PageDialog,
    'p-confirm-dialog': Vue.extend(ConfirmDialog),
    'p-toggle-button': Vue.extend(ToggleButton),
  },
  props: {
    workspaceId: {
      type: String,
      required: true,
    },
    sidebarActive: {
      type: Boolean,
      required: true,
    },
  },
  data () {
    return {
      currentChapterToEdit: {},
      currentPageToEdit: {},
      editMode: false,
      dialogVisibility: {
        chapterEdit: false,
        pageEdit: false,
      },
      forceUpdateKey: true,
      submitting: false,
      workspaceContent: null,
    }
  },
  computed: {
    sidebarItems () {
      if (!this.workspaceContent?.chapters) return []
      return this.workspaceContent.chapters.map(({ id, text, pages = [] }) => {
        const subitems = pages.map(({ text, id, hidden }) => (
          {
            id,
            label: text,
            to: `${ROUTES_PATH.WORKSPACE}/${this.workspaceId}${ROUTES_PATH.ADMIN}${ROUTES_PATH.CMS}/page/${id}`,
            hidden,
          }
        ))
        return (
          {
            id,
            label: text,
            subitems,
          }
        )
      })
    },
    isAdmin () {
      return [USER_PROFILE.ADMIN, USER_PROFILE.SUPERADMIN].includes(authState.data.user?.profile)
    },
  },
  methods: {
    async goToSpecificPage (pageId) {
      await this.$router.push({
        name: ROUTES_NAMES.WORKSPACE_ADMIN.CMS_PAGE,
        params: {
          workspaceId: this.workspaceId,
          pageId,
        },
      }).catch(error => {
        if (error.from.path !== error.to.path) throw error
        else this.forceUpdateKey = !this.forceUpdateKey
      })
    },
    async goToDefaultRoute () {
      await this.$router.push({
        name: ROUTES_NAMES.WORKSPACE_ADMIN.CMS,
        params: { workspaceId: this.workspaceId },
      }).catch(error => {
        if (error.from.path !== error.to.path) throw error
      })
    },
    onChapterEditClick (chapterId) {
      if (chapterId) {
        this.currentChapterToEdit = this.workspaceContent.chapters.find(c => c.id === chapterId)
      }
      this.dialogVisibility.chapterEdit = true
    },
    onChapterEditReset () {
      this.currentChapterToEdit = {}
      this.dialogVisibility.chapterEdit = false
    },
    async onChapterEditInput (chapterText) {
      try {
        this.submitting = true
        if (this.currentChapterToEdit.id) {
          // On update
          const updatedChapter = await lckServices.chapter.patch(this.currentChapterToEdit.id, {
            text: chapterText,
          })
          for (const key in updatedChapter) {
            this.currentChapterToEdit[key] = updatedChapter[key]
          }
        } else {
          // On create
          const newChapter = await lckServices.chapter.create({
            text: chapterText,
            workspace_id: this.workspaceId, // eslint-disable-line @typescript-eslint/camelcase
          })
          this.workspaceContent.chapters.push(newChapter)
        }
        this.onChapterEditReset()
      } catch (error) {
        this.displayToastOnError(`${this.$t('pages.workspace.chapter')} ${this.currentChapterToEdit.text}`, error)
      } finally {
        this.submitting = false
      }
    },
    onConfirmationDeleteChapter ({ chapterId, chapterName }) {
      this.$confirm.require({
        message: `${this.$t('form.specificDeleteConfirmation')} ${chapterName}`,
        header: this.$t('form.confirmation'),
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          try {
            await lckServices.chapter.remove(chapterId)
            const chapterIndex = this.workspaceContent.chapters.findIndex(chapter => chapterId === chapter.id)
            if (chapterIndex >= 0) this.workspaceContent.chapters.splice(chapterIndex, 1)
            this.$toast.add({
              severity: 'success',
              summary: this.$t('components.processPanel.SUCCESS'),
              detail: this.$t('success.removed'),
              life: 5000,
            })
          } catch (error) {
            this.$toast.add({
              severity: 'error',
              summary: this.$t('components.processPanel.ERROR'),
              detail: this.$t('components.processPanel.failedNewRun'),
              life: 5000,
            })
          }
        },
      })
    },
    onPageEditClick (data) {
      if (data.item) {
        this.currentChapterToEdit = this.workspaceContent.chapters.find(c => c.id === data.item)
        if (data.subitem) {
          this.currentPageToEdit = this.currentChapterToEdit.pages.find(p => p.id === data.subitem)
        }
        this.dialogVisibility.pageEdit = true
      }
    },
    onPageEditReset () {
      this.currentPageToEdit = {}
      this.currentChapterToEdit = {}
      this.dialogVisibility.pageEdit = false
    },
    async onPageEditInput ({ text, hidden, layout } = {}) {
      try {
        this.submitting = true
        if (this.currentPageToEdit.id) {
          // On update
          const updatedPage = await lckServices.page.patch(this.currentPageToEdit.id, {
            text,
            hidden,
            layout,
          })
          for (const key in updatedPage) {
            this.currentPageToEdit[key] = updatedPage[key]
          }
        } else {
          // On create
          this.currentPageToEdit = await lckServices.page.create({
            text,
            hidden,
            chapter_id: this.currentChapterToEdit.id, // eslint-disable-line @typescript-eslint/camelcase
            layout,
          })
          if (Array.isArray(this.currentChapterToEdit.pages)) {
            this.currentChapterToEdit.pages.push(this.currentPageToEdit)
          } else {
            this.$set(this.currentChapterToEdit, 'pages', [this.currentPageToEdit])
          }
        }
        await this.goToSpecificPage(this.currentPageToEdit.id)
        this.onPageEditReset()
      } catch (error) {
        this.displayToastOnError(`${this.$t('pages.workspace.page')} ${this.currentPageToEdit.text}`, error)
      } finally {
        this.submitting = false
      }
    },
    onConfirmationDeletePage ({ chapterId, pageId, pageName }) {
      this.$confirm.require({
        message: `${this.$t('form.specificDeleteConfirmation')} ${pageName}`,
        header: this.$t('form.confirmation'),
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          try {
            await lckServices.page.remove(pageId)
            this.workspaceContent.chapters = this.workspaceContent?.chapters.map(chapter => {
              if (chapter.id === chapterId) {
                chapter.pages = chapter.pages.filter(({ id }) => id !== pageId)
              }
              return chapter
            })
            if (this.$route.params.pageId === pageId) await this.goToDefaultRoute()

            this.$toast.add({
              severity: 'success',
              summary: this.$t('components.processPanel.SUCCESS'),
              detail: this.$t('success.removed'),
              life: 5000,
            })
          } catch (error) {
            this.$toast.add({
              severity: 'error',
              summary: this.$t('components.processPanel.ERROR'),
              detail: this.$t('components.processPanel.failedNewRun'),
              life: 5000,
            })
          }
        },
      })
    },
    async onPageReorderClick (chapterId, { moved }) {
      if (chapterId && moved) {
        this.currentChapterToEdit = this.workspaceContent.chapters.find(c => c.id === chapterId)

        // first, update the dragged page
        let currentPage = this.currentChapterToEdit.pages[moved.oldIndex]
        currentPage.position = moved.newIndex
        const updatedPagesPromises = [lckServices.page.patch(currentPage.id, { position: currentPage.position })]

        if (moved.oldIndex > moved.newIndex) {
          // if the oldIndex is after the newIndex, we need to update all pages from the newIndex to the oldIndex (excluded)
          for (let index = moved.newIndex; index < moved.oldIndex; index++) {
            currentPage = this.currentChapterToEdit.pages[index]
            currentPage.position = index + 1
            updatedPagesPromises.push(lckServices.page.patch(currentPage.id, {
              position: currentPage.position,
            }))
          }
        } else {
          // if not, we need to update all pages from the oldIndex (excluded) to the newIndex
          for (let index = moved.oldIndex + 1; index <= moved.newIndex; index++) {
            currentPage = this.currentChapterToEdit.pages[index]
            currentPage.position = index - 1
            updatedPagesPromises.push(lckServices.page.patch(currentPage.id, {
              position: currentPage.position,
            }))
          }
        }
        this.currentChapterToEdit.pages.sort((p1, p2) => p1.position - p2.position)
        await Promise.all(updatedPagesPromises)
          .catch(error => {
            this.displayToastOnError(`${this.$t('pages.workspace.chapter')} ${this.currentChapterToEdit.text}`, error)
          })
          .finally(() => {
            this.currentChapterToEdit = {}
          })
      }
    },
    displayToastOnError (summary, error) {
      this.$toast.add({
        severity: 'error',
        summary,
        detail: error.code ? this.$t('error.http.' + error.code) : this.$t('error.basic'),
        life: 5000,
      })
    },
  },
  async mounted () {
    this.workspaceContent = await lckHelpers.retrieveWorkspaceWithChaptersAndPages(this.workspaceId)
  },
}
</script>

<style>
.p-grid .main-container .responsive-table-wrapper {
  background: rgb(237, 237, 237) !important;
  background: linear-gradient(
    180deg,
    rgba(237, 237, 237, 1) 2.5rem,
    rgba(255, 255, 255, 1) 2.3rem,
    rgba(255, 255, 255, 1) 100%
  ) !important;
}
</style>

<style scoped>
.lck-edit-button {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 15;
}
</style>
