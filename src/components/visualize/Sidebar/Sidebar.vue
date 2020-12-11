<template>
  <p-accordion
    :multiple="true"
    class="lck-bg-primary lck-sidebar"
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
        :class="{ 'router-link-exact-active': subitem.active }"
        @click.native="$emit('click-sidebar-item')"
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
      default () {
        return [{
          label: this.$t('pages.workspace.noChapter'),
          subitems: []
        }]
      }
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

<style>
.lck-sidebar.p-accordion .p-accordion-header .p-accordion-header-link {
  transition: box-shadow 0.15s;
  color: var(--text-color);
  border: unset;
  background: unset;
}
.lck-sidebar.p-accordion .p-accordion-header:not(.p-disabled):not(.p-highlight):hover .p-accordion-header-link {
  color: var(--primary-color);
  border: unset;
  background-color: var(--text-color);
}
.lck-sidebar.p-accordion .p-accordion-header:not(.p-disabled).p-highlight .p-accordion-header-link {
  color: var(--primary-color);
  background-color: var(--surface-w);
}
.lck-sidebar.p-accordion .p-accordion-header:not(.p-disabled).p-highlight:hover .p-accordion-header-link {
  color: var(--primary-color);
  border: unset;
  background: unset;
  background-color: var(--text-color);
}
.lck-sidebar.p-accordion .p-accordion-content {
  padding: unset;
  color: var(--text-color);
  border: unset;
  background: unset;
}
.lck-sidebar.p-accordion .p-accordion-tab:not(:first-child) .p-accordion-header .p-accordion-header-link {
  border: unset;
}
.lck-sidebar.p-accordion .p-accordion-header:not(.p-disabled).p-highlight .p-accordion-header-link {
  color: var(--text-color);
  border: unset;
  background: unset;
}
.lck-sidebar.p-accordion .p-accordion-header:not(.p-disabled).p-highlight:hover .p-accordion-header-link {
  color: var(--text-color);
  border: unset;
  background: unset;
}
.lck-sidebar.p-accordion .p-accordion-content {
  padding: unset;
  color: var(--text-color);
  border: unset;
  background: unset;
}
.lck-sidebar.p-accordion .p-accordion-tab:not(:first-child) .p-accordion-header:not(.p-highlight):not(.p-disabled):hover .p-accordion-header-link, .p-accordion .p-accordion-tab:not(:first-child) .p-accordion-header:not(.p-disabled).p-highlight:hover .p-accordion-header-link {
  border: unset;
}
.lck-sidebar.p-accordion .p-accordion-tab:first-child .p-accordion-header .p-accordion-header-link {
  border: unset;
}
.lck-sidebar.p-accordion .p-accordion-tab:last-child .p-accordion-header:not(.p-highlight) .p-accordion-header-link {
  border: unset;
}

</style>
