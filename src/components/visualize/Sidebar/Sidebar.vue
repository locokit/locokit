<template>
  <p-accordion
    :multiple="true"
  >
    <p-accordion-tab
      v-for="chapter in formatedChapters"
      :key="chapter.id"
      :header="chapter.label"
    >
      <router-link
        v-for="page in chapter.items"
        :key="page.id"
        :to="page.to"
      >
        {{page.label}}
      </router-link>
    </p-accordion-tab>
  </p-accordion>
</template>

<script>
import Vue from 'vue'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import { ROUTES_PATH } from '@/router/paths'

export default {
  name: 'Sidebar',
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
    'p-accordion': Vue.extend(Accordion),
    'p-accordion-tab': Vue.extend(AccordionTab)
  },
  computed: {
    // Formated chapters in the standard api (MenuModel)
    formatedChapters () {
      return this.chapters.map(({ id, text, pages }) => {
        const formatedPages = pages.map(({ text, id }) => (
          {
            id,
            label: text,
            to: `${ROUTES_PATH.WORKSPACE}/${this.$route.params.workspaceId}${ROUTES_PATH.VISUALIZATION}/page/${id}`
          }
        ))
        return (
          {
            id,
            label: text,
            // icon: 'pi pi-fw pi-file',
            items: formatedPages
          }
        )
      })
    }
  }
}
</script>

<style scoped>

a {
  display: block;
  padding: .75rem 0 .75rem 2rem;
  text-decoration: none;
  color: var(--text-color);
}

.router-link-exact-active {
  font-weight: bold;
}

a:hover,
.router-link-exact-active {
  background-color: var(--text-color);
  color: var(--primary-color);
}

</style>
