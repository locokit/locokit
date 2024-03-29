<template>
  <div>
    <lck-form
      :submitting="submitting"
      @submit="onFormSubmit"
      @cancel="$emit('close')"
      class="lck-color-content p-text-bold"
    >
      <validation-provider
        vid="container-name"
        tag="div"
        class="p-field"
        :name="$t('pages.workspace.container.name')"
        rules="required"
        v-slot="{
        errors,
        classes
      }"
      >
        <label for="container-name" class="label-field-required">
          {{ $t('pages.workspace.container.name') }}
        </label>
        <p-input-text
          id="container-name"
          type="text"
          v-model="containerCopy.text"
        />
        <span :class="classes">{{ errors[0] }}</span>
      </validation-provider>
      <validation-provider
        vid="container-display_title"
        tag="div"
        class="p-field p-d-flex p-flex-column"
      >
        <label for="container-display_title">
          {{ $t('pages.workspace.container.displayTitle') }}
        </label>
        <p-switch
          id="container-display_title"
          v-model="containerCopy.display_title"
        />
      </validation-provider>
      <validation-provider
        vid="container-elevation"
        tag="div"
        class="p-field p-d-flex p-flex-column"
      >
        <label for="container-elevation">
          {{ $t('pages.workspace.container.elevation') }}
        </label>
        <p-switch
          id="container-elevation"
          v-model="containerCopy.elevation"
        />
      </validation-provider>
      <validation-provider
        vid="container-displayed_in_navbar"
        tag="div"
        class="p-field p-d-flex p-flex-column"
      >
        <label for="container-displayed_in_navbar">
          {{ $t('pages.workspace.container.displayedInNavbar') }}
        </label>
        <p-switch
          id="container-displayed_in_navbar"
          v-model="containerCopy.displayed_in_navbar"
        />
      </validation-provider>
      <div v-if="containerCopy.displayed_in_navbar">
        <span>
          {{ $t('pages.workspace.container.navigationExplain') }}
        </span>
        <div class="p-mt-2 p-ml-2">
          <validation-provider
            vid="container-anchor_label"
            tag="div"
            class="p-field"
            :name="$t('pages.workspace.container.anchor.label')"
            rules="required"
            v-slot="{
              errors,
              classes
            }"
          >
            <label for="container-anchor_label" class="label-field-required">
              {{ $t('pages.workspace.container.anchor.label') }}
            </label>
            <p-input-text
              id="container-anchor_label"
              type="text"
              v-model="containerCopy.anchor_label"
            />
            <span :class="classes">{{ errors[0] }}</span>
          </validation-provider>
          <validation-provider
            vid="container-anchor_icon"
            tag="div"
            class="p-field"
          >
            <label for="container-anchor_icon">
              {{ $t('pages.workspace.container.anchor.icon') }}
            </label>
            <p-input-text
              id="container-anchor_icon"
              type="text"
              v-model="containerCopy.anchor_icon"
            />
          </validation-provider>
          <validation-provider
            vid="container-anchor_icon_class"
            tag="div"
            class="p-field"
          >
            <label for="container-anchor_icon_class">
              {{ $t('pages.workspace.container.anchor.class.title') }}
            </label>
            <p-dropdown
              id="container-anchor_icon_class"
              v-model="containerCopy.anchor_icon_class"
              optionLabel="label"
              optionValue="value"
              dataKey="value"
              :options="NAMED_CLASSES"
            >
              <template #value="slotProps">
                {{ $t(`pages.workspace.container.anchor.class.${slotProps.value}`) }}
              </template>
              <template #option="slotProps">
                {{ $t(`pages.workspace.container.anchor.class.${slotProps.option.value}`) }}
              </template>
            </p-dropdown>
          </validation-provider>
        </div>
      </div>
    </lck-form>

    <div
      v-if="containerCopy.id"
      class="container-blocks p-text-bold p-field p-mt-6"
    >
      <span class="lck-color-content">
        {{ $t('pages.workspace.container.list') }}
      </span>
      <p-datatable
        :value="containerCopy.blocks"
        dataKey="id"
        class="p-pt-2"
      >
        <template #empty>
          {{ $t('pages.workspace.container.noBlocks') }}
        </template>
        <p-column
          field="title"
          :header="$t('pages.workspace.block.name')"
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
                icon="bi bi-pencil"
                class="p-button-text p-mr-2 p-ml-auto p-button-lg"
                @click="$emit('edit-block', slotProps.data)"
              />
              <p-button
                :title="$t('pages.workspace.block.delete')"
                icon="bi bi-trash"
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
            @click="$emit('add-new-block', { id: 'temp' })"
          />
        </template>
      </p-datatable>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { ValidationProvider } from 'vee-validate'

import { NAMED_CLASSES } from '@/services/lck-utils/prime'
import { LckContainer } from '@/services/lck-api/definitions'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputSwitch from 'primevue/inputswitch'
import Dropdown from 'primevue/dropdown'

import LckForm from '@/components/ui/Form/Form.vue'

export default Vue.extend({
  name: 'UpdateContainerForm',
  components: {
    'lck-form': LckForm,
    'p-input-text': Vue.extend(InputText),
    'p-button': Vue.extend(Button),
    'p-datatable': Vue.extend(DataTable),
    'p-column': Vue.extend(Column),
    'p-switch': Vue.extend(InputSwitch),
    'p-dropdown': Vue.extend(Dropdown),
    'validation-provider': Vue.extend(ValidationProvider),
  },
  props: {
    container: {
      type: Object as PropType<LckContainer>,
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
      containerCopy: new LckContainer(),
      NAMED_CLASSES,
    }
  },
  methods: {
    onFormSubmit () {
      // Remove invariant data
      // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/camelcase
      const { blocks, createdAt, page_id, updatedAt, ...data } = this.containerCopy

      if (this.containerCopy?.displayed_in_navbar) {
        return this.$emit('update-container', data)
      }
      // Don't send default label for anchor_label if no anchor
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/camelcase
      const { anchor_label, ...rest } = data
      return this.$emit('update-container', rest)
    },
  },
  watch: {
    container: {
      handler (newValue = {}) {
        this.containerCopy = {
          ...newValue,
          // eslint-disable-next-line @typescript-eslint/camelcase
          anchor_label: newValue.anchor_label || newValue.text,
          // eslint-disable-next-line @typescript-eslint/camelcase
          displayed_in_navbar: newValue.displayed_in_navbar || false,
          // eslint-disable-next-line @typescript-eslint/camelcase
          anchor_icon_class: newValue.anchor_icon_class || 'primary',
        }
      },
      immediate: true,
      deep: true,
    },
  },
})
</script>

<style scoped>
.p-datatable .p-datatable-footer {
  text-align: center;
}

.p-datatable-wrapper .p-datatable-thead th {
  position: static;
}
</style>
