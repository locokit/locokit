<template>
  <div>
    <h1 class="lck-color-primary">{{ $t('components.datatable.actionColumn.edit') }}</h1>
    <div class="column-form-container lck-color-content">
      <lck-form
        :displayCancelButton="false"
        :submitting="submitting"
        @submit="submitActionColumnData"
      >
        <validation-provider
          vid="labelButton"
          tag="div"
          class="p-field"
        >
          <label for="labelButton">{{ $t('pages.workspace.block.labelButton') }}</label>
          <p-input-text
            id="labelButton"
            v-model="actionCopy.label"
          />
        </validation-provider>
        <validation-provider
          vid="classButton"
          tag="div"
          class="p-field"
        >
          <label for="classButton">{{ $t('pages.workspace.block.classButton.title') }}</label>
          <p-dropdown
            id="classButton"
            v-model="actionCopy.classButton"
            optionLabel="label"
            optionValue="value"
            dataKey="value"
            :options="NAMED_CLASSES"
            :placeholder="$t('components.datatable.placeholder')"
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
        </validation-provider>
        <validation-provider
          vid="icon"
          tag="div"
          class="p-field"
        >
          <label for="icon">{{ $t('pages.workspace.block.actionButton.icon') }}</label>
          <p-input-text
            id="icon"
            v-model="actionCopy.icon"
          />
        </validation-provider>
        <validation-provider
          vid="action"
          tag="div"
          class="p-field"
          :name="$t('pages.workspace.block.actionButton.trigger.type')"
          rules="required"
          v-slot="{
            errors,
            classes
          }"
        >
          <label for="action">{{ $t('pages.workspace.block.actionButton.trigger.type') }}</label>
          <span class="field-required">*</span>
          <p-dropdown
            id="action"
            v-model="actionCopy.action"
            optionLabel="label"
            optionValue="value"
            dataKey="value"
            :options="ACTIONS_TYPE"
            :placeholder="$t('components.datatable.placeholder')"
          >
            <template #value="slotProps">
              <div v-if="slotProps.value">
                {{ $t(`pages.workspace.block.actionButton.trigger.${slotProps.value}`) }}
              </div>
              <span v-else>
                {{ slotProps.placeholder }}
              </span>
            </template>
            <template #option="slotProps">
              {{ $t(`pages.workspace.block.actionButton.trigger.${slotProps.option.value}`) }}
            </template>
          </p-dropdown>
          <span :class="classes">{{ errors[0] }}</span>
        </validation-provider>
        <div
          class="p-field"
          v-if="actionCopy.action === ACTION_BUTTON_TYPE.PROCESS_TRIGGER"
        >
          <validation-provider
            vid="processId"
            class="p-field"
            tag="div"
            :name="$t('pages.workspace.block.actionButton.processId')"
            rules="required"
            v-slot="{
              errors,
              classes
            }"
          >
            <label for="processId">{{ $t('pages.workspace.block.actionButton.processId') }}</label>
            <span class="field-required">*</span>
            <p-input-text
              id="processId"
              v-model="actionCopy.processId"
            />
            <span :class="classes">{{ errors[0] }}</span>
          </validation-provider>
          <div class="p-field">
            <span class="p-d-flex p-mb-2">{{ $t('pages.workspace.block.actionButton.typePageTo') }}</span>
            <validation-provider
              :vid="ROUTES_NAMES.PAGE"
              tag="div"
              class="p-field-radiobutton"
            >
              <p-radio-button
                :id="ROUTES_NAMES.PAGE"
                :name="ROUTES_NAMES.PAGE"
                :value="ROUTES_NAMES.PAGE"
                v-model="actionCopy.typePageTo"
              />
              <label :for="ROUTES_NAMES.PAGE">{{ $t('pages.workspace.block.actionButton.page') }}</label>
            </validation-provider>
            <validation-provider
              :vid="ROUTES_NAMES.PAGEDETAIL"
              tag="div"
              class="p-field-radiobutton"
            >
              <p-radio-button
                :id="ROUTES_NAMES.PAGEDETAIL"
                :name="ROUTES_NAMES.PAGEDETAIL"
                :value="ROUTES_NAMES.PAGEDETAIL"
                v-model="actionCopy.typePageTo"
              />
              <label :for="ROUTES_NAMES.PAGEDETAIL">{{ $t('pages.workspace.block.actionButton.pageDetail') }}</label>
            </validation-provider>
          </div>
          <validation-provider
            vid="pageRedirectId"
            tag="div"
            class="p-field"
          >
            <label for="pageRedirectId">{{ $t('pages.workspace.block.actionButton.pageId') }}</label>
            <p-input-text
              id="pageRedirectId"
              v-model="actionCopy.pageRedirectId"
            />
          </validation-provider>
        </div>
        <div v-else>
          <validation-provider
            vid="pageDetailId"
            tag="div"
            class="p-field"
            :name="$t('pages.workspace.block.actionButton.pageDetailId')"
            rules="required"
            v-slot="{
              errors,
              classes
            }"
          >
            <label for="pageDetailId">{{ $t('pages.workspace.block.actionButton.pageDetailId') }}</label>
            <span class="field-required">*</span>
            <p-input-text
              id="pageDetailId"
              v-model="actionCopy.pageDetailId"
            />
            <span :class="classes">{{ errors[0] }}</span>
          </validation-provider>
          <validation-provider
            vid="pageQueryFieldId"
            tag="div"
            class="p-field"
          >
            <label for="pageQueryFieldId">{{ $t('pages.workspace.block.actionButton.pageQueryFieldId') }}</label>
            <p-input-text
              id="pageQueryFieldId"
              v-model="actionCopy.pageQueryFieldId"
            />
            <small id="pageQueryFieldId-help">{{ $t('pages.workspace.block.actionButton.helpPageQueryFieldId') }}</small>
          </validation-provider>
        </div>
        <validation-provider
          vid="displayFieldId"
          tag="div"
          class="p-field"
        >
          <label for="displayFieldId">{{ $t('pages.workspace.block.actionButton.displayFieldId') }}</label>
          <p-input-text
            id="displayFieldId"
            v-model="actionCopy.displayFieldId"
          />
        </validation-provider>
        <validation-provider
          vid="displayFieldConditionQuery"
          tag="div"
          class="p-field"
        >
          <label for="displayFieldConditionQuery">
            {{ $t('pages.workspace.block.actionButton.displayFieldConditionQuery') }}
          </label>
          <p-input-text
            id="displayFieldConditionQuery"
            v-model="actionCopy.displayFieldConditionQuery"
          />
        </validation-provider>
      </lck-form>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'

import { ACTION_BUTTON_TYPE } from '@locokit/lck-glossary'
import { ValidationProvider } from 'vee-validate'

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
    'validation-provider': Vue.extend(ValidationProvider),
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
