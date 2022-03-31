<template>
  <div
    v-if="containers"
    class="page-containers lck-color-content p-text-bold p-field p-d-flex p-flex-column"
  >
    <span class="field p-mb-2">
      {{ $t('pages.workspace.page.navigationExplain') }}
    </span>

    <lck-form
      :submitting="submitting"
      @submit="onFormSubmit"
      @cancel="$emit('close')"
      class="lck-color-content p-text-bold p-mb-4"
    >
      <validation-provider
        vid="modeNavigation"
        :name="$t('pages.workspace.page.mode_navigation.title')"
        tag="div"
        class="p-field"
      >
        <p>{{ $t('pages.workspace.page.mode_navigation.title') }}</p>
        <div v-for="mode in MODE_NAVIGATION" :key="mode">
          <p-radio-button
            :id="mode"
            :name="mode"
            :value="mode"
            v-model="modeNavigation"
          />
          <label :for="mode">
            {{ $t(`pages.workspace.page.mode_navigation.${mode}`) }}
          </label>
        </div>
      </validation-provider>
    </lck-form>

    <span class=" p-mb-2">
      {{ $t('pages.workspace.page.list') }}
    </span>
    <p-datatable
      :value="containers"
      dataKey="id"
      class="p-pt-2"
    >
      <template #empty>
        {{ $t('pages.workspace.page.noContainers') }}
      </template>
      <p-column
        field="text"
        :header="$t('pages.workspace.container.name')"
      />
      <p-column
        field="displayed_in_navbar"
        :header="$t('pages.workspace.container.displayedInNavbar')"
      >
        <template #body="slotProps">
          <p-switch
            :value="slotProps.data.displayed_in_navbar"
            disabled
          />
        </template>
      </p-column>
      <p-column headerStyle="width: 7em">
        <template #body="slotProps">
          <span class="p-buttonset">
            <p-button
              :title="$t('pages.workspace.container.edit')"
              icon="bi bi-pencil"
              class="p-button-text p-mr-2 p-ml-auto p-button-lg"
              @click="$emit('edit-container', slotProps.data)"
            />
            <p-button
              :title="$t('pages.workspace.container.delete')"
              icon="bi bi-trash"
              class="p-button-text p-button-lg"
              @click="$emit('confirm-delete-container', slotProps.data)"
            />
          </span>
        </template>
      </p-column>

      <template #footer>
        <p-button
          :title="$t('pages.workspace.container.create')"
          icon="pi pi-plus"
          class="p-button-text p-button-lg"
          @click="$emit('add-new-container', { id: 'temp' })"
        />
      </template>
    </p-datatable>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputSwitch from 'primevue/inputswitch'
import { ValidationProvider } from 'vee-validate'
import LckForm from '@/components/ui/Form/Form.vue'
import RadioButton from 'primevue/radiobutton'

const MODE_NAVIGATION = ['anchor', 'tab']

export default Vue.extend({
  name: 'UpdatePageForm',
  components: {
    'lck-form': LckForm,
    'p-button': Vue.extend(Button),
    'p-datatable': Vue.extend(DataTable),
    'p-column': Vue.extend(Column),
    'p-switch': Vue.extend(InputSwitch),
    'p-radio-button': Vue.extend(RadioButton),
    'validation-provider': Vue.extend(ValidationProvider),
  },
  props: {
    page: {
      type: Object,
      required: true,
    },
    containers: {
      type: Array,
      required: true,
    },
    submitting: {
      type: Boolean,
      default: false,
    },
    autocompleteSuggestions: {
      type: Array as PropType<{ label: string; value: string }[]>,
      default: () => [],
    },
  },
  data () {
    return {
      MODE_NAVIGATION,
      modeNavigation: this.page.modeNavigation, // Always set
    }
  },
  methods: {
    onFormSubmit () {
      return this.$emit('updateModeNavigation', this.modeNavigation)
    },
  },
})
</script>

<style scoped>
/deep/ .p-datatable .p-datatable-footer {
  text-align: center;
}

/deep/ .p-datatable-wrapper .p-datatable-thead th {
  position: static;
}
</style>
