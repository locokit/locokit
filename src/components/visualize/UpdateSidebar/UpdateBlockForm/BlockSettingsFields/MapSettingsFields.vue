<template>
  <div>
    <!-- Component global configuration -->
    <validation-provider
      class="p-field"
      tag="div"
      vid="add-allowed"
    >
      <label for="add-allowed">
        {{ $t('pages.workspace.block.addAllowed') }}
      </label>
      <p-input-switch
        id="add-allowed"
        :value="addAllowed"
        @input="onAddAllowedChange"
      />
    </validation-provider>

    <div v-if="addAllowed">
      <validation-provider
        class="p-field"
        tag="div"
        vid="add-button-title"
      >
        <label for="add-button-title">
          {{ $t('pages.workspace.block.map.addButtonTitle') }}
        </label>
        <p-input-text
          id="add-button-title"
          :value="addButtonTitle"
          @input="$emit('update:addButtonTitle', $event)"
        />
      </validation-provider>

      <validation-provider
        class="p-field"
        :name="$t('pages.workspace.block.map.addSourceId')"
        rules="required"
        tag="div"
        vid="add-source-id"
        v-slot="{
          errors,
          classes
        }"
      >
        <label class="label-field-required" for="add-source-id">
          {{ $t('pages.workspace.block.map.addSourceId') }}
        </label>
        <p-dropdown
          dataKey="value"
          :disabled="!tableViewUniqueOptions.length"
          id="add-source-id"
          optionLabel="text"
          :options="tableViewUniqueOptions"
          optionValue="value"
          :placeholder="tableViewUniqueOptions.length
            ? $t('pages.workspace.block.map.selectOneSource')
            : $t('pages.workspace.block.map.noConfiguredSource')
          "
          :showClear="true"
          :value="addSourceId"
          @input="$emit('update:addSourceId', $event || undefined)"
        />
        <span :class="classes">{{ errors[0] }}</span>
      </validation-provider>
    </div>

    <!-- Source configurations -->
    <div v-if="sources.length === sourcesOptions.length">
      <p>{{ $t('pages.workspace.block.map.sources') }}</p>

      <details
        v-for="(source, index) in sources"
        class="source-configuration p-mb-3 p-p-3"
        :key="`source-${index}`"
      >
        <summary>
          {{ $t('pages.workspace.block.map.source') }} {{ index + 1 }}
          <p-button
            class="p-button-text delete-button"
            icon="pi pi-trash"
            :title="$t('pages.workspace.block.map.deleteSource')"
            @click="$emit('delete-source', index)"
          />
        </summary>

        <!-- Source view -->
        <validation-provider
          class="p-field p-mt-3"
          :name="$t('pages.workspace.block.map.tableView')"
          rules="required"
          tag="div"
          :vid="`source-id-${index}`"
          v-slot="{
            errors,
            classes
          }"
        >
          <label class="label-field-required" :for="`source-id-${index}`">
            {{ $t('pages.workspace.block.map.tableView') }}
          </label>
          <lck-autocomplete
            :dropdown="true"
            field="text"
            :id="`source-id-${index}`"
            :suggestions="autocompleteSuggestions"
            v-model="sourcesOptions[index].tableView"
            @clear="onTableViewReset(index)"
            @item-select="onTableViewChange(index, $event)"
            @search="$emit('search-table-view', $event)"
          />
          <span :class="classes">{{ errors[0] }}</span>
        </validation-provider>

        <!-- Source view aggregation field -->
        <validation-provider
          :vid="`source-aggregation-field-${index}`"
          tag="div"
          class="p-field"
        >
          <label :for="`source-aggregation-field-${index}`">
            {{ $t('pages.workspace.block.map.aggregationField') }}
          </label>
          <lck-autocomplete
            :disabled="!source.id"
            :dropdown="true"
            field="text"
            :id="`source-aggregation-field-${index}`"
            :placeholder="needRelatedSourcePlaceholder[index]"
            :suggestions="autocompleteSuggestions"
            v-model="sourcesOptions[index].aggregationField"
            @clear="onSourcePropertyChange(source, 'aggregationField', null)"
            @item-select="onAggregationFieldChange(source, $event)"
            @search="$emit('search-field', {
              query: $event.query,
              tableViewId: source.id,
              columnTypes: [COLUMN_TYPE.RELATION_BETWEEN_TABLES]
            })"
          />
        </validation-provider>

        <!-- Source view field -->
        <validation-provider
          :vid="`source-field-${index}`"
          tag="div"
          class="p-field"
        >
          <label :for="`source-field-${index}`">
            {{ $t('pages.workspace.block.map.field') }}
          </label>
          <lck-autocomplete
            :disabled="!source.id"
            :dropdown="true"
            field="text"
            :id="`source-field-${index}`"
            :placeholder="needRelatedSourcePlaceholder[index]"
            :suggestions="autocompleteSuggestions"
            v-model="sourcesOptions[index].field"
            @clear="onSourcePropertyChange(source, 'field', null)"
            @item-select="onFieldChange(source, $event)"
            @search="$emit('search-field', {
              query: $event.query,
              tableViewId: source.id,
              columnTypes: DISPLAYABLE_COLUMN_TYPES,
              ...queryParametersOnAggregation[index]
            })"
          />
        </validation-provider>

        <!-- Make the source selectable -->
        <validation-provider
          :vid="`source-selectable-${index}`"
          tag="div"
          class="p-field"
        >
          <label :for="`source-selectable-${index}`">
            {{ $t('pages.workspace.block.map.selectable') }}
          </label>
          <p-input-switch
            :id="`source-selectable-${index}`"
            :value="source.selectable"
            @input="onSourcePropertyChange(source, 'selectable', $event)"
          />
        </validation-provider>

        <!-- Display a pop-up -->
        <validation-provider
          :vid="`source-popup-${index}`"
          tag="div"
          class="p-field"
        >
          <label :for="`source-popup-${index}`">
            {{ $t('pages.workspace.block.map.popup') }}
          </label>
          <p-input-switch
            :id="`source-popup-${index}`"
            :value="source.popup"
            @input="
              onSourcePropertyChange(source, 'popup', $event);
              onSourcePropertyChange(source, 'popupSettings', {})
            "
          />
        </validation-provider>

        <!-- Pop-up configuration -->
        <div class="popup-configuration" v-if="source.popup">
          <validation-provider
            :vid="`source-popup-title-${index}`"
            tag="div"
            class="p-field"
          >
            <label :for="`source-popup-title-${index}`">
              {{ $t('pages.workspace.block.map.popupTitle') }}
            </label>
            <lck-autocomplete
              :id="`source-popup-title-${index}`"
              :disabled="!source.id"
              field="text"
              v-model="sourcesOptions[index].popupTitle"
              :dropdown="true"
              :placeholder="needRelatedSourcePlaceholder[index]"
              :suggestions="autocompleteSuggestions"
              @clear="onSourcePopupPropertyChange(source, 'title', null)"
              @item-select="
                saveFieldItem(source, $event);
                onSourcePopupPropertyChange(source, 'title', $event.value.value);
              "
              @search="$emit('search-field', {
                query: $event.query,
                tableViewId: source.id,
                ...queryParametersOnAggregation[index]
              })"
            />
          </validation-provider>

          <validation-provider
            :vid="`source-popup-detail-page-${index}`"
            tag="div"
            class="p-field"
            :name="$t('pages.workspace.block.map.popupDetailPage')"
          >
            <label :for="`source-popup-detail-page-${index}`">
              {{ $t('pages.workspace.block.map.popupDetailPage') }}
            </label>
            <p-dropdown
              :id="`source-popup-detail-page-${index}`"
              :options="relatedChapterPages"
              optionLabel="text"
              optionValue="id"
              dataKey="id"
              :value="source.popupSettings && source.popupSettings.pageDetailId"
              :showClear="true"
              :placeholder="$t('components.datatable.placeholder')"
              @input="onSourcePopupPropertyChange(source, 'pageDetailId', $event)"
            />
          </validation-provider>

          <validation-provider
            :vid="`source-popup-on-hover-${index}`"
            tag="div"
            class="p-field"
          >
            <label :for="`source-popup-on-hover-${index}`">
              {{ $t('pages.workspace.block.map.popupHover') }}
            </label>
            <p-input-switch
              :id="`source-popup-on-hover-${index}`"
              :value="source.popupSettings && source.popupSettings.onHover"
              @input="onSourcePopupPropertyChange(source, 'onHover', $event)"
            />
          </validation-provider>

          <!-- Fields to display in the pop-up -->
          <p>{{ $t('pages.workspace.block.map.popupFields') }}</p>
          <details
            v-for="(contentField, popupIndex) in source.popupSettings && source.popupSettings.contentFields"
            class="popup-field p-mb-3"
            :key="`source-${index}-${popupIndex}`"
          >
            <summary class="label-field-required">
              {{ $t('pages.workspace.block.map.popupField') }} {{ popupIndex + 1 }}
              <p-button
                class="p-button-text delete-button"
                icon="pi pi-trash"
                :title="$t('pages.workspace.block.map.deletePopupField')"
                @click="onPopupFieldDelete(source.popupSettings.contentFields, index, popupIndex)"
              />
            </summary>
            <validation-provider
              class="p-field p-mt-2"
              :name="$t('pages.workspace.block.map.popupField')"
              rules="required"
              tag="div"
              :vid="`source-popup-content-field-${index}-${popupIndex}`"
              v-slot="{
                errors,
                classes
              }"
            >
              <lck-autocomplete
                :disabled="!source.id"
                :dropdown="true"
                field="text"
                :id="`source-popup-content-field-${index}-${popupIndex}`"
                :placeholder="needRelatedSourcePlaceholder[index]"
                :suggestions="autocompleteSuggestions"
                v-model="sourcesOptions[index].popupFields[popupIndex]"
                @clear="onPopupFieldChange(contentField, 'field', undefined)"
                @item-select="
                  saveFieldItem(source, $event);
                  onPopupFieldChange(contentField, 'field', $event.value.value);
                "
                @search="$emit('search-field', {
                  query: $event.query,
                  tableViewId: source.id,
                  ...queryParametersOnAggregation[index]
                })"
              />
              <span :class="classes">{{ errors[0] }}</span>
            </validation-provider>
            <validation-provider
              class="p-field"
              tag="div"
              :vid="`source-popup-content-style-${index}-${popupIndex}`"
            >
              <label :for="`source-popup-content-style-${index}-${popupIndex}`">
                {{ $t('pages.workspace.block.map.popupFieldStyle') }}
              </label>
              <p-dropdown
                :id="`source-popup-content-style-${index}-${popupIndex}`"
                dataKey="value"
                optionLabel="label"
                :options="EXTENDED_NAMED_CLASSES"
                optionValue="value"
                :placeholder="$t('components.datatable.placeholder')"
                :showClear="true"
                :value="contentField.class"
                @input="onPopupFieldChange(contentField, 'class', $event || undefined)"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value">
                    {{ $t(`common.colorClass.${slotProps.value}`) }}
                  </div>
                  <span v-else>
                    {{ slotProps.placeholder }}
                  </span>
                </template>
                <template #option="slotProps">
                  {{ $t(`common.colorClass.${slotProps.option.value}`) }}
                </template>
              </p-dropdown>
            </validation-provider>
          </details>

          <p-button
            class="p-button-text p-button-sm add-popup-content-button"
            icon="pi pi-plus"
            :label="$t('pages.workspace.block.map.popupAddField')"
            @click="onPopupFieldAdd(source.popupSettings, index)"
          />
        </div>
      </details>
    </div>

    <div
      class="add-source p-mb-3"
      v-if="!singleSource || (singleSource && sources.length === 0)"
      >
      <p-button
        class="p-button-text p-button-lg add-source-button"
        icon="pi pi-plus"
        :title="$t('pages.workspace.block.map.addGeoSource')"
        @click="$emit('add-source')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { ValidationProvider } from 'vee-validate'
import { LckTableView } from '@/services/lck-api/definitions'
import { COLUMN_TYPE, MapSourceSettings } from '@locokit/lck-glossary'

import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import InputSwitch from 'primevue/inputswitch'
import InputText from 'primevue/inputtext'

import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'
import {
  EXTENDED_NAMED_CLASSES,
} from '@/services/lck-utils/prime'
import {
  GEOGRAPHIC_COLUMN_TYPES,
} from '@/services/lck-utils/columns'

interface Item {
  text: string;
  value: string;
}

interface SourceOptions {
  aggregationField?: Item;
  field?: Item;
  popupFields?: Item[];
  popupTitle?: Item;
  tableView?: Item;
}

export default Vue.extend({
  name: 'MapSettingsFields',
  components: {
    'lck-autocomplete': AutoComplete,
    'p-button': Vue.extend(Button),
    'p-dropdown': Vue.extend(Dropdown),
    'p-input-switch': Vue.extend(InputSwitch),
    'p-input-text': Vue.extend(InputText),
    'validation-provider': Vue.extend(ValidationProvider),
  },
  props: {
    addAllowed: {
      type: Boolean,
    },
    addSourceId: {
      type: String,
    },
    addButtonTitle: {
      type: String,
    },
    sources: {
      type: Array as PropType<MapSourceSettings[]>,
      default: () => ([]),
    },
    autocompleteSuggestions: {
      type: Array as PropType<{ label: string; value: string }[]>,
      default: () => ([]),
    },
    tableViewDefinition: {
      type: Object as PropType<Record<string, LckTableView> | null>,
    },
    relatedChapterPages: {
      type: Array,
      default: () => ([]),
    },
    singleSource: {
      type: Boolean,
      default: false,
    },
  },
  data (): {
    EXTENDED_NAMED_CLASSES: { label: string; value: string }[];
    DISPLAYABLE_COLUMN_TYPES: COLUMN_TYPE[];
    COLUMN_TYPE: typeof COLUMN_TYPE;
    sourcesOptions: SourceOptions[];
    tableViewIdsNamesAssociation: Record<string, string>;
    fieldIdsNamesAssociationByTableView: Record<string, Record<string, string>>;
    tableViewUniqueOptions: Item[];
    } {
    return {
      EXTENDED_NAMED_CLASSES,
      sourcesOptions: [],
      tableViewIdsNamesAssociation: {},
      fieldIdsNamesAssociationByTableView: {},
      tableViewUniqueOptions: [],
      COLUMN_TYPE,
      DISPLAYABLE_COLUMN_TYPES: [
        ...GEOGRAPHIC_COLUMN_TYPES,
        COLUMN_TYPE.VIRTUAL_LOOKED_UP_COLUMN,
        COLUMN_TYPE.LOOKED_UP_COLUMN,
      ],
    }
  },
  watch: {
    sources: {
      handler (newSources: MapSourceSettings[]) {
        this.updateSourceViewOptions(newSources)
      },
      immediate: true,
    },
    tableViewDefinition: {
      handler (newTableViewDefinition: Record<string, LckTableView> | null) {
        this.updateTableViewIdsTextsAssociation(newTableViewDefinition)
        this.updateSourceViewOptions(this.sources)
      },
      immediate: true,
    },
  },
  computed: {
    needRelatedSourcePlaceholder () {
      // For each source, return a specific placeholder for the autocomplete inputs that need the view to be chosen
      return this.sources.map(source => {
        return source.id
          ? this.$t('components.datatable.autoCompletePlaceholder')
          : this.$t('pages.workspace.block.map.noSelectedView')
      })
    },
    queryParametersOnAggregation () {
      // If the source data is aggregated, only the columns related to the aggregation field should be used
      // (in the popup, to customise the layers...) because their values are similar in the aggregated rows.
      return this.sources.map(source => {
        return source.aggregationField
          ? {
            settings: {
              localField: source.aggregationField,
            },
          }
          : {}
      })
    },
  },
  methods: {
    // Map settings
    onAddAllowedChange (allowed: boolean) {
      if (!allowed) {
        // Reset related inputs
        this.$emit('update:addSourceId', undefined)
        this.$emit('update:addButtonTitle', undefined)
      }
      this.$emit('update:addAllowed', allowed)
    },
    // Map source settings
    onTableViewChange (index: number, { value }: { value: { value: string; text: string }}) {
      // Save the id and the name of the selected table view
      this.tableViewIdsNamesAssociation[value.value] = value.text
      if (!this.fieldIdsNamesAssociationByTableView[value.value]) {
        this.fieldIdsNamesAssociationByTableView[value.value] = {}
      }
      if (this.sources[index].id !== value.value) {
        // Update the settings and ask new data
        this.$emit('update-map-source-id', { index, id: value.value })
        this.$emit('component-refresh-required', true)
      }
    },
    onTableViewReset (index: number) {
      this.$emit('update-map-source-id', { index, id: null })
    },
    onFieldChange (source: MapSourceSettings, { value }: { value: { value: string; text: string }}) {
      // Save the id and the name of the selected field
      this.saveFieldItem(source, { value })
      // Update the settings and ask new data
      this.onSourcePropertyChange(source, 'field', value.value)
      this.$emit('component-refresh-required', true)
    },
    onAggregationFieldChange (source: MapSourceSettings, { value }: { value: { value: string; text: string }}) {
      // Save the id and the name of the selected aggregation field
      this.saveFieldItem(source, { value })
      // Update the settings and ask new data
      this.onSourcePropertyChange(source, 'aggregationField', value.value)
      this.$emit('component-refresh-required', true)
    },
    onSourcePropertyChange (
      source: MapSourceSettings,
      propertyName: string,
      propertyValue: object | string | boolean | null,
    ) {
      this.$emit('update-map-source-property', { source, propertyName, propertyValue })
    },
    // Map source pop-up settings
    onSourcePopupPropertyChange (
      source: MapSourceSettings,
      propertyName: string,
      propertyValue: object | string | boolean | null,
    ) {
      this.$emit('update-map-source-popup-property', { source, propertyName, propertyValue })
    },
    onPopupFieldChange (content: { field: string; class?: string }, propertyName: string, propertyValue: string | undefined) {
      this.$emit('update-map-source-popup-content-property', { content, propertyName, propertyValue })
    },
    onPopupFieldAdd (popupSettings: object, index: number) {
      if (!Array.isArray(this.sourcesOptions[index].popupFields)) {
        this.$set(this.sourcesOptions[index], 'popupFields', [])
      }
      this.$emit('add-map-source-popup-content', popupSettings)
    },
    onPopupFieldDelete (contentFields: { class?: string; field: string }[], index: number, popupIndex: number) {
      const popupFieldsOptions = this.sourcesOptions[index].popupFields
      if (Array.isArray(popupFieldsOptions)) {
        popupFieldsOptions.splice(popupIndex, 1)
      }
      this.$emit('delete-map-source-popup-content', { contentFields: contentFields, index: popupIndex })
    },
    // Utils to manage the autocomplete inputs
    saveFieldItem (source: MapSourceSettings, { value }: { value: { value: string; text: string }}) {
      // Save the id and the name of the current field
      this.fieldIdsNamesAssociationByTableView[source.id][value.value] = value.text
    },
    updateTableViewIdsTextsAssociation (definitions: Record<string, LckTableView> | null) {
      // Build an object making the association between the view id and the view name
      for (const viewId in definitions) {
        this.tableViewIdsNamesAssociation[viewId] = definitions[viewId].text
        if (!this.fieldIdsNamesAssociationByTableView[viewId]) this.fieldIdsNamesAssociationByTableView[viewId] = {}
        for (const column of definitions[viewId].columns || []) {
          this.fieldIdsNamesAssociationByTableView[viewId][column.id] = column.text
        }
      }
    },
    updateSourceViewOptions (sources: MapSourceSettings[]) {
      // Build an array containing the autocomplete options of each source
      const options: SourceOptions[] = []
      const tableViewOptions: Item[] = []
      const alreadySourceViewIds: Set<string> = new Set()
      let addSourceIdExist = false

      sources.forEach(({ id: tableViewId, field, aggregationField, popupSettings }, index) => {
        const currentSourceOptions: SourceOptions = {}
        // Input related to the source view
        if (tableViewId) {
          currentSourceOptions.tableView = {
            value: tableViewId,
            text: this.tableViewIdsNamesAssociation[tableViewId],
          }
          if (this.addSourceId === tableViewId) addSourceIdExist = true

          if (!alreadySourceViewIds.has(tableViewId)) {
            tableViewOptions.push({
              value: tableViewId,
              text: this.tableViewIdsNamesAssociation[tableViewId] || `${this.$t('components.mapview.noReference')} (${index + 1})`,
            })
            alreadySourceViewIds.add(tableViewId)
          }
        }
        // Input related to the source aggregation field
        if (aggregationField) {
          currentSourceOptions.aggregationField = {
            value: aggregationField,
            text: this.fieldIdsNamesAssociationByTableView[tableViewId]?.[aggregationField],
          }
        }
        // Input related to the source field
        if (field) {
          currentSourceOptions.field = {
            value: field,
            text: this.fieldIdsNamesAssociationByTableView[tableViewId]?.[field],
          }
        }
        // Inputs related to the source popup
        if (popupSettings) {
          if (popupSettings.title) {
            currentSourceOptions.popupTitle = {
              value: popupSettings.title,
              text: this.fieldIdsNamesAssociationByTableView[tableViewId]?.[popupSettings.title],
            }
          }
          if (popupSettings.contentFields) {
            currentSourceOptions.popupFields = popupSettings.contentFields.map(({ field: contentField }) => ({
              value: contentField,
              text: this.fieldIdsNamesAssociationByTableView[tableViewId]?.[contentField],
            }))
          }
        }
        options.push(currentSourceOptions)
      })
      this.sourcesOptions = options
      this.tableViewUniqueOptions = tableViewOptions
      if (!addSourceIdExist) this.$emit('update:addSourceId', undefined)
    },
  },
})
</script>

<style scoped lang="scss">
.p-inputswitch {
  display: block;
}

.source-configuration {
  box-shadow: 1px 1px 5px 1px rgb(200, 200, 200);

  .popup-configuration .popup-field {
    border-left: 2px solid var(--primary-color);
    padding-left: 0.5em;
  }

  summary {
    position: relative;
    padding-right: 3em;

    .delete-button.p-button {
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      width: 3rem;
    }
  }
}

.add-source {
  box-shadow: 1px 1px 5px 1px rgb(200, 200, 200);
  position: relative;

  .add-source-button.p-button {
    width: 100%;
    height: 100%;
  }
}

</style>
