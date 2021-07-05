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
          class="p-field action-trigger"
          v-if="actionCopy.action === ACTION_BUTTON_TYPE.PROCESS_TRIGGER"
        >
          <label for="processId">{{ $t('pages.workspace.block.processId') }}</label>
          <p-input-text
            id="processId"
            v-model="actionCopy.processId"
            required
          />
          <span>{{ $t('pages.workspace.block.typePageTo') }}</span>
          <div>
            <div class="p-field-radiobutton">
              <p-radio-button
                :id="ROUTES_NAMES.PAGE"
                :name="ROUTES_NAMES.PAGE"
                :value="ROUTES_NAMES.PAGE"
                v-model="actionCopy.typePageTo"
              />
              <label :for="ROUTES_NAMES.PAGE">{{ $t('pages.workspace.block.page')  }}</label>
            </div>
            <div class="p-field-radiobutton">
              <p-radio-button
                :id="ROUTES_NAMES.PAGEDETAIL"
                :name="ROUTES_NAMES.PAGEDETAIL"
                :value="ROUTES_NAMES.PAGEDETAIL"
                v-model="actionCopy.typePageTo"
              />
              <label :for="ROUTES_NAMES.PAGEDETAIL">{{ $t('pages.workspace.block.pageDetail')  }}</label>
            </div>
          </div>
          <label for="pageRedirectId">{{ $t('pages.workspace.block.pageId') }}</label>
          <p-input-text
            id="pageRedirectId"
            v-model="actionCopy.pageRedirectId"
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
  NAMED_CLASSES,
} from '@/services/lck-utils/prime'
import { ROUTES_NAMES } from '@/router/paths'

import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import RadioButton from 'primevue/radiobutton'

import LckForm from '@/components/ui/Form/Form.vue'

export default {
  name: 'ActionColumnForm',
  components: {
    'lck-form': LckForm,
    'p-input-text': Vue.extend(InputText),
    'p-radio-button': Vue.extend(RadioButton),
    'p-dropdown': Vue.extend(Dropdown),
  },
  props: {
    action: {
      type: Object,
      default: () => ({}),
    },
    submitting: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      ROUTES_NAMES,
      NAMED_CLASSES,
      ACTIONS_TYPE,
      ACTION_BUTTON_TYPE,
      actionCopy: null,
    }
  },
  methods: {
    submitActionColumnData () {
      this.$emit('action-column-edit', this.actionCopy)
    },
  },
  watch: {
    action: {
      handler (newActionColumnValue) {
        this.actionCopy = { ...newActionColumnValue }
      },
      immediate: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.action-trigger {
  > div {
    display: flex;
    flex-direction: row;
    > div {
      padding-right: 1rem;
    }
  }
  > span {
    display: block;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
}
</style>
