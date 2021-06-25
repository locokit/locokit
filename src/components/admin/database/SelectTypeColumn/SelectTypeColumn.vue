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
          <p-input-text v-model="props.data.label" type="text" />
        </template>
      </p-column>
      <p-column
        field="color"
        headerClass="p-col-4"
        bodyClass="p-col-4"
        :header="$t('pages.databaseSchema.selectType.color')"
      >
        <template #body="props">
          <p-dropdown
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
        </template>
      </p-column>
      <p-column
        headerClass="p-col-2"
        bodyClass="p-col-2"
        bodyStyle="text-align: center"
      >
        <template #body="props">
          <p-button
            icon="pi pi-trash"
            class="p-button-rounded lck-color-content p-column-button-color"
            @click="handleDeleteColumnModalVisibility(true, props.data)"
          />
        </template>
      </p-column>
    </p-datatable>
    <div class="p-mt-2 p-fluid">
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
    </div>
    <lck-dialog-form
      :visible="showDeleteColumnModal"
      :header="$t('pages.databaseSchema.selectType.deleteValue')"
      @close="handleDeleteColumnModalVisibility(false, null)"
      @input="deleteSelectTypeValue"
    >
      {{
        currentSelectTypeValue
        && $t('pages.databaseSchema.selectType.deleteConfirmation', { label: currentSelectTypeValue.label })
      }}
    </lck-dialog-form>
  </div>
</template>

<script>
import Vue from 'vue'

import { v4 as uuidv4 } from 'uuid'

import { COLOR_SCHEME } from '@/services/lck-utils/color'

import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'

import DialogForm from '@/components/ui/DialogForm/DialogForm.vue'
import Badge from '@/components/ui/Badge/Badge'

export default {
  name: 'SelectTypeColumn',
  components: {
    'p-input-text': Vue.extend(InputText),
    'p-dropdown': Vue.extend(Dropdown),
    'p-datatable': Vue.extend(DataTable),
    'p-column': Vue.extend(Column),
    'p-button': Vue.extend(Button),
    'lck-dialog-form': DialogForm,
    'lck-badge': Badge
  },
  props: {
    columnToHandle: {
      type: Object,
      required: false
    }
  },
  data () {
    return {
      selectTypeValues: [],
      defaultSelectTypeValueId: null,
      showDeleteColumnModal: false,
      currentSelectTypeValue: null,
      colorScheme: COLOR_SCHEME
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
        position: this.selectTypeValues.length > 0 ? Math.max(...this.selectTypeValues.map(({ position }) => position)) + 1 : 1
      })
      // Scroll to last td
      const lastTr = this.$el.querySelector('.select-type-values-table tbody tr:last-child')
      lastTr.scrollIntoView({ behavior: 'smooth' })
      // Add focus on first input in the row
      lastTr.querySelector('td input').focus()
    },
    handleDeleteColumnModalVisibility (visibility, data) {
      this.currentSelectTypeValue = data
      this.showDeleteColumnModal = visibility
    },
    deleteSelectTypeValue () {
      const selectTypeValueIndex = this.selectTypeValues.findIndex(
        (selectTypeValue) => selectTypeValue.id === this.currentSelectTypeValue.id
      )
      if (this.defaultSelectTypeValueId === this.currentSelectTypeValue.id) {
        this.defaultSelectTypeValueId = null
      }
      this.selectTypeValues.splice(selectTypeValueIndex, 1)

      this.handleDeleteColumnModalVisibility(false, null)

      // Keep position with continuous numbering
      for (let index = 0; index <= this.selectTypeValues.length; index++) {
        const currentRow = this.selectTypeValues[index]
        currentRow.position = index + 1
      }
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
    }
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
      deep: true
    },
    defaultSelectTypeValueId () {
      this.$emit('default-select-type-value-id-change', this.defaultSelectTypeValueId)
    }
  }
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

::v-deep .select-type-values-table tr, .select-type-values-table thead {
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
