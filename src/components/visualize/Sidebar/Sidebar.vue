<template>
  <p-accordion
    :multiple="true"
    class="lck-sidebar"
    :activeIndex="[0]"
  >
    <p-accordion-tab
      v-for="item in items"
      :key="item.id"
    >
      <template #header>
        <span class="lck-sidebar-link-label">{{item.label}}</span>
        <span
          class="action-set"
          v-if="displayEditActions"
        >
          <span
            @click.stop="$emit('edit-item', item.id)"
            class="bi bi-pencil action-button"
          />
          <span
            @click.stop="$emit('confirm-delete-chapter', { chapterId: item.id, chapterName: item.label })"
            class="bi bi-trash action-button"
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
          class="lck-sidebar-link"
          :class="{ 'router-link-exact-active': subitem.active }"
          @click.native="$emit('click-sidebar-item')"
          v-show="displayEditActions || subitem.hidden !== true"
        >
          <span
            v-if="displayEditActions"
            class="bi bi-grip-vertical handle"
          />
          <span class="lck-sidebar-link-label">{{subitem.label}}</span>
          <span
            class="action-subset"
            v-if="displayEditActions"
          >
            <span
              @click.stop.prevent="$emit('edit-subitem', { item: item.id, subitem: subitem.id })"
              class="bi bi-pencil action-button"
            />
            <span
              @click.stop.prevent="$emit('confirm-delete-page', {
                chapterId: item.id,
                pageId: subitem.id,
                pageName: subitem.label
              })"
              class="bi bi-trash action-button"
            />
          </span>
        </router-link>
      </draggable>
      <div class="p-m-1">
        <p-button
          v-if="displayEditActions"
          :label="createSubItemLabel"
          icon="pi pi-plus"
          iconPos="right"
          class="p-button-sm w-full"
          @click="$emit('add-subitem', { item: item.id })"
        />
      </div>
    </p-accordion-tab>
    <div class="p-m-1">
      <p-button
        v-if="displayEditActions"
        :label="createItemLabel"
        iconPos="right"
        icon="pi pi-plus"
        class="p-button-sm w-full"
        @click="$emit('add-item')"
      />
    </div>
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
<style scoped lang="scss">
.lck-sidebar-link {
  position: relative;
  display: flex;

  &-label {
    display: block;
    flex: 1;
  }
}

.p-accordion-content {
  .lck-sidebar-link-label {
    padding-left: var(--spacing);
  }
}

.action-button {
  margin: 0 var(--spacing-sm);
}

.handle {
  cursor: move;
  position: absolute;
  left: 0.5rem;
}
</style>
