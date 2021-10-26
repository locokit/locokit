<template>
  <div>
    <div
      v-for="rule in restrictedValidationRules"
      :key="rule.id"
    >
      <validation-provider
        class="rule-enable"
        tag="div"
        :vid="`${rule.id}-enable`"
      >
        <p-checkbox
          :binary="true"
          class="p-mr-2"
          :id="`${rule.id}-enable`"
          :modelValue="columnValidation[rule.id] != null"
          name="rule-enable"
          @input="enableRule(rule, $event)"
        />
        <label :for="`${rule.id}-enable`">{{ rule.text }}</label>
      </validation-provider>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue, { PropOptions } from 'vue'

import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { ValidationProvider } from 'vee-validate'

import Checkbox from 'primevue/checkbox'

import {
  LckTableColumnValidation,
} from '@/services/lck-api/definitions'

import i18n from '@/plugins/i18n'

enum ValidationValue {
  BOOLEAN,
}

class ValidationRule {
  columnTypes: Set<COLUMN_TYPE> = new Set([]); // Restrict the rule to some column types. If empty, the rule can be applied to all column types
  id!: keyof LckTableColumnValidation; // Identifier of the validation rule (similar to the vee-validate rules)
  text!: string; // Rule label to display
  value!: ValidationValue[]; // Types of values that this rule can take
};

const validationRules: ValidationRule[] = [
  {
    columnTypes: new Set([]),
    id: 'required',
    text: i18n.t('pages.databaseSchema.validation.required').toString(),
    value: [ValidationValue.BOOLEAN],
  },
]

export default {
  name: 'ColumnValidation',
  components: {
    'p-checkbox': Vue.extend(Checkbox),
    'validation-provider': Vue.extend(ValidationProvider),
  },
  props: {
    columnValidation: {
      type: Object,
      default: () => ({}),
    } as PropOptions<LckTableColumnValidation>,
    columnType: {
      type: Number,
      default: null,
    } as PropOptions<COLUMN_TYPE | null>,
  },
  data (): {
    validationRules: ValidationRule[];
    } {
    return {
      validationRules,
    }
  },
  computed: {
    restrictedValidationRules () {
      // The current column can use generic rules (no specified column types)
      // and the rules related to its column type.
      if (this.columnType) {
        return validationRules.filter(
          ({ columnTypes }) =>
            columnTypes.size === 0 ||
            columnTypes.has(this.columnType as COLUMN_TYPE),
        )
      } else {
        return validationRules.filter(
          ({ columnTypes }) => columnTypes.size === 0,
        )
      }
    },
  },
  methods: {
    enableRule (rule: ValidationRule, enabled: boolean) {
      let defaultValue
      if (enabled) {
        switch (rule.value[0]) {
          case ValidationValue.BOOLEAN:
            defaultValue = true
            break
        }
        this.$set(this.columnValidation, rule.id, defaultValue)
      } else {
        this.$delete(this.columnValidation, rule.id)
      }
    },
  },
}
</script>

<style scoped>
.rule-container {
  align-items: center;
  border: var(--border);
  display: flex;
  height: 2.5em;
  justify-content: space-between;
  padding: 0 0.5em;
}

.rule-enable {
  display: flex;
  width: 100%;
}

.rule-enable label {
  flex: 1;
}
</style>
