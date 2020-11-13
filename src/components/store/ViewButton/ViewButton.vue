<template>
  <lck-overlaypanel
    icon="pi pi-list"
    class-button="p-button-outlined p-button-secondary"
    :label="label"
  >
    <template #overlay-content="slotProps">
      <draggable
        class="view-group"
        tag="div"
        v-model="views"
        v-bind="dragOptions"
        @start="drag = true"
        @end="drag = false"
        handle=".handle"
      >
        <transition-group
          type="transition"
          :name="!drag ? 'flip-list' : null"
        >
          <div
            class="view-group-item p-d-flex p-jc-between p-ai-center"
            v-for="element in views"
            :key="element.id"
          >
            <span class="p-d-flex p-ai-baseline">
              <p-button
                class="p-button-sm p-button-text p-button-secondary handle"
                icon="pi pi-ellipsis-v"
              />
              <span
                :class="element.id === value ? 'p-text-bold' : ''"
                @click="$emit('input', element.id)"
              >
                <span v-if="element.locked">
                  <i class="pi pi-lock" />
                </span>
                {{ element.text }}
              </span>
            </span>
            <span class="p-ml-4" v-if="!element.locked">
              <p-button
                class="p-button-sm p-button-text p-button-info"
                icon="pi pi-pencil"
                @click="emitEvent('update', slotProps.toggleOverlayPanel, element)"
              />
              <p-button
                class="p-button-sm p-button-text p-button-danger"
                icon="pi pi-trash"
                @click="emitEvent('delete', slotProps.toggleOverlayPanel, element)"
              />
            </span>
          </div>
        </transition-group>
      </draggable>
      <p-button
        :label="$t('components.datatable.toolbar.views.createLabel')"
        icon="pi pi-plus-circle"
        @click="emitEvent('create', slotProps.toggleOverlayPanel)"
      />
    </template>
  </lck-overlaypanel>
</template>

<script>
import Vue from 'vue'
import Button from 'primevue/button'
import OverlayPanel from '@/components/ui/OverlayPanel/OverlayPanel'
import draggable from 'vuedraggable'

export default {
  name: 'LckViewButton',
  components: {
    'p-button': Vue.extend(Button),
    'lck-overlaypanel': Vue.extend(OverlayPanel),
    draggable: Vue.extend(draggable)
  },
  props: {
    views: {
      type: Array,
      required: false,
      default: () => ([])
    },
    value: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      drag: false
    }
  },
  computed: {
    label () {
      if (this.views.length === 0) return this.$t('components.datatable.toolbar.views.noview')
      return this.views.find(v => v.id === this.value)?.text
    },
    dragOptions () {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  methods: {
    emitEvent (eventName, toggleOverlayPanel, data) {
      toggleOverlayPanel()
      this.$emit(eventName, data)
    }
  }
}
</script>

<style scoped>
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.view-group {
  margin-bottom: 1rem;
}
.view-group-item {
  cursor: pointer;
  padding: 0.25rem 0;
}
.handle.p-button.p-button-icon-only.p-button-sm {
  cursor: move;
}
.handle.p-button.p-button-icon-only.p-button-sm,
.p-button.p-button-icon-only.p-button-sm {
  width: 1.5rem;
  padding: 0.5rem;
}
</style>
