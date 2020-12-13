<template>
  <div>
    <div class="p-d-flex">
      <div class="p-ai-start p-my-4">
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
      :scrollable="true"
      scrollHeight="200px"
    >
      <template #empty>
          {{ $t('pages.databaseSchema.selectType.noData') }}
      </template>
      <p-column
        field="label"
        :header="$t('pages.databaseSchema.selectType.label')"
      >
        <template #body="props">
          <p-input-text v-model="props.data.label" type="text" />
        </template>
      </p-column>
      <p-column
        field="color"
        :header="$t('pages.databaseSchema.selectType.color')"
      >
        <template #body="props">
          <p-color-picker
            v-model="props.data.color"
            class="single-select-color"
            :inline="false"
          />
        </template>
      </p-column>
      <p-column
        field="backgroundColor"
        :header="$t('pages.databaseSchema.selectType.backgroundColor')"
      >
        <template #body="props">
          <p-color-picker
            v-model="props.data.backgroundColor"
            class="single-select-background-color"
            :inline="false"
          />
        </template>
      </p-column>
      <p-column
        field="position"
        :header="$t('pages.databaseSchema.selectType.position')"
      >
        <template #body="props">
          <p-input-number v-model="props.data.position" :min="0" />
        </template>
      </p-column>
      <p-column>
        <template #body="props">
          <p-button
            icon="pi pi-trash"
            class="p-button-rounded lck-color-content p-column-button-color"
            @click="handleDeleteColumnModalVisibility(true, props.data)"
          />
        </template>
      </p-column>
    </p-datatable>
    <div class="p-d-flex">
      <div class="p-ai-start p-mt-2">
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
    </div>
    <lck-dialog
      :visible="showDeleteColumnModal"
      :header="$t('pages.databaseSchema.selectType.deleteValue')"
      @close="handleDeleteColumnModalVisibility(false, null)"
      @input="deleteSelectTypeValue"
    >
      {{
        currentSelectTypeValue
        && $t('pages.databaseSchema.selectType.deleteConfirmation', { label: currentSelectTypeValue.label })
      }}
    </lck-dialog>
  </div>
</template>
<script>
import Vue from 'vue'
import { v4 as uuidv4 } from 'uuid'
import InputText from 'primevue/inputtext'
import ColorPicker from 'primevue/colorpicker'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from '@/components/ui/Dialog/Dialog.vue'

export default {
  name: 'SelectTypeColumn',
  components: {
    'p-input-text': Vue.extend(InputText),
    'p-color-picker': Vue.extend(ColorPicker),
    'p-input-number': Vue.extend(InputNumber),
    'p-dropdown': Vue.extend(Dropdown),
    'p-datatable': Vue.extend(DataTable),
    'p-column': Vue.extend(Column),
    'p-button': Vue.extend(Button),
    'lck-dialog': Vue.extend(Dialog)
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
      currentSelectTypeValue: null
    }
  },
  methods: {
    addSelectTypeValue () {
      this.selectTypeValues.push({
        id: uuidv4(),
        label: '',
        color: 'ff0000',
        backgroundColor: 'ff0000',
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
/deep/ .p-datatable-scrollable-body {
  height: 200px;
}
/deep/ .p-colorpicker-panel {
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
