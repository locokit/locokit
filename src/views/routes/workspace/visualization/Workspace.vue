<template>
  <div class="p-grid h-full" v-if="workspaceContent">
    <div class="sidebar-menu-container lck-bg-primary o-auto h-max-full">
      <lck-sidebar
        :items="sidebarItems"
        :displayEditActions="editMode"
        :isAdmin="isAdmin"
        :createItemLabel="$t('pages.workspace.createChapter')"
        @add-item="onChapterEditClick"
        @edit-item="onChapterEditClick"
        @delete-item="onChapterDeleteClick"
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
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import isEmpty from 'lodash.isempty'
import { authState } from '@/store/auth'
import { USER_PROFILE, WORKSPACE_ROLE } from '@locokit/lck-glossary'

import ToggleButton from 'primevue/togglebutton'

import { lckServices } from '@/services/lck-api'
import { retrieveWorkspaceWithChaptersAndPages } from '@/store/visualize'
import DeleteConfirmationDialog from '@/components/ui/DeleteConfirmationDialog/DeleteConfirmationDialog.vue'
import Sidebar from '@/components/visualize/Sidebar/Sidebar'
import ChapterDialog from '@/components/visualize/ChapterDialog/ChapterDialog.vue'
import { ROUTES_PATH } from '@/router/paths'

export default {
  name: 'Workspace',
  components: {
    'lck-sidebar': Sidebar,
    'lck-chapter-dialog': ChapterDialog,
    'lck-confirmation-dialog': DeleteConfirmationDialog,
    'p-toggle-button': Vue.extend(ToggleButton)
  },
  props: ['workspaceId'],
  data () {
    return {
      currentChapterToEdit: {},
      editMode: false,
      dialogVisibility: {
        chapterEdit: false,
        chapterDelete: false
      },
      submitting: false,
      workspaceContent: []
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
      /* eslint-disable @typescript-eslint/camelcase */
      const editableChapters = {}
      if (authState.data.user?.groups) {
        authState.data.user.groups.forEach(({ chapter_id, workspace_role, workspace_id }) => {
          if (this.workspaceId === workspace_id && [WORKSPACE_ROLE.ADMIN, WORKSPACE_ROLE.OWNER].includes(workspace_role)) {
            editableChapters[chapter_id] = true
          }
        })
      /* eslint-enable @typescript-eslint/camelcase */
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
            workspace_id: this.workspaceId // eslint-disable-line @typescript-eslint/camelcase
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
