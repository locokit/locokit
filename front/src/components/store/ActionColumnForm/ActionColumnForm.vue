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
          <label for="action" class="label-field-required">{{ $t('pages.workspace.block.actionButton.trigger.type') }}</label>
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
            <label for="processId" class="label-field-required">{{ $t('pages.workspace.block.actionButton.processId') }}</label>
            <p-dropdown
              id="processId"
              :options="transformProcesses"
              optionValue="value"
              optionLabel="text"
              dataKey="value"
              :placeholder="$t('components.datatable.placeholder')"
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
            <lck-autocomplete
              id="pageRedirectId"
              v-model="page"
              field="text"
              :dropdown="true"
              :suggestions="autocompleteSuggestions"
              @item-select="actionCopy.pageRedirectId = $event.value.value"
              @search="getSuggestionPage($event.query)"
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
            <label for="pageDetailId" class="label-field-required">{{ $t('pages.workspace.block.actionButton.pageDetailId') }}</label>
            <lck-autocomplete
              id="pageDetailId"
              v-model="page"
              field="text"
              :dropdown="true"
              :suggestions="autocompleteSuggestions"
              @item-select="actionCopy.pageDetailId = $event.value.value"
              @search="getSuggestionPage($event.query)"
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
          <lck-autocomplete
            id="displayFieldId"
            v-model="columnActionCondition"
            field="text"
            :dropdown="true"
            :suggestions="autocompleteSuggestions"
            @item-select="actionCopy.displayFieldId = $event.value.value"
            @search="$emit('search-columns-from-table-view', { query: $event.query })"
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
        <p-panel
          v-if="actionCopy.action === ACTION_BUTTON_TYPE.PROCESS_TRIGGER"
          :header="$t('pages.workspace.block.actionButton.notification.settings')"
          :toggleable="true"
          :collapsed="true"
          class="p-mb-4"
        >
          <p>{{ $t('pages.workspace.block.actionButton.notification.explain') }}</p>
          <div
            class="lck-color-content p-text-bold"
          >
            <p class="lck-separator">{{ $t('pages.workspace.block.actionButton.notification.success.info') }}</p>
            <validation-provider
              vid="notificationSuccessTitle"
              tag="div"
              class="p-field"
            >
              <label for="notificationSuccessTitle">{{ $t('pages.workspace.block.actionButton.notification.success.title') }}</label>
              <p-input-text
                id="notificationSuccessTitle"
                v-model="actionCopy.notificationSuccessTitle"
              />
            </validation-provider>
            <validation-provider
              vid="notificationSuccessDescription"
              tag="div"
              class="p-field"
            >
              <label for="notificationSuccessDescription">{{
                  $t('pages.workspace.block.actionButton.notification.success.description')
                }}</label>
              <p-input-text
                id="notificationSuccessDescription"
                v-model="actionCopy.notificationSuccessDescription"
              />
            </validation-provider>
            <p class="lck-separator">{{ $t('pages.workspace.block.actionButton.notification.error.info') }}</p>
            <validation-provider
              vid="notificationErrorTitle"
              tag="div"
              class="p-field"
            >
              <label for="notificationErrorTitle">{{ $t('pages.workspace.block.actionButton.notification.error.title') }}</label>
              <p-input-text
                id="notificationErrorTitle"
                v-model="actionCopy.notificationErrorTitle"
              />
            </validation-provider>
            <validation-provider
              vid="notificationErrorDescription"
              tag="div"
              class="p-field"
            >
              <label for="notificationErrorDescription">{{
                  $t('pages.workspace.block.actionButton.notification.error.description')
                }}</label>
              <p-input-text
                id="notificationErrorDescription"
                v-model="actionCopy.notificationErrorDescription"
              />
            </validation-provider>
          </div>
        </p-panel>
      </lck-form>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue, { PropOptions } from 'vue'

import { ACTION_BUTTON_TYPE } from '@locokit/lck-glossary/src'
import { ValidationProvider } from 'vee-validate'

import {
  ACTIONS_TYPE,
  NAMED_CLASSES,
} from '@/services/lck-utils/prime'
import { LckTableAction } from '@/services/lck-api/definitions'
import { ROUTES_NAMES } from '@/router/paths'

import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Panel from 'primevue/panel'
import RadioButton from 'primevue/radiobutton'

import LckForm from '@/components/ui/Form/Form.vue'
import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'
import { lckServices } from '@/services/lck-api'
import { getPageWithChapters } from '@/services/lck-api/helpers'

export default {
  name: 'ActionColumnForm',
  components: {
    'lck-form': LckForm,
    'lck-autocomplete': AutoComplete,
    'p-input-text': Vue.extend(InputText),
    'p-radio-button': Vue.extend(RadioButton),
    'p-panel': Vue.extend(Panel),
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
    manualProcesses: {
      type: Array,
      default: () => ([]),
    },
    autocompleteSuggestions: {
      type: Array,
      default: () => ([]),
    } as PropOptions<{ label: string; value: string }[]>,
  },
  data () {
    return {
      ROUTES_NAMES,
      NAMED_CLASSES,
      ACTIONS_TYPE,
      ACTION_BUTTON_TYPE,
      actionCopy: null,
      columnActionCondition: null,
      page: null,
      processes: [],
    }
  },
  computed: {
    transformProcesses () {
      return this.manualProcesses.map(process => ({
        text: process.text,
        value: process.id,
      }))
    },
  },
  methods: {
    submitActionColumnData () {
      this.$emit('action-column-edit', this.actionCopy)
    },
    getColumns (columnId: string) {
      return lckServices.tableColumn.get(columnId)
    },
    getSuggestionPage (query) {
      if (this.actionCopy.typePageTo === ROUTES_NAMES.PAGEDETAIL || this.actionCopy.action === ACTION_BUTTON_TYPE.PAGE_DETAIL_TO) {
        this.$emit('search-page', { query: query, filters: { hidden: true } })
      } else {
        this.$emit('search-page', { query: query })
      }
    },
  },
  watch: {
    action: {
      async handler (newActionColumnValue: LckTableAction) {
        this.actionCopy = { ...newActionColumnValue }
        if (newActionColumnValue.action === ACTION_BUTTON_TYPE.PROCESS_TRIGGER) {
          const res = await getPageWithChapters(newActionColumnValue.pageRedirectId)
          this.page = {
            text: `[${res?.chapter?.text}] ${res.text}`,
            value: res.id,
          }
        } else {
          const res = await getPageWithChapters(newActionColumnValue.pageDetailId)
          this.page = {
            text: `[${res?.chapter?.text}] ${res.text}`,
            value: res.id,
          }
        }
        this.columnActionCondition = newActionColumnValue.displayFieldId && await this.getColumns(newActionColumnValue.displayFieldId)
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
