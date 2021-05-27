<template>
  <div>
    <h1 class="lck-color-primary">{{ $t('components.datatable.actionColumn.edit') }}</h1>
    <div class="column-form-container lck-color-content">
      <lck-form
        :displayCancelButton="false"
        :submitting="submitting"
        @submit="submitActionColumnData"
      >
        <div class="p-field">
          <label for="labelButton">{{ $t('pages.workspace.block.labelButton') }}</label>
          <p-input-text
            id="labelButton"
            v-model="actionCopy.label"
          />
        </div>
        <div class="p-field">
          <label for="classButton">{{ $t('pages.workspace.block.classButton.title') }}</label>
          <p-dropdown
            id="classButton"
            v-model="actionCopy.classButton"
            optionLabel="label"
            optionValue="value"
            dataKey="value"
            :options="NAMED_CLASSES"
            :placeholder="$t('components.datatable.placeholder')"
            required
          >
            <template #value="slotProps">
              <div v-if="slotProps.value">
                {{ $t(`pages.workspace.block.classButton.${slotProps.value}`) }}
              </div>
              <span v-else>
            {{ slotProps.placeholder }}
          </span>
            </template>
            <template #option="slotProps">
              {{ $t(`pages.workspace.block.classButton.${slotProps.option.value}`) }}
            </template>
          </p-dropdown>
        </div>
        <div class="p-field">
          <label for="icon">{{ $t('pages.workspace.block.icon') }}</label>
          <p-input-text
            id="icon"
            v-model="actionCopy.icon"
          />
        </div>
        <div class="p-field">
          <label for="action">{{ $t('pages.workspace.block.action.title') }}</label>
          <p-dropdown
            id="action"
            v-model="actionCopy.action"
            optionLabel="label"
            optionValue="value"
            dataKey="value"
            :options="ACTIONS_TYPE"
            :placeholder="$t('components.datatable.placeholder')"
            required
          >
            <template #value="slotProps">
              <div v-if="slotProps.value">
                {{ $t(`pages.workspace.block.action.${slotProps.value}`) }}
              </div>
              <span v-else>
            {{ slotProps.placeholder }}
          </span>
            </template>
            <template #option="slotProps">
              {{ $t(`pages.workspace.block.action.${slotProps.option.value}`) }}
            </template>
          </p-dropdown>
        </div>
        <div
          class="p-field"
          v-if="action === ACTION_BUTTON_TYPE.PROCESS_TRIGGER"
        >
          <label for="processId">{{ $t('pages.workspace.block.processId') }}</label>
          <p-input-text
            id="processId"
            v-model="actionCopy.processId"
            required
          />
        </div>
        <div v-else>
          <div class="p-field">
            <label for="pageDetailId">{{ $t('pages.workspace.block.pageDetailId') }}</label>
            <p-input-text
              id="pageDetailId"
              v-model="actionCopy.pageDetailId"
              required
            />
          </div>
          <div class="p-field">
            <label for="pageQueryFieldId">{{ $t('pages.workspace.block.pageQueryFieldId') }}</label>
            <p-input-text
              id="pageQueryFieldId"
              v-model="actionCopy.pageQueryFieldId"
            />
            <small id="pageQueryFieldId-help">{{ $t('pages.workspace.block.helpPageQueryFieldId') }}</small>
          </div>
        </div>
        <div class="p-field">
          <label for="displayFieldId">{{ $t('pages.workspace.block.options.displayFieldId') }}</label>
          <p-input-text
            id="displayFieldId"
            v-model="actionCopy.displayFieldId"
          />
        </div>
        <div class="p-field">
          <label for="displayFieldConditionQuery">
            {{ $t('pages.workspace.block.options.displayFieldConditionQuery') }}
          </label>
          <p-input-text
            id="displayFieldConditionQuery"
            v-model="actionCopy.displayFieldConditionQuery"
          />
        </div>
      </lck-form>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'

import { ACTION_BUTTON_TYPE } from '@locokit/lck-glossary'

import {
  ACTIONS_TYPE,
  NAMED_CLASSES
} from '@/services/lck-utils/prime'

import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'

import LckForm from '@/components/ui/Form/Form.vue'

export default {
  name: 'ActionColumnForm',
  components: {
    'lck-form': LckForm,
    'p-input-text': Vue.extend(InputText),
    'p-dropdown': Vue.extend(Dropdown)
  },
  props: {
    action: {
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
      NAMED_CLASSES,
      ACTIONS_TYPE,
      ACTION_BUTTON_TYPE,
      actionCopy: null
    }
  },
  methods: {
    submitActionColumnData () {
      this.$emit('action-column-edit', this.actionCopy)
    }
  },
  watch: {
    action: {
      handler (newActionColumnValue) {
        this.actionCopy = { ...newActionColumnValue }
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
</style>
