<template>
  <div>
    <div
      v-for="rule in restrictedValidationRules"
      :key="rule.id"
      class="rule-container"
    >
      <validation-provider
        :vid="`validation-${rule.id}`"
        tag="div"
      >
        <p-checkbox
          :id="`validation-${rule.id}`"
          name="criteria"
          class="p-mr-2"
          v-model="currentCriteria[rule.id].enabled"
          @input="enabledCriteria(rule, $event)"
          :binary="true"
        />
        <label :for="`validation-${rule.id}`">{{ rule.text }}</label>
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
  LckTableColumn,
  LckTableColumnValidation,
} from '@/services/lck-api/definitions'
import { formatDateISO } from '@/services/lck-utils/date'
import i18n from '@/plugins/i18n'

enum ValidationValue {
  BOOLEAN,
  DATE,
  FIELD,
}

type ValidationRule = {
  id: keyof LckTableColumnValidation;
  text: string;
  values: ValidationValue[];
  columnTypes: Set<COLUMN_TYPE>;
};

const validationRules: ValidationRule[] = [
  {
    id: 'required',
    values: [ValidationValue.BOOLEAN],
    text: i18n.t('pages.databaseSchema.validation.required').toString(),
    columnTypes: new Set([]),
  },
  // {
  //   id: 'minDate',
  //   values: [ValidationValue.DATE, ValidationValue.FIELD],
  //   text: 'Date inférieure à', // TODO use translation,
  //   columnTypes: new Set([COLUMN_TYPE.DATE, COLUMN_TYPE.DATETIME]),
  // },
]

export default {
  name: 'ColumnValidation',
  components: {
    'p-checkbox': Vue.extend(Checkbox),
    'validation-provider': Vue.extend(ValidationProvider),
  },
  props: {
    tableColumns: {
      type: Array,
      default: () => [],
    } as PropOptions<LckTableColumn[]>,
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
    currentCriteria: Record<
      string,
      { enabled: boolean; value?: object | string | boolean }
    >;
    } {
    return {
      validationRules,
      currentCriteria: {},
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
    enabledCriteria (criteria: ValidationRule, enabled: boolean) {
      let defaultValue
      if (enabled && criteria.values.length) {
        switch (criteria.values[0]) {
          case ValidationValue.BOOLEAN:
            defaultValue = true
            break
          case ValidationValue.DATE:
            defaultValue = formatDateISO(new Date())
            break
          case ValidationValue.FIELD:
            defaultValue = { fromField: '' }
            break
        }
      } else {
        this.$set(this.currentCriteria, criteria.id, {
          enabled: false,
          value: undefined,
        })
      }
      this.$emit('update-validation-criteria', {
        id: criteria.id,
        value: defaultValue,
      })
    },
  },
  watch: {
    columnValidation: {
      immediate: true,
      handler (newColumnValidation: LckTableColumnValidation) {
        const newCriteria: Record<
          string,
          { enabled: boolean; value?: object | string | boolean }
        > = {}
        for (const rule of validationRules) {
          newCriteria[rule.id] = {
            enabled: newColumnValidation[rule.id] != null,
            value: newColumnValidation[rule.id],
          }
        }
        this.currentCriteria = newCriteria
      },
    },
  },
}
</script>

<style scoped>
.rule-container {
  padding: 0.5em;
  border: 1px solid #ced4da;
  width: 100%;
}
.rule-container p {
  display: inline;
  width: 100%;
}

::v-deep .p-checkbox .p-checkbox-box {
  border-color: var(--primary-color-lighten);
}

::v-deep .p-checkbox .p-checkbox-box.p-highlight {
  border-color: var(--primary-color-lighten);
  background: var(--primary-color-lighten);
}

::v-deep .p-checkbox .p-checkbox-box .p-checkbox-icon {
  font-weight: bold;
}

::v-deep
  .p-checkbox:not(.p-checkbox-disabled)
  .p-checkbox-box.p-highlight:hover {
  border-color: var(--primary-color-darken);
  background: var(--primary-color-darken);
}

::v-deep
  .p-checkbox:not(.p-checkbox-disabled)
  .p-checkbox-box.p-highlight:hover
  .p-checkbox-icon {
  border-color: var(--primary-color-lighten) !important;
}
</style>
