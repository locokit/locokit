<template>
  <p-accordion
    :multiple="true"
    class="lck-bg-sidebar lck-sidebar"
    :activeIndex="[0]"
  >
    <p-accordion-tab
      v-for="item in items"
      :key="item.id"
    >
      <template #header>
        {{item.label}}
        <span
          class="action-set"
          v-if="displayEditActions"
        >
          <span
            @click.stop="$emit('edit-item', item.id)"
            class="pi pi-pencil action-button"
          />
          <span
            @click.stop="$emit('confirm-delete-chapter', { chapterId: item.id, chapterName: item.label })"
            class="pi pi-trash action-button"
          />
        </span>
      </template>
      <draggable
        :key="item.id"
        :value="item.subitems"
        handle=".handle"
        @change="$emit('reorder-subitem', item.id, $event)"
      >
        <router-link
          v-for="subitem in item.subitems"
          :key="subitem.id"
          :to="subitem.to"
          :class="{ 'router-link-exact-active': subitem.active }"
          @click.native="$emit('click-sidebar-item')"
          v-show="displayEditActions || subitem.hidden !== true"
        >
          <span
            v-if="displayEditActions"
            class="pi pi-ellipsis-v handle"
          />
          {{subitem.label}}
          <span
            class="action-subset"
            v-if="displayEditActions"
          >
            <span
              @click.stop.prevent="$emit('edit-subitem', { item: item.id, subitem: subitem.id })"
              class="pi pi-pencil action-button"
            />
            <span
              @click.stop.prevent="$emit('confirm-delete-page', {
                chapterId: item.id,
                pageId: subitem.id,
                pageName: subitem.label
              })"
              class="pi pi-trash action-button"
            />
          </span>
        </router-link>
      </draggable>
      <p-button
        v-if="displayEditActions"
        :label="createSubItemLabel"
        icon="pi pi-plus"
        iconPos="right"
        class="new-item-button new-subitem-button"
        @click="$emit('add-subitem', { item: item.id })"
      />
    </p-accordion-tab>
    <p-button
      v-if="displayEditActions"
      :label="createItemLabel"
      iconPos="right"
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
import draggable from 'vuedraggable'

export default {
  name: 'Sidebar',
  props: {
    items: {
      type: Array,
      default () {
        return [{
          label: this.$t('pages.workspace.noChapter'),
          subitems: [],
        }]
      },
    },
    displayEditActions: {
      type: Boolean,
      default: false,
    },
    createItemLabel: {
      type: String,
      default () { return this.$t('pages.workspace.createElement') },
    },
    createSubItemLabel: {
      type: String,
      default () { return this.$t('pages.workspace.createElement') },
    },
  },
  components: {
    'p-accordion': Vue.extend(Accordion),
    'p-accordion-tab': Vue.extend(AccordionTab),
    'p-button': Vue.extend(Button),
    draggable: Vue.extend(draggable),
  },
}
</script>

<style scoped>
a {
  display: block;
  padding: 0.75rem 0 0.75rem 2rem;
  text-decoration: none;
  color: var(--sidebar-text-color);
}

.router-link-exact-active {
  font-weight: bold;
}

a:hover,
.router-link-exact-active {
  background-color: var(--sidebar-text-color);
  color: var(--sidebar-text-color-active) !important;
}

.action-button {
  padding: 0.5em;
  margin: -0.5em 0em;
}

.action-button:hover {
  color: var(--sidebar-text-color);
  background-color: var(--primary-color-darken);
  transition-duration: 0.5s;
}

a:hover .action-button:hover,
.router-link-exact-active .action-button:hover {
  background-color: var(--sidebar-text-color-active);
}

.action-set {
  padding-left: 0.5rem;
  margin-left: auto;
  flex-shrink: 0;
}

.p-accordion-content a {
  position: relative;
  display: flex;
  align-items: center;
  color: var(--sidebar-text-color);
}

.p-accordion-content a:visited {
  color: var(--sidebar-text-color);
}

.p-accordion-content {
  padding-right: 0.5em;
}

.action-subset {
  flex-shrink: 0;
  padding-left: 0.5em;
  padding-right: 0.5em;
  margin-left: auto;
}

.new-item-button {
  width: 100%;
  text-align: left;
  padding-left: 0.5rem;
  line-height: 2rem;
}

.new-subitem-button {
  padding-left: 2rem;
}

.handle {
  cursor: move;
  position: absolute;
  left: 0.5rem;
}
</style>

<style>
.lck-sidebar.p-accordion .p-accordion-header .p-accordion-header-link {
  transition: box-shadow 0.15s;
  color: var(--sidebar-text-color);
  border: unset;
  background: unset;
}
.lck-sidebar.p-accordion
  .p-accordion-header:not(.p-disabled):not(.p-highlight):hover
  .p-accordion-header-link {
  color: var(--sidebar-text-color-active);
  border: unset;
  background-color: var(--sidebar-text-color);
}
.lck-sidebar.p-accordion
  .p-accordion-header:not(.p-disabled).p-highlight
  .p-accordion-header-link {
  color: var(--primary-color);
  background-color: var(--surface-w);
}
.lck-sidebar.p-accordion
  .p-accordion-header:not(.p-disabled).p-highlight:hover
  .p-accordion-header-link {
  color: var(--primary-color);
  border: unset;
  background: unset;
  background-color: var(--sidebar-text-color);
}
.lck-sidebar.p-accordion .p-accordion-content {
  padding: unset;
  color: var(--sidebar-text-color);
  border: unset;
  background: unset;
}
.lck-sidebar.p-accordion
  .p-accordion-tab:not(:first-child)
  .p-accordion-header
  .p-accordion-header-link {
  border: unset;
}
.lck-sidebar.p-accordion
  .p-accordion-header:not(.p-disabled).p-highlight
  .p-accordion-header-link {
  color: var(--sidebar-text-color);
  border: unset;
  background: unset;
}
.lck-sidebar.p-accordion
  .p-accordion-header:not(.p-disabled).p-highlight:hover
  .p-accordion-header-link {
  color: var(--sidebar-text-color);
  border: unset;
  background: unset;
}
.lck-sidebar.p-accordion .p-accordion-content {
  padding: unset;
  color: var(--sidebar-text-color);
  border: unset;
  background: unset;
}
.lck-sidebar.p-accordion
  .p-accordion-tab:not(:first-child)
  .p-accordion-header:not(.p-highlight):not(.p-disabled):hover
  .p-accordion-header-link,
.p-accordion
  .p-accordion-tab:not(:first-child)
  .p-accordion-header:not(.p-disabled).p-highlight:hover
  .p-accordion-header-link {
  border: unset;
}
.lck-sidebar.p-accordion
  .p-accordion-tab:first-child
  .p-accordion-header
  .p-accordion-header-link {
  border: unset;
}
.lck-sidebar.p-accordion
  .p-accordion-tab:last-child
  .p-accordion-header:not(.p-highlight)
  .p-accordion-header-link {
  border: unset;
}
</style>
