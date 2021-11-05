<template>
  <lck-form
    @cancel="$emit('cancel')"
    @submit="$emit('input', newWorkspace)"
    :submitting="submitting"
  >
    <validation-provider
      vid="text"
      tag="div"
      class="p-field"
      :name="$t('components.workspaceForm.fields.textLabel')"
      rules="required"
      v-slot="{
        errors,
        classes
      }"
    >
      <label for="text" class="label-field-required">
        {{$t('components.workspaceForm.fields.textLabel')}}
      </label>
      <p-input-text
        id="text"
        :placeholder="$t('components.workspaceForm.fields.textPlaceholder')"
        autofocus
        v-model="newWorkspace.text"
      />
      <span :class="classes">{{ errors[0] }}</span>
    </validation-provider>

    <validation-provider
      vid="text"
      tag="div"
      class="p-field"
      :name="$t('components.workspaceForm.fields.textLabel')"
      v-slot="{
        errors,
        classes
      }"
    >
      <label for="documentation">
        {{ $t('components.workspaceForm.fields.docLabel') }}
      </label>
      <p-textarea
        id="documentation"
        :placeholder="$t('components.workspaceForm.fields.docPlaceholder')"
        class="p-mb-2"
        :autoResize="true"
        v-model="newWorkspace.documentation"
      />
      <span :class="classes">{{ errors[0] }}</span>
    </validation-provider>

    <validation-provider
      vid="color"
      tag="div"
      class="p-field"
      :name="$t('components.workspaceForm.fields.colorLabel')"
      v-slot="{
        errors,
        classes
      }"
    >
      <label for="color">
        {{ $t('components.workspaceForm.fields.colorLabel') }}
      </label>
      <p-dropdown
        id="color"
        :options="colorScheme"
        dataKey="backgroundColor"
        appendTo="body"
        :showClear="true"
        :placeholder="$t('components.workspaceForm.fields.colorPlaceholder')"
        :value="newWorkspaceColorScheme"
        @change="onColorSelect($event)"
      >
        <template #value="slotProps">
          <lck-badge
            v-if="slotProps.value"
            :label="$t('components.workspaceForm.fields.colorLabel') + ' ' + slotProps.value.backgroundColor"
            :color="slotProps.value.color"
            :backgroundColor="slotProps.value.backgroundColor"
          />
        </template>
        <template #option="slotProps">
          <lck-badge
            :label="$t('components.workspaceForm.fields.colorLabel') + ' ' + slotProps.option.backgroundColor"
            :color="slotProps.option.color"
            :backgroundColor="slotProps.option.backgroundColor"
          />
        </template>
      </p-dropdown>
      <small id="color">{{ $t('components.workspaceForm.fields.colorHelp') }}</small>
      <span :class="classes">{{ errors[0] }}</span>
    </validation-provider>

    <validation-provider
      vid="icon"
      tag="div"
      class="p-field"
      :name="$t('components.workspaceForm.fields.iconLabel')"
      v-slot="{
        errors,
        classes
      }"
    >
      <label for="icon">
        {{ $t('components.workspaceForm.fields.iconLabel') }}
      </label>
      <p-input-text
        id="icon"
        :placeholder="$t('components.workspaceForm.fields.iconPlaceholder')"
        v-model="newWorkspace.settings.icon"
      />
      <small id="icon">{{ $t('components.workspaceForm.fields.iconHelp') }} <a href="https://icons.getbootstrap.com/" target="_blank" ref="noopener">Bootstrap Icon</a>.</small>
      <span :class="classes">{{ errors[0] }}</span>
    </validation-provider>
  </lck-form>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'

import { LckWorkspace } from '@/services/lck-api/definitions'
import Form from '@/components/ui/Form/Form.vue'
import { ColorScheme, COLOR_SCHEME } from '@/services/lck-utils/color'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import { ValidationProvider } from 'vee-validate'

import Badge from '@/components/ui/Badge/Badge.vue'

export default {
  name: 'WorkspaceForm',
  components: {
    'lck-form': Form,
    'lck-badge': Vue.extend(Badge),
    'p-dropdown': Vue.extend(Dropdown),
    'p-input-text': Vue.extend(InputText),
    'p-textarea': Vue.extend(Textarea),
    'validation-provider': Vue.extend(ValidationProvider),
  },
  props: {
    submitting: {
      type: Boolean,
      default: false,
    },
    workspace: {
      type: Object,
      required: false,
    } as PropOptions<LckWorkspace>,
  },
  data () {
    return {
      newWorkspace: new LckWorkspace(),
      colorScheme: COLOR_SCHEME,
      newWorkspaceColorScheme: null as ColorScheme | null | undefined,
    }
  },
  methods: {
    onColorSelect (event: { value: ColorScheme | null}) {
      this.newWorkspaceColorScheme = event.value
      if (event.value) {
        if (!this.newWorkspace.settings) {
          this.newWorkspace.settings = {}
        }
        this.newWorkspace.settings.color = event.value.color
        this.newWorkspace.settings.backgroundColor = event.value.backgroundColor
      } else {
        if (this.newWorkspace.settings) {
          this.newWorkspace.settings.color = null
          this.newWorkspace.settings.backgroundColor = null
        }
      }
    },
  },
  watch: {
    workspace: {
      handler (newValue: LckWorkspace) {
        if (!newValue) return
        this.newWorkspace = {
          ...newValue,
        }
        this.newWorkspaceColorScheme = COLOR_SCHEME.find(c => c.backgroundColor === this.newWorkspace.settings?.backgroundColor)
      },
      immediate: true,
    },
  },
}
</script>

<style>

</style>
