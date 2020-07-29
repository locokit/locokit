<template>
  <prime-panel-menu
    class="h-full"
    :model="formatedChapters"
  />
</template>

<script>
import Vue from 'vue'
import { ROUTES_PATH } from '@/router/paths'
import PanelMenu from 'primevue/panelmenu'

export default {
  name: 'Chapter',
  props: {
    chapters: {
      type: Array,
      default: function () {
        return (
          [
            {
              text: this.$t('pages.workspaces.noChapter'),
              pages: []
            }
          ]
        )
      }
    }
  },
  data () {
    return {
      ROUTES_PATH
    }
  },
  components: {
    'prime-panel-menu': Vue.extend(PanelMenu)
  },
  computed: {
    // Formated chapters in the standard api (MenuModel)
    formatedChapters () {
      return this.chapters.map(({ text, pages }) => {
        const formatedPages = pages.map(({ text, id }) => (
          {
            label: text,
            to: `${ROUTES_PATH.WORKSPACE}/${this.$route.params.workspaceId}/page/${id}`
          }
        ))
        return (
          {
            label: text,
            icon: 'pi pi-fw pi-file',
            items: formatedPages
          }
        )
      })
    }
  }
}
</script>
