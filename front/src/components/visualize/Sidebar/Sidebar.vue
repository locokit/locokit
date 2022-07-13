<template>
  <p-accordion
    v-if="!isItemsEmpty"
    :multiple="true"
    :class="{'lck-sidebar': !sidebarActive}"
    :activeIndex.sync="activeAccordions"
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
          :class="{
            'p-ml-4': !displayEditActions
          }"
          @click.native="$emit('click-sidebar-item')"
          v-show="displayEditActions || subitem.hidden !== true"
        >
          <span
            v-if="displayEditActions"
            class="bi bi-grip-vertical handle p-p-1"
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
          :label="createSubItemLabel || $t('pages.workspace.createElement')"
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
        :label="createItemLabel || $t('pages.workspace.createElement')"
        iconPos="right"
        icon="pi pi-plus"
        class="p-button-sm w-full"
        @click="$emit('add-item')"
      />
    </div>
  </p-accordion>
  <p
    v-else
    class="p-pl-3"
  >
    {{ this.$t('pages.workspace.noChapter') }}
  </p>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { TranslateResult } from 'vue-i18n'
import draggable from 'vuedraggable'

import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import Button from 'primevue/button'

interface MenuItems {
  id: string|null;
  label: string|TranslateResult;
  subitems?: {
    hidden: null|boolean;
    id: string|null;
    label: string|TranslateResult;
    to: string;
  }[];
}

export default Vue.extend({
  name: 'Sidebar',
  components: {
    'p-accordion': Vue.extend(Accordion),
    'p-accordion-tab': Vue.extend(AccordionTab),
    'p-button': Vue.extend(Button),
    draggable: Vue.extend(draggable),
  },
  props: {
    items: {
      type: Array,
    } as PropOptions<MenuItems[]>,
    displayEditActions: {
      type: Boolean,
      default: false,
    },
    createItemLabel: {
      type: String,
    } as PropOptions<string|TranslateResult>,
    createSubItemLabel: {
      type: String,
    } as PropOptions<string|TranslateResult>,
    sidebarActive: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {
      activeAccordions: [0] as number[],
    }
  },
  computed: {
    isItemsEmpty (): boolean {
      return !this.items || this.items.length === 0
    },
  },
  methods: {
    findActiveAccordion () {
      if (this.$route.params.pageId && this.items) {
        this.activeAccordions = this.items.reduce((acc, item, index) => {
          if (item.subitems) {
            const currentPage = item.subitems.find(({ id }) => id === this.$route.params.pageId)
            if (currentPage) {
              acc.push(index)
            }
          }
          return acc
        }, [] as number[])
      }
    },
  },
  mounted () {
    this.findActiveAccordion()
  },
  watch: {
    items: function () {
      this.findActiveAccordion()
    },
  },
})
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

.action-button {
  margin: 0 var(--spacing-sm);
}
</style>
