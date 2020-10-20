<template>
  <p-accordion
    :multiple="true"
    class="lck-bg-primary"
  >
    <p-accordion-tab
      v-for="item in items"
      :key="item.id"
      :header="item.label"
      :active="item.active"
    >
      <router-link
        v-for="subitem in item.subitems"
        :key="subitem.id"
        :to="subitem.to"
      >
        {{subitem.label}}
      </router-link>
    </p-accordion-tab>
  </p-accordion>
</template>

<script>
import Vue from 'vue'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'

export default {
  name: 'Sidebar',
  props: {
    items: {
      type: Array,
      default: () => ([
        {
          text: this.$t('pages.workspace.noChapter'),
          subitems: []
        }
      ])
    }
  },
  components: {
    'p-accordion': Vue.extend(Accordion),
    'p-accordion-tab': Vue.extend(AccordionTab)
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
