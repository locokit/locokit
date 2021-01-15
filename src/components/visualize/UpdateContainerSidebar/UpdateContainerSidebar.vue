<template>
  <p-sidebar
    class="p-sidebar-lg p-fluid"
    position="right"
    :visible="showSidebar"
    @update:visible="$emit('close', $event)"
  >
    <div class="sidebar-content">
      <h3 class="lck-color-title">
        {{ containerCopy.id ? $t('pages.workspace.editContainer') : $t('pages.workspace.createContainer') }}
      </h3>
      <form class="p-d-flex" @submit.prevent="$emit('update-container', containerCopy)">
        <div class="p-col">
          <h4 class="lck-color-subtitle"><label for="container-name" >{{ $t('pages.workspace.containerName') }}</label></h4>
          <p-input-text
            id="container-name"
            class="lck-color-content"
            type="text"
            v-model="containerCopy.text"
            autofocus
            required
          />
        </div>
        <div class="p-d-flex p-ai-end">
          <p-button
            disabled
            v-if="submitting"
            :label="$t('form.waiting')"
            icon="pi pi-spin pi-spinner"
            class="p-button-text"
          />
          <p-button
            v-else
            type="submit"
            :label="containerCopy.id ? $t('form.update') : $t('form.save')"
            icon="pi pi-check"
            class="p-button-text"
          />
        </div>
      </form>
      <div v-if="containerCopy.id">
        <h4 class="lck-color-subtitle">{{ $t('pages.workspace.blocksList') }}</h4>
        <p-datatable :value="containerCopy.blocks">
          <template #empty>
            {{ $t('pages.workspace.noBlock') }}
          </template>
          <p-column field="title" :header="$t('pages.workspace.blockName')"></p-column>
          <p-column field="type" :header="$t('pages.workspace.blockType')"></p-column>
        </p-datatable>
      </div>
    </div>
  </p-sidebar>
</template>

<script>

import Vue from 'vue'
import Button from 'primevue/button'
import Sidebar from 'primevue/sidebar'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

export default {
  name: 'UpdateContainerSidebar',
  components: {
    'p-sidebar': Vue.extend(Sidebar),
    'p-input-text': Vue.extend(InputText),
    'p-button': Vue.extend(Button),
    'p-datatable': Vue.extend(DataTable),
    'p-column': Vue.extend(Column)
  },
  props: {
    showSidebar: {
      type: Boolean,
      default: false
    },
    container: {
      type: Object,
      default: () => ({})
    },
    submitting: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      containerCopy: {}
    }
  },
  watch: {
    container: {
      handler (newValue = {}) {
        this.containerCopy = {
          ...newValue
        }
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.p-sidebar {
  top: var(--header-height);
  overflow-y: auto;
  width: 50vw;
}

@media only screen and (max-device-width: 480px) {
  .p-sidebar {
    width: 100vw;
  }
}

h3, h4 {
  margin-bottom: 0.5em;
}
</style>
