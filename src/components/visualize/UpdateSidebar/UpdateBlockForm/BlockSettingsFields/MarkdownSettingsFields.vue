<template>
  <div>
    <validation-provider
      vid="blockSettingsContent"
      tag="div"
      :name="$t('pages.workspace.block.content')"
      class="p-field"
      rules="required"
      v-slot="{
        errors,
        classes
      }"
    >
      <label for="blockSettingsContent" class="label-field-required">{{ $t('pages.workspace.block.content') }}</label>
      <p-textarea
        id="blockSettingsContent"
        :value="content"
        :autoResize="true"
        @input="$emit('update:content', $event)"
      />
      <span :class="classes">{{ errors[0] }}</span>
    </validation-provider>
    <validation-provider
      vid="textColor"
      tag="div"
      class="p-field"
    >
      <label for="textColor">{{ $t('pages.workspace.block.markdownField.textColor') }}</label>
      <p-dropdown
        id="textColor"
        :value="textColor"
        @input="$emit('update:textColor', $event)"
        optionLabel="label"
        optionValue="value"
        dataKey="value"
        :options="EXTENDED_NAMED_CLASSES"
        :placeholder="$t('components.datatable.placeholder')"
        :showClear="true"
      >
        <template #value="slotProps">
          <div v-if="slotProps.value">
            {{ $t(`common.colorClass.${slotProps.value}`) }}
          </div>
          <span v-else>
            {{slotProps.placeholder}}
          </span>
        </template>
        <template #option="slotProps">
          {{ $t(`common.colorClass.${slotProps.option.value}`) }}
        </template>
      </p-dropdown>
    </validation-provider>
    <validation-provider
      vid="textAlign"
      tag="div"
      class="p-field"
    >
      <label for="textAlign">{{ $t('pages.workspace.block.markdownField.textAlign') }}</label>
      <p-dropdown
        id="textAlign"
        :value="textAlign"
        @input="$emit('update:textAlign', $event)"
        optionLabel="label"
        optionValue="value"
        dataKey="value"
        :options="TEXT_ALIGN_CLASS"
        :placeholder="$t('components.datatable.placeholder')"
        :showClear="true"
      >
        <template #value="slotProps">
          <div v-if="slotProps.value">
            {{ $t(`common.alignClass.${slotProps.value}`) }}
          </div>
          <span v-else>
            {{slotProps.placeholder}}
          </span>
        </template>
        <template #option="slotProps">
          {{ $t(`common.alignClass.${slotProps.option.value}`) }}
        </template>
      </p-dropdown>
    </validation-provider>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { ValidationProvider } from 'vee-validate'

import { EXTENDED_NAMED_CLASSES, TEXT_ALIGN_CLASS } from '@/services/lck-utils/prime'

import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'

export default {
  name: 'MarkdownSettingsFields',
  components: {
    'p-textarea': Vue.extend(Textarea),
    'p-dropdown': Vue.extend(Dropdown),
    'validation-provider': Vue.extend(ValidationProvider),
  },
  props: {
    content: {
      type: String,
    },
    textColor: {
      type: String,
    },
    textAlign: {
      type: String,
    },
  },
  data () {
    return {
      EXTENDED_NAMED_CLASSES,
      TEXT_ALIGN_CLASS,
    }
  },
}
</script>

<style scoped>
.p-field textarea {
  resize: vertical;
}
</style>
