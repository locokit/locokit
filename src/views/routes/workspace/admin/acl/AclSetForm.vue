<template>
  <lck-form :displayCancelButton="false">
    <validation-provider
      vid="label"
      tag="div"
      :name="$t('pages.acl.label')"
      class="p-field"
      rules="required"
      v-slot="{ errors, classes }"
    >
      <label
        class="label-field-required"
        for="label"
      >
        {{ $t("pages.acl.label") }}
      </label>
      <div class="">
        <p-input-text
          id="label"
          v-model="aclSetCopy.label"
        />
      </div>
      <span :class="classes" class="p-my-2">{{ errors[0] }}</span>
    </validation-provider>
    <validation-provider
      vid="manager"
      tag="div"
      :name="$t('pages.acl.manager')"
      class="p-field"
      rules="required"
      v-slot="{ errors, classes }"
    >
      <label
        class="label-field-required"
        for="manager"
      >
        {{ $t("pages.acl.manager") }}
      </label>
      <div class="">
        <p-checkbox
          id="manager"
          v-model="aclSetCopy.manager"
          :binary="true"
        />
      </div>
      <span :class="classes" class="p-my-2">{{ errors[0] }}</span>
    </validation-provider>
    <validation-provider
      vid="chapter"
      tag="div"
      :name="$t('pages.acl.chapter')"
      class="p-field"
      v-slot="{ errors, classes }"
    >
      <label
        class="label-field-required"
        for="chapter"
      >
        {{ $t("pages.acl.chapter") }}
      </label>
      <lck-autocomplete
        id="chapter"
        :placeholder="$t('components.datatable.placeholder')"
        field="text"
        :suggestions="chapterSuggestions"
        @search="$emit('search-chapter', $event.query)"
        v-model="aclSetCopy.chapter"
        @item-select="aclSetCopy.chapter_id = $event.value.id"
        @clear="alcSetCopy.chapter_id = null"
      />
      <span :class="classes" class="p-my-2">{{ errors[0] }}</span>
    </validation-provider>
  </lck-form>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */

import { cloneDeep } from 'lodash'
import { ValidationProvider } from 'vee-validate'
import Vue from 'vue'

import InputText from 'primevue/inputtext/'

import { LckAclSet } from '@/services/lck-api/definitions'

import Form from '@/components/ui/Form/Form.vue'
import Checkbox from 'primevue/checkbox/'
import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'

export default {
  name: 'AclSetForm',
  components: {
    'p-input-text': Vue.extend(InputText),
    'p-checkbox': Vue.extend(Checkbox),
    'validation-provider': Vue.extend(ValidationProvider),
    'lck-autocomplete': AutoComplete,
    'lck-form': Form,
  },
  props: {
    aclSet: {
      type: LckAclSet,
      default: null,
    },
    workspaceId: {
      type: String,
      required: true,
    },
    chapterSuggestions: {
      type: Array,
      default: () => [],
    },
  },
  data (): {
    aclSetCopy: LckAclSet | null;
    } {
    return {
      aclSetCopy: null,
    }
  },
  methods: {
  },
  watch: {
    aclSet: {
      immediate: true,
      handler (newValue: LckAclSet | null) {
        if (newValue) {
          // On update
          this.aclSetCopy = cloneDeep(newValue)
        } else {
          // On creation
          this.aclSetCopy = {
            label: '',
            workspace_id: this.workspaceId,
            manager: false,
            id: '',
          }
        }
      },
    },
  },
}
</script>

<style>
</style>
