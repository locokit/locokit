<template>
  <div>
    <div
      v-for="(source, index) in sources"
      :key="`source-${index}`"
      class="source-configuration"
    >
      <div class="p-field">
        <label :for="`blockSettingsMap-${index}`">{{ $t('pages.workspace.block.tableView') }}</label>
        <lck-autocomplete
          :id="`blockSettingsMap-${index}`"
          field="text"
          v-model="sourceTableViewOptions[index]"
          :dropdown="true"
          :suggestions="autocompleteSuggestions"
          @item-select="onChangeTableView(source, $event)"
          @search="$emit('search-table-view', $event)"
        />
      </div>
      <div class="p-field">
        <label :for="`blockSettingsDetailPage-${index}`">{{ $t('pages.workspace.block.detailPage') }}</label>
        <p-dropdown
          :id="`blockSettingsDetailPage-${index}`"
          :options="relatedChapterPages"
          optionLabel="text"
          optionValue="id"
          dataKey="id"
          :value="source.pageDetailId"
          :showClear="true"
          :placeholder="$t('components.datatable.placeholder')"
          @input="onChangePageDetailId(source, $event)"
        />
      </div>
      <p-button
        icon="pi pi-trash"
        class="p-button-text p-button-lg delete-source-button"
        @click="onDeleteSource(index)"
      />
    </div>
    <div
      class="add-source-div"
      v-if="!singleSource || (singleSource && sources.length === 0)"
      >
      <p-button
        icon="pi pi-plus"
        class="p-button-text p-button-lg add-source-button"
        :title="$t('pages.workspace.block.addGeoDataSrc')"
        @click="$emit('add-source')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'

import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'

import { LckTableView } from '@/services/lck-api/definitions'
import { MapSourceSettings } from '@locokit/lck-glossary'

export default Vue.extend({
  name: 'MapSettingsFields',
  components: {
    'p-button': Vue.extend(Button),
    'p-dropdown': Vue.extend(Dropdown),
    'lck-autocomplete': AutoComplete,
  },
  props: {
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
    sourceTableViewOptions: Array<{ text: string; value: string }>;
    tableViewIdsNamesAssociation: Record<string, string>;
    } {
    return {
      sourceTableViewOptions: [],
      tableViewIdsNamesAssociation: {},
    }
  },
  watch: {
    sources (newSources: MapSourceSettings[]) {
      this.updateSourceViewOptions(newSources)
    },
    tableViewDefinition (newTableViewDefinition: Record<string, LckTableView> | null) {
      this.updateTableViewIdsTextsAssociation(newTableViewDefinition)
      this.updateSourceViewOptions(this.sources)
    },
  },
  mounted () {
    this.updateTableViewIdsTextsAssociation(this.tableViewDefinition)
    this.updateSourceViewOptions(this.sources)
  },
  methods: {
    onChangeTableView (source: MapSourceSettings, { value }: { value: { value: string; text: string }}) {
      this.tableViewIdsNamesAssociation[value.value] = value.text
      this.$emit('update-id', { source, id: value.value })
      this.$emit('component-refresh-required', true)
    },
    onChangePageDetailId (source: MapSourceSettings, pageDetailId: string) {
      this.$emit('update-page-detail-id', { source, pageDetailId })
    },
    onDeleteSource (index: number) {
      this.$emit('delete-source', index)
    },
    updateTableViewIdsTextsAssociation (definitions: Record<string, LckTableView> | null) {
      // Build an object making the association between the view id and the view name
      for (const viewId in definitions) {
        this.tableViewIdsNamesAssociation[viewId] = definitions[viewId].text
      }
    },
    updateSourceViewOptions (sources: MapSourceSettings[]) {
      // Build an object containing the selected views for each source (autocomplete options)
      this.sourceTableViewOptions = []
      sources.forEach(({ id: tableViewId }) => {
        if (tableViewId) {
          this.sourceTableViewOptions.push({
            value: tableViewId,
            text: this.tableViewIdsNamesAssociation[tableViewId],
          })
        }
      })
    },
  },
})
</script>

<style scoped>
.p-inputswitch {
  display: block;
}

.source-configuration {
  position: relative;
  box-shadow: 1px 1px 5px 1px rgb(200, 200, 200);
  padding: 1em;
  margin-bottom: 1em;
}

.delete-source-button.p-button {
  position: absolute;
  top: 0;
  right: 0;
}

.add-source-div {
  box-shadow: 1px 1px 5px 1px rgb(200, 200, 200);
  margin-bottom: 1em;
}

.add-source-button.p-button {
  width: 100%;
  height: 100%;
}
</style>
