<template>
  <lck-form
    :displayCancelButton="false"
    :fullWidthButton="true"
    :labelButtonSave="$t('components.signup.signup')"
    :submitting="loading"
    @submit="$emit('submit', user)"
  >
    <validation-provider
      :name="$t('components.signup.name')"
      rules="required"
      tag="div"
      vid="name"
      v-slot="{ errors, classes }"
    >
      <label for="name">
        {{ $t("components.signup.name") }}
      </label>

      <p-input-text
        id="name"
        v-model="user.name"
        autofocus
        :placeholder="$t('components.signup.name')"
        required
      />
      <span :class="classes">{{ errors[0] }}</span>
    </validation-provider>

    <validation-provider
      class="p-my-3"
      :name="$t('components.signup.email')"
      rules="required|email"
      tag="div"
      vid="email"
      v-slot="{ errors, classes }"
    >
      <label for="email">
        {{ $t("components.signup.email") }}
      </label>
      <p-input-text
        id="email"
        v-model="user.email"
        :placeholder="$t('components.signup.email')"
        required
      />
      <span :class="classes">{{ errors[0] }}</span>
    </validation-provider>

    <p class="invalid" v-if="error">{{ $t(`error.http.${error.code}`) }}</p>
  </lck-form>
</template>

<script lang="ts">
import Vue from 'vue'

import InputText from 'primevue/inputtext'
import { ValidationProvider } from 'vee-validate'

import LckForm from '@/components/ui/Form/Form.vue'

export default Vue.extend({
  name: 'LckSignUp',
  props: {
    error: {
      type: Error,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data (): {
    user: {
      email: string;
      name: string;
    };
    } {
    return {
      user: {
        email: '',
        name: '',
      },
    }
  },
  components: {
    'p-input-text': Vue.extend(InputText),
    'validation-provider': Vue.extend(ValidationProvider),
    'lck-form': LckForm,
  },
})
</script>

<style scoped>
.invalid {
  color: var(--color-error);
}
</style>
