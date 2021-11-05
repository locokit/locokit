<template>
  <div>
    <div class="p-d-flex">
      <div class="p-ai-start p-mb-4 p-ml-auto">
        <p-button
          @click="addSelectTypeValue"
          icon="pi pi-plus"
          class="p-button-text"
          :label="$t('pages.databaseSchema.selectType.addValue')"
        />
      </div>
    </div>
    <p-datatable
      :value="selectTypeValues"
      class="select-type-values-table"
      @row-reorder="onRowReorder"
    >
      <template #empty>
        {{ $t('pages.databaseSchema.selectType.noData') }}
      </template>
      <p-column
        :rowReorder="true"
        rowReorderIcon="bi bi-three-dots-vertical"
        headerClass="p-col-1"
        bodyClass="p-col-1"
        bodyStyle="text-align: center"
      />
      <p-column
        field="label"
        headerClass="p-col-5"
        bodyClass="p-col-5"
        :header="$t('pages.databaseSchema.selectType.label')"
      >
        <template #body="props">
          <validation-provider
            vid="option-label"
          >
            <p-input-text
              id="option-label"
              v-model="props.data.label"
            />
          </validation-provider>
        </template>
      </p-column>
      <p-column
        field="color"
        headerClass="p-col-4"
        bodyClass="p-col-4"
        :header="$t('pages.databaseSchema.selectType.color')"
      >
        <template #body="props">
          <validation-provider
            vid="option-color"
          >
            <p-dropdown
              id="option-color"
              :options="colorScheme"
              dataKey="backgroundColor"
              appendTo="body"
              :placeholder="$t('pages.databaseSchema.selectType.selectColor')"
              :value="colorScheme.find(color => color.backgroundColor === props.data.backgroundColor)"
              @change="onColorSelect($event,props.data)"
            >
              <template #value="slotProps">
                <lck-badge
                  v-if="slotProps.value"
                  :label="props.data.label"
                  :color="slotProps.value.color"
                  :backgroundColor="slotProps.value.backgroundColor"
                />
              </template>
              <template #option="slotProps">
                <lck-badge
                  :label="props.data.label"
                  :color="slotProps.option.color"
                  :backgroundColor="slotProps.option.backgroundColor"
                />
              </template>
            </p-dropdown>
          </validation-provider>
        </template>
      </p-column>
      <p-column
        headerClass="p-col-2"
        bodyClass="p-col-2"
        bodyStyle="text-align: center"
      >
        <template #body="props">
          <p-button
            icon="bi bi-trash"
            class="p-button-rounded lck-color-content p-column-button-color"
            @click="onConfirmationDeleteSelectTypeValue(props.data)"
          />
        </template>
      </p-column>
    </p-datatable>
    <validation-provider
      vid="default-select-type-value-id"
      tag="div"
      class="p-mt-2 p-fluid"
    >
      <label for="default-select-type-value-id">
        {{ $t('pages.databaseSchema.selectType.defaultValue') }}
      </label>
      <p-dropdown
        id="default-select-type-value-id"
        appendTo="body"
        v-model="defaultSelectTypeValueId"
        :options="selectTypeValues"
        dataKey="id"
        optionValue="id"
        optionLabel="label"
        :placeholder="$t('pages.databaseSchema.selectType.defaultValuePlaceholder')"
      />
    </validation-provider>
  </div>
</template>

<script>
import Vue from 'vue'

import { v4 as uuidv4 } from 'uuid'
import { ValidationProvider } from 'vee-validate'

import { lckServices } from '@/services/lck-api'
import { COLOR_SCHEME } from '@/services/lck-utils/color'

import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'

import Badge from '@/components/ui/Badge/Badge'

export default {
  name: 'SelectTypeColumn',
  components: {
    'lck-badge': Badge,
    'p-input-text': Vue.extend(InputText),
    'p-dropdown': Vue.extend(Dropdown),
    'p-datatable': Vue.extend(DataTable),
    'p-column': Vue.extend(Column),
    'p-button': Vue.extend(Button),
    'validation-provider': Vue.extend(ValidationProvider),
  },
  props: {
    columnToHandle: {
      type: Object,
      required: false,
    },
  },
  data () {
    return {
      selectTypeValues: [],
      defaultSelectTypeValueId: null,
      showDeleteColumnModal: false,
      colorScheme: COLOR_SCHEME,
    }
  },
  methods: {
    async addSelectTypeValue () {
      // Await necessary to scroll to the last element
      await this.selectTypeValues.push({
        id: uuidv4(),
        label: '',
        color: this.colorScheme[0].color,
        backgroundColor: this.colorScheme[0].backgroundColor,
        position: this.selectTypeValues.length > 0 ? Math.max(...this.selectTypeValues.map(({ position }) => position)) + 1 : 1,
      })
      // Scroll to last td
      const lastTr = this.$el.querySelector('.select-type-values-table tbody tr:last-child')
      lastTr.scrollIntoView({ behavior: 'smooth' })
      // Add focus on first input in the row
      lastTr.querySelector('td input').focus()
    },
    onConfirmationDeleteSelectTypeValue (selectTypeValue) {
      this.$confirm.require({
        message: `${this.$t('form.specificDeleteConfirmation')} ${selectTypeValue.label}`,
        header: this.$t('form.confirmation'),
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          const saveDefaultSelectTypeValueId = this.defaultSelectTypeValueId
          const selectTypeValueId = selectTypeValue.id
          try {
            let settings = {}
            const options = this.selectTypeValues.filter(({ id }) => id !== selectTypeValueId)

            if (this.defaultSelectTypeValueId === selectTypeValueId) {
              this.defaultSelectTypeValueId = null
            }

            // Transform Array To Object to matcth column's setting
            options.forEach((selectTypeValue, index) => {
              const newSelectTypeValue = {}
              // Keep position with continuous numbering
              newSelectTypeValue[selectTypeValue.id] = { ...selectTypeValue, position: index + 1 }
              delete newSelectTypeValue[selectTypeValue.id].id
              settings = { values: { ...settings, ...newSelectTypeValue }, default: this.defaultSelectTypeValueId }
            })

            await lckServices.tableColumn.patch(this.columnToHandle.id, {
              settings,
            })
            this.selectTypeValues = this.selectTypeValues.filter(({ id }) => id !== selectTypeValueId)

            this.$toast.add({
              severity: 'success',
              summary: this.$t('components.processPanel.SUCCESS'),
              detail: this.$t('success.removed'),
              life: 5000,
            })
          } catch (error) {
            // Restore default value if patch failed
            this.defaultSelectTypeValueId = saveDefaultSelectTypeValueId
            this.$toast.add({
              severity: 'error',
              summary: this.$t('components.processPanel.ERROR'),
              detail: this.$t('components.processPanel.failedNewRun'),
              life: 5000,
            })
          }
        },
      })
    },
    onColorSelect (event, currentOption) {
      currentOption.color = event.value.color
      currentOption.backgroundColor = event.value.backgroundColor
    },
    onRowReorder (event) {
      // To be improved if pagination added
      const sortOptions = []
      event.value.forEach((option, index) => {
        const position = index + 1
        sortOptions.push({ ...option, position })
      })
      this.selectTypeValues = sortOptions
    },
  },
  mounted () {
    if (this.columnToHandle && this.columnToHandle.settings) {
      if (this.columnToHandle.settings.values) {
        // Transform options object to array
        Object.keys(this.columnToHandle.settings.values).map((key) => {
          this.selectTypeValues.push({ id: key, ...this.columnToHandle.settings.values[key] })
        })
        // Sort options
        this.selectTypeValues.sort((a, b) => a.position - b.position)
      }
      if (this.columnToHandle.settings.default) {
        this.defaultSelectTypeValueId = this.columnToHandle.settings.default
      }
    }
  },
  watch: {
    selectTypeValues: {
      handler: function () {
        this.$emit('select-type-values-change', this.selectTypeValues)
      },
      deep: true,
    },
    defaultSelectTypeValueId () {
      this.$emit('default-select-type-value-id-change', this.defaultSelectTypeValueId)
    },
  },
}
</script>

<style scoped>
::v-deep .p-datatable {
  transform: scale(1);
}

::v-deep .select-type-values-table {
  border: 1px solid #ededed;
  border-bottom: 2px solid #ededed;
}

::v-deep .select-type-values-table tbody {
  height: 200px;
  overflow-y: auto;
  display: block;
}

::v-deep .select-type-values-table tr,
.select-type-values-table thead {
  display: table;
  width: 100%;
  table-layout: fixed;
}

::v-deep .select-type-values-table .p-datatable-tbody > tr > td:first-child {
  cursor: move;
}

::v-deep .select-type-values-table .p-datatable-tbody > tr > td:not(:first-child) {
  padding: 0.5rem !important;
}

::v-deep.select-type-values-table .p-datatable-thead > tr > th {
  padding: 0.5rem !important;
}

::v-deep .p-colorpicker-panel {
  display: block !important;
  position: fixed;
  top: 70px !important;
  left: auto !important;
}

::v-deep .p-colorpicker-preview {
  width: 2rem !important;
  height: 2rem !important;
}

::v-deep .single-select-color .p-colorpicker-panel {
  margin-left: 2rem;
}

::v-deep .single-select-background-color .p-colorpicker-panel {
  margin-left: 2rem;
}

::v-deep .p-inputtext {
  width: 100%;
}

.p-column-button-color {
  color: white !important;
}
</style>
