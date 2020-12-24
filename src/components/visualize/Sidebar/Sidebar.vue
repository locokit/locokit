<template>
  <p-accordion
    :multiple="true"
    class="lck-bg-primary lck-sidebar"
  >
    <p-accordion-tab
      v-for="item in items"
      :key="item.id"
      :active="item.active"
    >
      <template #header>
        {{item.label}}
        <span class="action-set" v-if="displayEditActions && (isAdmin || editableItems[item.id])">
          <span
            @click.stop="$emit('edit-item', item.id)"
            class="pi pi-pencil action-button"
          />
          <span
            @click.stop="$emit('delete-item', item.id)"
            class="pi pi-trash action-button"
          />
        </span>
      </template>
      <router-link
        v-for="subitem in item.subitems"
        :key="subitem.id"
        :to="subitem.to"
        :class="{ 'router-link-exact-active': subitem.active }"
        @click.native="$emit('click-sidebar-item')"
      >
        {{subitem.label}}
        <span class="action-subset" v-if="displayEditActions && (isAdmin || editableItems[item.id])">
          <span
            @click.stop="$emit('edit-subitem', { item: item.id, subitem: subitem.id })"
            class="pi pi-pencil action-button"
          />
          <span
            @click.stop="$emit('delete-subitem', { item: item.id, subitem: subitem.id })"
            class="pi pi-trash action-button"
          />
        </span>
      </router-link>
        <p-button
          v-if="displayEditActions && (isAdmin || editableItems[item.id])"
          :label="createSubItemLabel"
          icon="pi pi-plus"
          class="new-item-button new-subitem-button"
          @click="$emit('add-subitem', { item: item.id })"
      />
    </p-accordion-tab>
    <p-button
      v-if="displayEditActions && isAdmin"
      :label="createItemLabel"
      icon="pi pi-plus"
      class="new-item-button"
      @click="$emit('add-item')"
    />
  </p-accordion>
</template>

<script>
import Vue from 'vue'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import Button from 'primevue/button'

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
    },
    displayEditActions: {
      type: Boolean,
      default: false
    },
    editableItems: {
      type: Object,
      default () {
        return {}
      }
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    createItemLabel: {
      type: String,
      default () { return this.$t('pages.workspace.createElement') }
    },
    createSubItemLabel: {
      type: String,
      default () { return this.$t('pages.workspace.createElement') }
    }
  },
  components: {
    'p-accordion': Vue.extend(Accordion),
    'p-accordion-tab': Vue.extend(AccordionTab),
    'p-button': Vue.extend(Button)
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

.action-button {
  padding: 0.5em;
  margin: -0.5em 0.0em;
}

.action-button:hover {
  color: white;
  background-color: var(--primary-color-darken);
  transition-duration: 0.5s;
}

.action-set {
  padding-left: 0.5em;
  margin-left: auto;
  flex-shrink: 0;
}

.p-accordion-content > a {
  display: flex;
  align-items: center;
}

.p-accordion-content {
  padding-right: 0.5em;
}

.action-subset {
  flex-shrink: 0;
  padding-left: 0.5em;
  padding-right: 0.5em;
  margin-left: auto;
  color: var(--primary-color-darken);
}

.new-item-button {
  width: 100%;
  text-align: left;
  padding-left: 5px;
  line-height: 2rem;
}

.new-subitem-button {
  padding-left: 2rem;
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
