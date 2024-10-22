<template>
  <WithSidebar :open-panel="isPanelOpened">
    <template #main>
      <div class="mx-4">
        <div class="my-8">
          <h1>
            {{ $t('locokit.pages.schemaDatasource.title') }}
          </h1>
        </div>
        <div>
          <div v-if="currentDatasource.documentation" class="mb-4">
            <h4 class="mb-2">
              {{ $t('locokit.pages.schemaDatasource.documentation') }}
            </h4>
            <p>{{ currentDatasource.documentation }}</p>
          </div>
          <div v-if="errorDrawDiagram">
            <p>{{ $t('locokit.pages.schemaDatasource.noTables') }}</p>
          </div>
          <div v-else>
            <p>{{ $t('locokit.pages.schemaDatasource.explainSchema') }}</p>
          </div>
          <pre id="diagram" ref="diagram" class="mermaid"></pre>
        </div>
      </div>
    </template>
    <template #panel-header>
      <h2 v-if="currentTable">
        {{
          $t('locokit.pages.schemaDatasource.subTitle', {
            tableName: currentTable.name,
          })
        }}
      </h2>
    </template>
    <template #panel-content>
      <PrimeTabView class="sidebar-tabs">
        <PrimeTabPanel :header="$t('locokit.pages.schemaDatasource.table')">
          <div>
            <PrimeAccordion class="accordion-sidebar" :active-index="0">
              <PrimeAccordionTab>
                <template #header>
                  <h4 class="font-semibold ml-1">
                    {{ $t('locokit.pages.schemaDatasource.properties') }}
                  </h4>
                </template>
                <FormGeneric
                  v-if="currentTable"
                  label-tk-button-submit="locokit.pages.schemaDatasource.submit"
                  :response="error"
                  :loading="loading"
                  @submit="onSubmitFormTable"
                >
                  <Field
                    v-slot="{ field }"
                    v-model="documentationTable"
                    class="mb-4"
                    name="schemaDatasource.documentation"
                    as="div"
                  >
                    <label for="documentation">
                      {{
                        $t(
                          'locokit.pages.schemaDatasource.formTable.documentation',
                        )
                      }}
                    </label>
                    <PrimeTextarea
                      id="documentation"
                      :auto-resize="true"
                      v-bind="field"
                    />
                  </Field>
                </FormGeneric>
              </PrimeAccordionTab>
              <PrimeAccordionTab v-if="currentTable?.relations">
                <template #header>
                  <h4 class="font-semibold ml-1">
                    {{ $t('locokit.pages.schemaDatasource.properties') }}
                  </h4>
                </template>
                <div>WIP</div>
              </PrimeAccordionTab>
            </PrimeAccordion>
          </div>
        </PrimeTabPanel>
        <PrimeTabPanel :header="$t('locokit.pages.schemaDatasource.fields')">
          <PrimeButton
            v-if="!isCreatingField"
            class="rounded-lck p-button-secondary w-full"
            @click="displayFormToCreateField"
          >
            <div
              class="relative flex flex-row justify-center text-center font-bold w-full"
            >
              <i class="bi bi-plus block font-medium" />
              <p class="pl-1">
                {{ $t('locokit.pages.schemaDatasource.addField') }}
              </p>
            </div>
          </PrimeButton>
          <div v-else class="shadow bg-primary-lighten rounded-lck">
            <div class="p-2">
              <h4 class="mb-2">
                {{ $t('locokit.pages.schemaDatasource.createField') }}
              </h4>
              <CreateField
                :fields="currentFields.data"
                :table-slug="currentTable.slug"
                @reset="displayFormToCreateField"
              />
            </div>
          </div>
          <div>
            <PrimeAccordion class="accordion-sidebar" :active-index="0">
              <PrimeAccordionTab
                v-for="currentField in currentFields.data"
                :key="currentField.id"
              >
                <template #header>
                  <i :class="getFieldIconClass(currentField.type)"></i>
                  <span>{{ currentField.name }}</span>
                </template>
                <FormGeneric
                  class="shadow bg-primary-lighten rounded-lck p-2"
                  label-tk-button-submit="locokit.pages.schemaDatasource.submit"
                  :response="error"
                  :loading="loading"
                  @submit="onSubmitFormFields(currentField.id)"
                >
                  <Field
                    v-slot="{ field }"
                    v-model="currentField.documentation"
                    class="mb-4"
                    name="schemaDatasource.formField.documentation"
                    as="div"
                  >
                    <label for="documentation">
                      {{
                        $t(
                          'locokit.pages.schemaDatasource.formField.documentation',
                        )
                      }}
                    </label>
                    <PrimeTextarea
                      id="documentation"
                      :auto-resize="true"
                      v-bind="field"
                    />
                  </Field>
                  <Field
                    class="mb-4"
                    name="schemaDatasource.formField.type"
                    as="div"
                  >
                    <label for="type">
                      {{ $t('locokit.pages.schemaDatasource.formField.type') }}
                    </label>
                    <PrimeDropdown
                      :model-value="
                        typeField.find(
                          ({ value }) => value === currentField.type,
                        )
                      "
                      :disabled="true"
                      input-id="type"
                      :options="typeField"
                      option-label="label"
                    >
                      <template #value="slotProps">
                        <div v-if="slotProps.value" class="flex items-baseline">
                          <i :class="slotProps.value.icon" class="mr-2" />
                          <span v-if="slotProps.value">
                            {{
                              $t(
                                `commons.fieldType.${slotProps.value.name}.name`,
                              )
                            }}
                          </span>
                        </div>
                      </template>
                    </PrimeDropdown>
                    <div class="flex flex-col">
                      <span v-if="currentField.type" class="text-sm/7">
                        {{
                          $t(
                            `commons.fieldType.${currentField.type.toLowerCase()}.description`,
                          )
                        }}
                      </span>
                    </div>
                  </Field>
                  <Field
                    class="mb-4"
                    name="schemaDatasource.formField.createdAt"
                    as="div"
                  >
                    <label for="createdAt">
                      {{
                        $t('locokit.pages.schemaDatasource.formField.createdAt')
                      }}
                    </label>
                    <PrimeCalendar
                      :model-value="new Date(currentField.createdAt)"
                      :disabled="true"
                    />
                  </Field>
                  <Field
                    class="mb-4"
                    name="schemaDatasource.formField.updatedAt"
                    as="div"
                  >
                    <label for="updatedAt">
                      {{
                        $t('locokit.pages.schemaDatasource.formField.updatedAt')
                      }}
                    </label>
                    <PrimeCalendar
                      :model-value="new Date(currentField.updatedAt)"
                      :disabled="true"
                    />
                  </Field>
                  <Field
                    class="mb-4"
                    name="schemaDatasource.formField.unique"
                    as="div"
                  >
                    <label for="unique">
                      {{
                        $t('locokit.pages.schemaDatasource.formField.unique')
                      }}
                    </label>
                    <PrimeCheckbox
                      id="unique"
                      v-model="currentField.settings.unique"
                      class="self-center ml-2"
                      binary
                      :class="{ 'p-invalid': !valid && touched }"
                    />
                  </Field>
                  <Field
                    class="mb-4"
                    name="schemaDatasource.formField.nullable"
                    as="div"
                  >
                    <label for="unique">
                      {{
                        $t('locokit.pages.schemaDatasource.formField.nullable')
                      }}
                    </label>
                    <PrimeCheckbox
                      id="unique"
                      v-model="currentField.settings.nullable"
                      class="self-center ml-2"
                      binary
                      :class="{ 'p-invalid': !valid && touched }"
                    />
                  </Field>
                </FormGeneric>
              </PrimeAccordionTab>
            </PrimeAccordion>
          </div>
        </PrimeTabPanel>
      </PrimeTabView>
    </template>
  </WithSidebar>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import mermaid from 'mermaid'
import { Field } from 'vee-validate'
import { FormGeneric } from '@locokit/designsystem'
import { FIELD_TYPE } from '@locokit/definitions'
import {
  findDatasources,
  getSchemaDatasource,
} from '../../../../services/datasource'
import WithSidebar from '../../../../layouts/WithSidebar.vue'
import { sdkClient } from '../../../../services/api'
import CreateField from '../CreateField/CreateField.vue'
import { getFieldIconClass } from '../../../../helpers/field'
import { reactive, ref, useRoute } from '#imports'

const route = useRoute()

const loading = ref(false)
const errorDrawDiagram = ref(false)
const isPanelOpened = ref<boolean | undefined>()
const isCreatingField = ref<boolean>(false)
const diagram = ref(null)
const currentDatasource = ref(null)
const currentTable = ref(null)
const documentationTable = ref(null)
const currentFields = reactive({ data: null })

// Initialization
if (route.params.datasourceSlug && route.params.workspaceSlug) {
  const res = await findDatasources(
    {
      params: { slug: route.params.datasourceSlug as string, $eager: 'tables' },
    },
    route.params.workspaceSlug as string,
  )
  if (res.total === 1) {
    currentDatasource.value = res.data[0]
  }
}
const typeField = Object.values(FIELD_TYPE).map((type: string) => ({
  name: type.toLowerCase(),
  value: type,
  icon: getFieldIconClass(type),
}))

const drawDiagram = async function () {
  const element = document.querySelector('#diagram')
  try {
    errorDrawDiagram.value = false
    const graphDefinition = await getSchemaDatasource(
      route.params.workspaceSlug as string,
      route.params.datasourceSlug as string,
    )
    if (element) {
      const { svg, bindFunctions } = await mermaid.render(
        'graphDiv',
        graphDefinition.data,
        element,
      )
      element.innerHTML = svg
      bindFunctions?.(element)
    }
  } catch (er) {
    errorDrawDiagram.value = true
  }
}

const displayFormToCreateField = () =>
  (isCreatingField.value = !isCreatingField.value)

onMounted(async () => {
  await mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
  })
  await drawDiagram()
})

const onSubmitFormTable = async () => {
  loading.value = true
  if (currentDatasource.value && route.params.workspaceSlug) {
    await sdkClient
      .service(
        `/workspace/${route.params.workspaceSlug}/datasource/${currentDatasource.value.slug}/table/`,
      )
      .patch(currentTable.value.id, {
        documentation: documentationTable.value,
        datasourceId: currentDatasource.value.id,
      })
  }
  loading.value = false
}

const onSubmitFormFields = async (fieldId: string) => {
  loading.value = true
  if (currentDatasource.value && currentTable.value && fieldId) {
    const currentField = currentFields.data.find(({ id }) => id === fieldId)
    if (currentField) {
      await sdkClient
        .service(
          `/workspace/${route.params.workspaceSlug}/datasource/${currentDatasource.value.slug}/table/${currentTable.value.slug}/field`,
        )
        .patch(fieldId, {
          documentation: currentField.documentation,
          settings: { ...currentField.settings },
          tableId: currentTable.value.id,
        })
    }
  }
  loading.value = false
}
const openPanel = async (tableId: string) => {
  if (isPanelOpened.value === undefined) {
    isPanelOpened.value = true
  }
  currentTable.value = await sdkClient
    .service(
      `/workspace/${route.params.workspaceSlug}/datasource/${currentDatasource.value.slug}/table`,
    )
    .get(tableId, { query: { $eager: '[fields,relations]' } })
  documentationTable.value = currentTable.value?.documentation
  // Todo sort with position
  currentFields.data = currentTable.value.fields
}

// Don't update it without changes in api
// Link to the build of class diagram (mermaid)
window.openTableSidebar = (tableId: string) => {
  openPanel(tableId)
}
</script>

<style lang="scss" scoped>
.accordion-sidebar {
  :deep(.p-accordion-header-link) {
    background-color: transparent !important;
    border: unset;
    padding: 1rem 0.25rem 0.5rem 0.25rem;
  }

  :deep(.p-accordion-content) {
    background-color: transparent;
    border: unset;
    padding: 0.5rem 0.75rem;
  }

  i span {
    vertical-align: middle;
  }

  span {
    margin: 0 0.2rem;
  }
}

.sidebar-tabs
  > :deep(.p-tabview-nav-container)
  > .p-tabview-nav-content
  > .p-tabview-nav
  > li {
  flex: 1 0 !important;

  > a {
    justify-content: center !important;
  }

  > .p-tabview-panels {
    padding: 0.5rem 0 0 0;
  }
}
</style>

<style>
.styleMermaidClass > line.divider:last-of-type {
  stroke-width: 0 !important;
}
</style>
