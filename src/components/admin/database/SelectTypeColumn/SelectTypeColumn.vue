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
    >
      <template #empty>
          {{ $t('pages.databaseSchema.selectType.noData') }}
      </template>
      <p-column
        field="label"
        headerClass="p-col-4"
        bodyClass="p-col-4"
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
            :placeholder="$t('pages.databaseSchema.selectType.selectColor')"
            :value="colorScheme.find(color => color.backgroundColor === props.data.backgroundColor)"
            @change="onColorSelect($event,props.data)"
          >
            <template #value="slotProps">
              <lck-badge
                v-if="slotProps.value"
                :label="props.data.label"
                :backgroundColor="slotProps.value.backgroundColor"
                :color="slotProps.value.color"
              />
            </template>
            <template #option="slotProps">
              <lck-badge
                :label="props.data.label"
                :backgroundColor="slotProps.option.backgroundColor"
                :color="slotProps.option.color"
              />
            </template>
          </p-dropdown>
        </template>
      </p-column>
      <p-column
        field="position"
        headerClass="p-col-2"
        bodyClass="p-col-2"
        :header="$t('pages.databaseSchema.selectType.position')"
      >
        <template #body="props">
          <p-input-number v-model="props.data.position" :min="0" />
        </template>
      </p-column>
      <p-column
        headerClass="p-col-1"
        bodyClass="p-col-1"
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

import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
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
    'p-input-number': Vue.extend(InputNumber),
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
      colorScheme: [
        { name: '24', color: '#484848', backgroundColor: '#cdcdcd' },
        { name: '1', color: '#484848', backgroundColor: '#fffbc2' },
        { name: '2', color: '#484848', backgroundColor: '#ffedc3' },
        { name: '3', color: '#484848', backgroundColor: '#ffe1d2' },
        { name: '4', color: '#484848', backgroundColor: '#ffe4ea' },
        { name: '5', color: '#484848', backgroundColor: '#ffdeff' },
        { name: '6', color: '#484848', backgroundColor: '#e1e0ff' },
        { name: '6', color: '#484848', backgroundColor: '#e3feeb' },
        { name: '8', color: '#484848', backgroundColor: '#e4f7cf' },
        { name: '9', color: '#484848', backgroundColor: '#dffbff' },
        { name: '10', color: '#484848', backgroundColor: '#deedff' },
        { name: '11', color: '#484848', backgroundColor: '#c3d8fa' },
        { name: '12', color: '#484848', backgroundColor: '#ededed' },
        { name: '13', color: '#ffffff', backgroundColor: '#fdda5b' },
        { name: '14', color: '#ffffff', backgroundColor: '#f0b688' },
        { name: '15', color: '#ffffff', backgroundColor: '#f87e8e' },
        { name: '16', color: '#ffffff', backgroundColor: '#e499da' },
        { name: '17', color: '#ffffff', backgroundColor: '#aa7bea' },
        { name: '18', color: '#ffffff', backgroundColor: '#afa2f4' },
        { name: '19', color: '#ffffff', backgroundColor: '#67d187' },
        { name: '20', color: '#ffffff', backgroundColor: '#bae396' },
        { name: '21', color: '#ffffff', backgroundColor: '#99daef' },
        { name: '22', color: '#ffffff', backgroundColor: '#5bd4d5' },
        { name: '23', color: '#ffffff', backgroundColor: '#55b3fe' }
      ]
    }
  },
  methods: {
    addSelectTypeValue () {
      this.selectTypeValues.push({
        id: uuidv4(),
        label: '',
        color: this.colorScheme[0].color,
        backgroundColor: this.colorScheme[0].backgroundColor,
        position: 0
      })
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
    },
    onColorSelect (event, currentOption) {
      currentOption.color = event.value.color
      currentOption.backgroundColor = event.value.backgroundColor
    }
  },
  mounted () {
    if (this.columnToHandle && this.columnToHandle.settings) {
      if (this.columnToHandle.settings.values) {
        Object.keys(this.columnToHandle.settings.values).map((key) => {
          this.selectTypeValues.push({ id: key, ...this.columnToHandle.settings.values[key] })
        })
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
/deep/ .p-datatable {
  transform: scale(1);
}
/deep/ .select-type-values-table {

  border: 1px solid #ededed;
  border-bottom: 2px solid #ededed;
}
/deep/ .select-type-values-table tbody {
  height: 200px;
  overflow-y: auto;
  display: block;
}
/deep/ .select-type-values-table tr, .select-type-values-table thead {
  display: table;
  width: 100%;
  table-layout: fixed;
}

/deep/ .select-type-values-table .p-datatable-tbody > tr > td {
  padding: 0.5rem !important;
}
/deep/.select-type-values-table .p-datatable-thead > tr > th {
  padding: 0.5rem !important;
}
/deep/ .p-colorpicker-panel {
  display: block !important;
  position: fixed;
  top: 70px !important;
  left: auto !important;
}
/deep/ .p-colorpicker-preview {
  width: 2rem !important;
  height: 2rem !important;
}
/deep/ .single-select-color .p-colorpicker-panel {
  margin-left: 2rem;
}
/deep/ .single-select-background-color .p-colorpicker-panel {
  margin-left: 2rem;
}
/deep/ .p-inputtext {
  width: 100%;
}
.p-column-button-color {
  color: white !important;
}
</style>
