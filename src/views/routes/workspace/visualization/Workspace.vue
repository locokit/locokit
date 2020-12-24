<template>
  <div class="p-grid h-full" v-if="workspaceContent">
    <div class="sidebar-menu-container lck-bg-primary o-auto h-max-full">
      <lck-sidebar
        :items="sidebarItems"
        :displayEditActions="editMode"
        :editableItems="editableChapters"
        :isAdmin="isAdmin"
        :createItemLabel="$t('pages.workspace.createChapter')"
        @add-item="dialogVisibility.chapterEdit = true;"
        @edit-item="onChapterEditClick"
        @delete-item="onChapterDeleteClick"
        @add-subitem="onPageEditClick"
        @edit-subitem="onPageEditClick"
        @delete-subitem="onPageDeleteClick"
        v-on="$listeners"
      />
    </div>
    <div class="main-container h-full p-col o-auto h-max-full">
      <router-view />
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
        :value="currentChapterToEdit"
        @close="onChapterEditReset"
        @input="onChapterEditInput"
      />
      <lck-confirmation-dialog
        :visible="dialogVisibility.chapterDelete"
        :value="currentChapterToEdit"
        :itemCategory="$t('pages.workspace.chapter')"
        @close="onChapterDeleteReset"
        @input="onChapterDeleteInput"
      />
      <lck-page-dialog
        :visible="dialogVisibility.pageEdit"
        :value="currentPageToEdit"
        @close="onPageEditReset"
        @input="onPageEditInput"
      />
      <lck-confirmation-dialog
        :visible="dialogVisibility.pageDelete"
        :value="currentPageToEdit"
        :itemCategory="$t('pages.workspace.page')"
        @close="onPageDeleteReset"
        @input="onPageDeleteInput"
      />
    </div>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/camelcase */

import Vue from 'vue'
import { authState } from '@/store/auth'
import { USER_PROFILE, WORKSPACE_ROLE } from '@locokit/lck-glossary'

import ToggleButton from 'primevue/togglebutton'

import { lckServices } from '@/services/lck-api'
import { objectIsEmpty } from '@/services/lck-utils/object'
import { retrieveWorkspaceWithChaptersAndPages } from '@/store/visualize'
import DeleteConfirmationDialog from '@/components/ui/DeleteConfirmationDialog/DeleteConfirmationDialog.vue'
import Sidebar from '@/components/visualize/Sidebar/Sidebar'
import ChapterDialog from '@/components/visualize/Chapter/Chapter'
import PageDialog from '@/components/visualize/Page/Page'
import { ROUTES_PATH } from '@/router/paths'

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
      workspaceContent: [],
      editMode: false,
      dialogVisibility: {
        chapterEdit: false,
        chapterDelete: false,
        pageEdit: false,
        pageDelete: false
      },
      currentChapterToEdit: {},
      currentPageToEdit: {}
    }
  },
  computed: {
    sidebarItems () {
      if (!this.workspaceContent?.chapters) return []
      return this.workspaceContent.chapters.map(({ id, text, pages = [] }) => {
        const subitems = pages.map(({ text, id }) => (
          {
            id,
            label: text,
            to: `${ROUTES_PATH.WORKSPACE}/${this.$route.params.workspaceId}${ROUTES_PATH.VISUALIZATION}/page/${id}`,
            active: id === this.$route.params.pageId
          }
        ))
        return (
          {
            id,
            label: text,
            subitems,
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
        authState.data.user.groups.forEach(({ chapter_id, workspace_role }) => {
          if ([WORKSPACE_ROLE.ADMIN, WORKSPACE_ROLE.OWNER].includes(workspace_role)) {
            editableChapters[chapter_id] = true
          }
        })
      }
      return editableChapters
    },
    canEditWorkspace () {
      return this.isAdmin || !objectIsEmpty(this.editableChapters)
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
    onChapterEditClick (data) {
      this.currentChapterToEdit = this.workspaceContent.chapters.find(c => c.id === data)
      this.dialogVisibility.chapterEdit = true
    },
    onChapterDeleteClick (data) {
      this.currentChapterToEdit = this.workspaceContent.chapters.find(c => c.id === data)
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
      if (data.item && data.subitem) {
        this.currentChapterToEdit = this.workspaceContent.chapters.find(c => c.id === data.item)
        this.currentPageToEdit = this.currentChapterToEdit.pages.find(p => p.id === data.subitem)
        this.dialogVisibility.pageDelete = true
      }
    },
    onPageEditReset () {
      this.currentPageToEdit = {}
      this.dialogVisibility.pageEdit = false
    },
    onPageDeleteReset () {
      this.currentPageToEdit = {}
      this.dialogVisibility.pageDelete = false
    },
    async onChapterEditInput (event) {
      try {
        if (event.id) {
          // On update
          const updatedChapter = await lckServices.chapter.patch(event.id, {
            text: event.text
          })
          for (const key in updatedChapter) {
            this.currentChapterToEdit[key] = updatedChapter[key]
          }
        } else {
          // On create
          const newChapter = await lckServices.chapter.create({
            text: event.text,
            workspace_id: this.workspaceId
          })
          this.workspaceContent.chapters.push(newChapter)
        }
        this.onChapterEditReset()
      } catch (error) {
        this.displayToastOnError(error)
      }
    },
    async onChapterDeleteInput (chapter) {
      try {
        if (chapter.id) {
          await lckServices.chapter.remove(chapter.id)
        }
        const chapterIndex = this.workspaceContent.chapters.findIndex(c => c.id === chapter.id)
        if (chapterIndex >= 0) this.workspaceContent.chapters.splice(chapterIndex, 1)
        this.onChapterDeleteReset()
      } catch (error) {
        this.displayToastOnError(error)
      }
    },
    async onPageEditInput (event) {
      try {
        if (event.id) {
          // On update
          const updatedPage = await lckServices.page.patch(event.id, {
            text: event.text,
            position: event.position,
            hidden: event.hidden
          })
          for (const key in updatedPage) {
            this.currentPageToEdit[key] = updatedPage[key]
          }
        } else {
          // On create
          const newPage = await lckServices.page.create({
            text: event.text,
            position: event.position,
            chapter_id: this.currentChapterToEdit.id
          })
          if (Array.isArray(this.currentChapterToEdit.pages)) {
            this.currentChapterToEdit.pages.push(newPage)
          } else {
            this.currentChapterToEdit.pages = [newPage]
          }
        }
        this.onPageEditReset()
      } catch (error) {
        this.displayToastOnError(error)
      }
    },
    async onPageDeleteInput (event) {
      try {
        if (event.id) {
          await lckServices.page.remove(event.id)
        }
        const pageIndex = this.currentChapterToEdit.pages.findIndex(p => p.id === event.id)
        if (pageIndex >= 0) this.currentChapterToEdit.pages.splice(pageIndex, 1)
        this.onPageDeleteReset()
      } catch (error) {
        this.displayToastOnError(error)
      }
    },
    displayToastOnError (error) {
      this.$toast.add({
        severity: 'error',
        summary: this.$t('error.http.' + error.code),
        detail: error.message,
        life: 3000
      })
    }
  },
  async mounted () {
    this.workspaceContent = await retrieveWorkspaceWithChaptersAndPages(this.workspaceId)
    await this.goToFirstPage()
  },
  async updated () {
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
/deep/ .lck-edit-button {
  position: fixed;
  bottom: 1em;
  right: 1em;
  z-index: 2;
}
</style>
