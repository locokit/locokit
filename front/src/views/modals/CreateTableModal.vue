<template>
  <lck-dialog-form
    :visible.sync="visible"
    :header="$t('pages.databaseSchema.createTableModal.createTable')"
    @input="confirmCreateTableModal"
    @close="closeCreateTableModal"
  >
    <validation-provider
      vid="table-name"
      tag="div"
      class="p-field p-mt-4"
      :name="$t('pages.databaseSchema.createTableModal.tableName')"
      rules="required"
      v-slot="{
        errors,
        classes
      }"
    >
      <label for="table-name" class="label-field-required">
        {{ $t('pages.databaseSchema.createTableModal.tableName') }}
      </label>
      <p-input-text
        id="table-name"
        v-focus
        type="text"
        v-model="name"
      />
      <span :class="classes">{{ errors[0] }}</span>
    </validation-provider>
    <validation-provider
      vid="table-documentation"
      tag="div"
      class="p-field p-mt-4"
    >
      <label for="table-documentation">
        {{ $t('pages.databaseSchema.createTableModal.tableDoc') }}
      </label>
      <p-textarea
        id="table-documentation"
        v-model="documentation"
        :autoResize="true"
      />
    </validation-provider>
    <validation-provider
      vid="table-slug"
      tag="div"
      class="p-field p-mt-4"
      rules="required|snakeCase"
    >
      <label for="table-slug">
        {{ $t('pages.databaseSchema.createTableModal.tableSlug') }}
      </label>
      <p-input-text
        id="table-slug"
        type="text"
        :value="slug"
        disabled
      />
      <small>{{ $t('pages.databaseSchema.createTableModal.tableSlugInfo') }}</small>
    </validation-provider>
    <div v-if="errorMessage" class="p-invalid">
      <small id="table-name-invalid" class="p-invalid">
        {{ errorMessage }}
      </small>
    </div>
  </lck-dialog-form>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { ValidationProvider } from 'vee-validate'
import { lckServices } from '@/services/lck-api'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import DialogForm from '@/components/ui/DialogForm/DialogForm.vue'
import { LckTableColumn, LckTableView } from '@/services/lck-api/definitions'
import { createSlug } from '@/services/lck-utils/transformText'

interface LckTable {
  text: string;
  documentation: string;
  slug: string;
  database_id: string;
  columns: LckTableColumn[];
  views: LckTableView[];
}

export default Vue.extend({
  name: 'CreateTableModal',
  components: {
    'lck-dialog-form': DialogForm,
    'p-input-text': Vue.extend(InputText),
    'p-textarea': Vue.extend(Textarea),
    'validation-provider': Vue.extend(ValidationProvider),
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    } as PropOptions<boolean>,
    databaseId: {
      type: String,
      required: true,
    } as PropOptions<string>,
  },
  data () {
    return {
      name: null as string | null,
      documentation: null as string | null,
      errorMessage: null as string | null,
    }
  },
  computed: {
    slug (): null|string {
      if (this.name) return createSlug(this.name)
      return null
    },
  },
  methods: {
    closeCreateTableModal () {
      this.name = null
      this.documentation = null
      this.slug = null
      this.errorMessage = null
      this.$emit('close', false)
    },
    async confirmCreateTableModal () {
      try {
        const createTableResponse = await lckServices.table.create({
          // eslint-disable-next-line @typescript-eslint/camelcase
          database_id: this.databaseId,
          text: this.name,
          documentation: this.documentation,
          slug: this.slug,
        } as LckTable)
        if (createTableResponse) {
          this.name = null
          this.documentation = null
          this.slug = null
          this.errorMessage = null
          this.$emit('close', true)
        }
      } catch (error) {
        if (error instanceof Error) this.errorMessage = error.message
      }
    },
  },
})
</script>
