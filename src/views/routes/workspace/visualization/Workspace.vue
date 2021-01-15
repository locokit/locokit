<template>
  <div class="p-grid h-full" v-if="workspaceContent">
    <div class="sidebar-menu-container lck-bg-primary o-auto h-max-full">
      <lck-sidebar
        :items="sidebarItems"
        :displayEditActions="editMode"
        :isAdmin="isAdmin"
        :createItemLabel="$t('pages.workspace.createChapter')"
        :createSubItemLabel="$t('pages.workspace.createPage')"
        @add-item="onChapterEditClick"
        @edit-item="onChapterEditClick"
        @delete-item="onChapterDeleteClick"
        @add-subitem="onPageEditClick"
        @edit-subitem="onPageEditClick"
        @delete-subitem="onPageDeleteClick"
        @reorder-subitem="onPageReorderClick"
        v-on="$listeners"
      />
    </div>
    <div class="main-container h-full p-col o-auto h-max-full">
      <router-view :key="forceUpdateKey" />
      <p-toggle-button
        v-if="canEditWorkspace"
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
      <lck-confirmation-dialog
        :visible="dialogVisibility.chapterDelete"
        :value="currentChapterToEdit"
        :itemCategory="$t('pages.workspace.chapter')"
        :submitting="submitting"
        @close="onChapterDeleteReset"
        @input="onChapterDeleteInput"
      />
      <lck-page-dialog
        :visible="dialogVisibility.pageEdit"
        :page="currentPageToEdit"
        :submitting="submitting"
        @close="onPageEditReset"
        @input="onPageEditInput"
      />
      <lck-confirmation-dialog
        :visible="dialogVisibility.pageDelete"
        :value="currentPageToEdit"
        :itemCategory="$t('pages.workspace.page')"
        :submitting="submitting"
        @close="onPageDeleteReset"
        @input="onPageDeleteInput"
      />
    </div>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/camelcase */

import Vue from 'vue'
import isEmpty from 'lodash.isempty'
import { authState } from '@/store/auth'
import { USER_PROFILE, WORKSPACE_ROLE } from '@locokit/lck-glossary'

import ToggleButton from 'primevue/togglebutton'

import { lckServices } from '@/services/lck-api'
import { retrieveWorkspaceWithChaptersAndPages } from '@/store/visualize'
import DeleteConfirmationDialog from '@/components/ui/DeleteConfirmationDialog/DeleteConfirmationDialog.vue'
import Sidebar from '@/components/visualize/Sidebar/Sidebar'
import ChapterDialog from '@/components/visualize/Chapter/Chapter'
import PageDialog from '@/components/visualize/Page/Page'
import { ROUTES_PATH, ROUTES_NAMES } from '@/router/paths'

export default {
  name: 'Workspace',
  components: {
    'lck-sidebar': Sidebar,
    'lck-chapter-dialog': ChapterDialog,
    'lck-page-dialog': PageDialog,
    'lck-confirmation-dialog': DeleteConfirmationDialog,
    'p-toggle-button': Vue.extend(ToggleButton)
  },
  props: ['workspaceId'],
  data () {
    return {
      currentChapterToEdit: {},
      currentPageToEdit: {},
      editMode: false,
      dialogVisibility: {
        chapterEdit: false,
        chapterDelete: false,
        pageEdit: false,
        pageDelete: false
      },
      forceUpdateKey: true,
      submitting: false,
      workspaceContent: []
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
            to: `${ROUTES_PATH.WORKSPACE}/${this.$route.params.workspaceId}${ROUTES_PATH.VISUALIZATION}/page/${id}`,
            hidden: hidden === true,
            active: id === this.$route.params.pageId
          }
        ))
        return (
          {
            id,
            label: text,
            subitems,
            editable: this.isAdmin || this.editableChapters[id] === true,
            active: subitems.some(({ active }) => active)
          }
        )
      })
    },
    isAdmin () {
      return [USER_PROFILE.ADMIN, USER_PROFILE.SUPERADMIN].includes(authState.data.user?.profile)
    },
    editableChapters () {
      const editableChapters = {}
      if (authState.data.user?.groups) {
        authState.data.user.groups.forEach(({ chapter_id, workspace_role, workspace_id }) => {
          if (this.workspaceId === workspace_id && [WORKSPACE_ROLE.ADMIN, WORKSPACE_ROLE.OWNER].includes(workspace_role)) {
            editableChapters[chapter_id] = true
          }
        })
      }
      return editableChapters
    },
    canEditWorkspace () {
      return this.isAdmin || !isEmpty(this.editableChapters)
    }
  },
  methods: {
    async goToFirstPage () {
      if (
        !this.$route.path.includes('page') &&
        this.workspaceContent.chapters.length > 0 &&
        this.workspaceContent.chapters[0].pages.length > 0
      ) {
        await this.$router.replace(`${ROUTES_PATH.WORKSPACE}/${this.workspaceId}${ROUTES_PATH.VISUALIZATION}/page/${this.workspaceContent.chapters[0].pages[0].id}`)
      }
    },
    async goToSpecificPage (pageId) {
      await this.$router.replace(
        { name: ROUTES_NAMES.PAGE, params: { workspaceId: this.workspaceId, pageId: pageId } })
        .catch(error => {
          if (error.from.path !== error.to.path) throw error
          else this.forceUpdateKey = !this.forceUpdateKey
        })
    },
    async goToDefaultRoute () {
      await this.$router.replace({ name: ROUTES_NAMES.VISUALIZATION, params: { workspaceId: this.workspaceId } })
        .catch(error => {
          if (error.from.path !== error.to.path) throw error
        })
    },
    onChapterEditClick (chapterId) {
      if (chapterId) {
        this.currentChapterToEdit = this.workspaceContent.chapters.find(c => c.id === chapterId)
      }
      this.dialogVisibility.chapterEdit = true
    },
    onChapterDeleteClick (chapterId) {
      this.currentChapterToEdit = this.workspaceContent.chapters.find(c => c.id === chapterId)
      this.dialogVisibility.chapterDelete = true
    },
    onChapterEditReset () {
      this.currentChapterToEdit = {}
      this.dialogVisibility.chapterEdit = false
    },
    onChapterDeleteReset () {
      this.currentChapterToEdit = {}
      this.dialogVisibility.chapterDelete = false
    },
    async onChapterEditInput (chapter = {}) {
      try {
        this.submitting = true
        if (chapter.id) {
          // On update
          const updatedChapter = await lckServices.chapter.patch(chapter.id, {
            text: chapter.text
          })
          for (const key in updatedChapter) {
            this.currentChapterToEdit[key] = updatedChapter[key]
          }
        } else {
          // On create
          const newChapter = await lckServices.chapter.create({
            text: chapter.text,
            workspace_id: this.workspaceId
          })
          this.workspaceContent.chapters.push(newChapter)
        }
        this.onChapterEditReset()
      } catch (error) {
        this.displayToastOnError(`${this.$t('pages.workspace.chapter')} ${chapter.text}`, error)
      } finally {
        this.submitting = false
      }
    },
    async onChapterDeleteInput (chapter = {}) {
      try {
        this.submitting = true
        if (chapter.id) {
          await lckServices.chapter.remove(chapter.id)
          const chapterIndex = this.workspaceContent.chapters.findIndex(c => c.id === chapter.id)
          if (chapterIndex >= 0) this.workspaceContent.chapters.splice(chapterIndex, 1)
        }
        this.onChapterDeleteReset()
      } catch (error) {
        this.displayToastOnError(`${this.$t('pages.workspace.chapter')} ${chapter.text}`, error)
      } finally {
        this.submitting = false
      }
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
    onPageDeleteClick (data) {
      if (data?.item && data.subitem) {
        this.currentChapterToEdit = this.workspaceContent.chapters.find(c => c.id === data.item)
        this.currentPageToEdit = this.currentChapterToEdit.pages.find(p => p.id === data.subitem)
        this.dialogVisibility.pageDelete = true
      }
    },
    onPageEditReset () {
      this.currentPageToEdit = {}
      this.currentChapterToEdit = {}
      this.dialogVisibility.pageEdit = false
    },
    onPageDeleteReset () {
      this.currentPageToEdit = {}
      this.currentChapterToEdit = {}
      this.dialogVisibility.pageDelete = false
    },
    async onPageEditInput (page = {}) {
      try {
        this.submitting = true
        if (page.id) {
          // On update
          const updatedPage = await lckServices.page.patch(page.id, {
            text: page.text,
            hidden: page.hidden
          })
          for (const key in updatedPage) {
            this.currentPageToEdit[key] = updatedPage[key]
          }
        } else {
          // On create
          this.currentPageToEdit = await lckServices.page.create({
            text: page.text,
            hidden: page.hidden,
            chapter_id: this.currentChapterToEdit.id
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
        this.displayToastOnError(`${this.$t('pages.workspace.page')} ${page.text}`, error)
      } finally {
        this.submitting = false
      }
    },
    async onPageDeleteInput (page = {}) {
      try {
        this.submitting = true
        if (page.id) {
          await lckServices.page.remove(page.id)
          const pageIndex = this.currentChapterToEdit.pages.findIndex(p => p.id === page.id)
          if (pageIndex >= 0) this.currentChapterToEdit.pages.splice(pageIndex, 1)
          if (this.$route.params.pageId === page.id) await this.goToDefaultRoute()
        }
        this.onPageDeleteReset()
      } catch (error) {
        this.displayToastOnError(`${this.$t('pages.workspace.page')} ${page.text}`, error)
      } finally {
        this.submitting = false
      }
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
              position: currentPage.position
            }))
          }
        } else {
          // if not, we need to update all pages from the oldIndex (excluded) to the newIndex
          for (let index = moved.oldIndex + 1; index <= moved.newIndex; index++) {
            currentPage = this.currentChapterToEdit.pages[index]
            currentPage.position = index - 1
            updatedPagesPromises.push(lckServices.page.patch(currentPage.id, {
              position: currentPage.position
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
        life: 3000
      })
    }
  },
  async mounted () {
    this.workspaceContent = await retrieveWorkspaceWithChaptersAndPages(this.workspaceId)
    await this.goToFirstPage()
  }
}
</script>

<style>
.p-grid .main-container .responsive-table-wrapper {
  background: rgb(237,237,237) !important;
  background: linear-gradient(180deg, rgba(237,237,237,1) 2.5rem, rgba(255,255,255,1) 2.3rem, rgba(255,255,255,1) 100%) !important;
}

</style>

<style scoped>
.lck-edit-button {
  position: fixed;
  bottom: 1em;
  right: 1em;
  z-index: 2;
}
</style>
