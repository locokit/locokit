<template>
  <div>
    <lck-form
      :submitting="submitting"
      @submit="$emit('update-container', containerCopy)"
      @cancel="$emit('close')"
      class="lck-color-content p-text-bold"
    >
      <div class="p-field">
        <label for="container-name">
          {{ $t('pages.workspace.containerName') }}
        </label>
        <p-input-text
          id="container-name"
          type="text"
          v-model="containerCopy.text"
          required
        />
      </div>
    </lck-form>
    <div
      v-if="containerCopy.id"
      class="container-blocks p-text-bold p-field p-mt-6"
    >
      <span class="lck-color-content p-mb-2">
        {{ $t('pages.workspace.block.list') }}
      </span>
      <p-datatable
        :value="containerCopy.blocks"
        dataKey="id"
      >
        <template #empty>
          {{ $t('pages.workspace.noBlock') }}
        </template>
        <p-column
          field="title"
          :header="$t('pages.workspace.block.title')"
        />
        <p-column
          field="type"
          :header="$t('pages.workspace.block.type')"
        />
        <p-column headerStyle="width: 7em">
          <template #body="slotProps">
          <span class="p-buttonset">
            <p-button
              :title="$t('pages.workspace.block.edit')"
              icon="pi pi-pencil"
              class="p-button-text p-mr-2 p-ml-auto p-button-lg"
              @click="$emit('edit-block', slotProps.data)"
            />
            <p-button
              :title="$t('pages.workspace.block.delete')"
              icon="pi pi-trash"
              class="p-button-text p-button-lg"
              @click="$emit('delete-block', slotProps.data)"
            />
          </span>
          </template>
        </p-column>

        <template #footer>
          <p-button
            :title="$t('pages.workspace.block.create')"
            icon="pi pi-plus"
            class="p-button-text p-button-lg"
            @click="$emit('add-new-block', { id: '' })"
          />
        </template>
      </p-datatable>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

import {
  LckContainer
} from '@/services/lck-api/definitions'

import LckForm from '@/components/ui/Form/Form.vue'

export default {
  name: 'UpdateContainerForm',
  components: {
    'lck-form': LckForm,
    'p-input-text': Vue.extend(InputText),
    'p-button': Vue.extend(Button),
    'p-datatable': Vue.extend(DataTable),
    'p-column': Vue.extend(Column)
  },
  props: {
    container: {
      type: Object as Vue.PropType<LckContainer>,
      required: true
    },
    submitting: {
      type: Boolean,
      default: false
    },
    autocompleteSuggestions: {
      type: Array,
      default: () => ([])
    } as Vue.PropOptions<{ label: string; value: string }[]>
  },
  data () {
    return {
      containerCopy: new LckContainer()
    }
  },
  watch: {
    container: {
      handler (newValue = {}) {
        this.containerCopy = { ...newValue }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style scoped>
/deep/ .p-datatable .p-datatable-footer {
  text-align: center;
}

/deep/ .p-datatable-wrapper .p-datatable-thead th {
  position: static;
}
</style>
