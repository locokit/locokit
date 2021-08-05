<template>
  <lck-form
    :submitting="submitting"
    @submit="onFormSubmit"
    @cancel="$emit('close')"
    class="lck-update-block-form lck-color-content p-text-bold"
  >
    <validation-provider
      vid="blockTitleField"
      tag="div"
      class="p-field"
    >
      <label for="blockTitleField">{{ $t('pages.workspace.block.name') }}</label>
      <p-input-text
        id="blockTitleField"
        v-model="blockCopy.title"
      />
    </validation-provider>
    <validation-provider
      vid="blockTypeField"
      tag="div"
      class="p-field"
      :name="$t('pages.workspace.block.type')"
      rules="required"
      v-slot="{
        errors,
        classes
      }"
    >
      <label for="blockTypeField">{{ $t('pages.workspace.block.type') }}</label>
      <span class="field-required">*</span>
      <p-dropdown
        id="blockTypeField"
        v-model="blockCopy.type"
        :placeholder="$t('components.datatable.placeholder')"
        :options="blockTypesValues"
        @input="resetBlockSettings"
      />
      <span :class="classes">{{ errors[0] }}</span>
    </validation-provider>

    <validation-provider
      vid="blockElevation"
      tag="div"
      class="p-field p-d-flex p-flex-column"
    >
      <label for="blockElevation">
        {{ $t('pages.workspace.block.elevation') }}
      </label>
      <p-switch
        id="blockElevation"
        v-model="blockCopy.elevation"
      />
    </validation-provider>

    <validation-provider
      vid="blockConditionalDisplayTableViewId"
      tag="div"
      class="p-field p-d-flex p-flex-column"
    >
      <label for="blockConditionalDisplayTableViewId">
        {{ $t('pages.workspace.block.conditionalDisplayTableView') }}
      </label>
      <lck-autocomplete
        id="blockConditionalDisplayTableViewId"
        field="text"
        v-model="blockDisplayTableView"
        :dropdown="true"
        :suggestions="blockDisplayTableViewSuggestions"
        @item-select="blockCopy.conditionalDisplayTableViewId = blockDisplayTableView.value"
        @search="$emit('search-block-display-table-view', $event)"
      />
    </validation-provider>

    <validation-provider
      vid="blockConditionalDisplayFieldId"
      tag="div"
      class="p-field p-d-flex p-flex-column"
    >
      <label for="blockConditionalDisplayFieldId">
        {{ $t('pages.workspace.block.conditionalDisplayField') }}
      </label>
      <lck-autocomplete
        id="blockConditionalDisplayFieldId"
        :disabled="!blockDisplayTableView"
        field="text"
        v-model="blockDisplayField"
        :dropdown="true"
        :suggestions="blockDisplayFieldSuggestions"
        @item-select="blockCopy.conditionalDisplayFieldId = blockDisplayField.value"
        @search="$emit('search-block-display-field', {
          ...$event,
          tableViewId: blockCopy.conditionalDisplayTableViewId
        })"
      />
    </validation-provider>

    <validation-provider
      vid="blockConditionalDisplayFieldValue"
      tag="div"
      class="p-field p-d-flex p-flex-column"
    >
      <label for="blockConditionalDisplayFieldValue">
        {{ $t('pages.workspace.block.conditionalDisplayFieldValue') }}
      </label>
      <p-switch
        id="blockConditionalDisplayFieldValue"
        v-model="blockCopy.conditionalDisplayFieldValue"
      />
    </validation-provider>

    <!-- Custom settings -->
    <paragraph-settings-fields
      v-if="blockCopy.type === BLOCK_TYPE.PARAGRAPH"
      :content.sync="blockCopy.settings.content"
    />
    <markdown-settings-fields
      v-else-if="blockCopy.type === BLOCK_TYPE.MARKDOWN"
      :content.sync="blockCopy.settings.content"
      :textColor.sync="blockCopy.settings.textColor"
      :textAlign.sync="blockCopy.settings.textAlign"
    />
    <markdown-field-settings-fields
      v-else-if="blockCopy.type === BLOCK_TYPE.MARKDOWN_FIELD"
      :displayFieldId.sync="blockCopy.settings.displayFieldId"
      :textColor.sync="blockCopy.settings.textColor"
      :textAlign.sync="blockCopy.settings.textAlign"
      :tableViewDefinition="blockCopy.definition"
      :autocompleteSuggestions="autocompleteSuggestions"
      @search-table-view="$emit('search-table-view', $event)"
    />
    <media-settings-fields
      v-else-if="blockCopy.type === BLOCK_TYPE.MEDIA"
      :displayMode.sync="blockCopy.settings.displayMode"
      :medias="blockCopy.settings.medias"
      @update:displayMode="onUpdateMediaDisplayMode"
      @update-media-name="onUpdateMediaName"
      @update-media-srcURL="onUpdateMediaSrcURL"
      @update-media-type="onUpdateMediaType"
      @add-media="onAddMedia"
      @delete-media="onDeleteMedia"
    />
    <table-set-settings-fields
      v-else-if="blockCopy.type === BLOCK_TYPE.TABLE_SET"
      :addAllowed.sync="blockCopy.settings.addAllowed"
      :exportAllowed.sync="blockCopy.settings.exportAllowed"
      :id.sync="blockCopy.settings.id"
      :pageDetailId.sync="blockCopy.settings.pageDetailId"
      :tableViewDefinition="tableViewDefinition"
      :relatedChapterPages="relatedChapterPages"
      :autocompleteSuggestions="autocompleteSuggestions"
      @search-table-view="$emit('search-table-view', $event)"
      @component-refresh-required="onComponentRefreshRequired"
    />
    <data-record-settings-fields
      v-else-if="[BLOCK_TYPE.DATA_RECORD, BLOCK_TYPE.FORM_RECORD].includes(blockCopy.type)"
      :id.sync="blockCopy.settings.id"
      :tableViewDefinition="tableViewDefinition"
      :autocompleteSuggestions="autocompleteSuggestions"
      @search-table-view="$emit('search-table-view', $event)"
      @component-refresh-required="onComponentRefreshRequired"
    />
    <map-settings-fields
      v-else-if="[BLOCK_TYPE.MAP_SET, BLOCK_TYPE.MAP_FIELD].includes(blockCopy.type)"
      :addAllowed.sync="blockCopy.settings.addAllowed"
      :addButtonTitle.sync="blockCopy.settings.addButtonTitle"
      :addSourceId.sync="blockCopy.settings.addSourceId"
      :tableViewDefinition="tableViewDefinition"
      :relatedChapterPages="relatedChapterPages"
      :sources="blockCopy.settings.sources"
      :autocompleteSuggestions="autocompleteSuggestions"
      :singleSource="blockCopy.type === BLOCK_TYPE.MAP_FIELD"
      @update-map-source-id="onUpdateMapSourceId"
      @update-map-source-property="onUpdateMapSourceProperty"
      @update-map-source-popup-property="onUpdateMapSourcePopupProperty"
      @update-map-source-popup-content-property="onUpdateMapSourcePopupContentProperty"
      @add-map-source-popup-content="onAddMapSourcePopupContent"
      @delete-map-source-popup-content="onDeleteMapSourcePopupContent"
      @add-source="onAddMapSource"
      @delete-source="onDeleteMapSource"
      @search-table-view="$emit('search-table-view', $event)"
      @search-field="$emit('search-field', $event)"
      @component-refresh-required="onComponentRefreshRequired"
    />
    <action-button-settings-fields
      v-else-if="blockCopy.type === BLOCK_TYPE.ACTION_BUTTON"
      :label.sync="blockCopy.settings.label"
      :classButton.sync="blockCopy.settings.classButton"
      :icon.sync="blockCopy.settings.icon"
      :action.sync="blockCopy.settings.action"
      :processId.sync="blockCopy.settings.processId"
      :typePageTo.sync="blockCopy.settings.typePageTo "
      :pageDetailId.sync="blockCopy.settings.pageDetailId"
      :pageRedirectId.sync="blockCopy.settings.pageRedirectId"
      :pageQueryFieldId.sync="blockCopy.settings.pageQueryFieldId"
      :tableViewDefinition="tableViewDefinition"
      :autocompleteSuggestions="autocompleteSuggestions"
      @search-table-view="$emit('search-table-view', $event)"
      :displayFieldId.sync="blockCopy.settings.displayFieldId"
      :displayFieldConditionQuery.sync="blockCopy.settings.displayFieldConditionQuery"
      :notificationSuccessTitle.sync="blockCopy.settings.notificationSuccessTitle"
      :notificationSuccessDescription.sync="blockCopy.settings.notificationSuccessDescription"
      :notificationErrorTitle.sync="blockCopy.settings.notificationErrorTitle"
      :notificationErrorDescription.sync="blockCopy.settings.notificationErrorDescription"
    />
  </lck-form>
</template>

<script lang="ts">
import Vue from 'vue'

import { ValidationProvider } from 'vee-validate'

import { BLOCK_TYPE, MapSettings, MapSourceSettings, MediaSettings, MEDIA_TYPE } from '@locokit/lck-glossary'
import { LckBlockExtended, LckTableView, MediaConfiguration } from '@/services/lck-api/definitions'

import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import InputSwitch from 'primevue/inputswitch'

import LckForm from '@/components/ui/Form/Form.vue'
import ParagraphSettingsFields from '@/components/visualize/UpdateSidebar/UpdateBlockForm/BlockSettingsFields/ParagraphSettingsFields.vue'
import MarkdownSettingsFields from '@/components/visualize/UpdateSidebar/UpdateBlockForm/BlockSettingsFields/MarkdownSettingsFields.vue'
import MarkdownFieldSettingsFields from '@/components/visualize/UpdateSidebar/UpdateBlockForm/BlockSettingsFields/MarkdownFieldSettingsFields.vue'
import MediaSettingsFields from '@/components/visualize/UpdateSidebar/UpdateBlockForm/BlockSettingsFields/MediaSettingsFields.vue'
import TableSetSettingsFields from '@/components/visualize/UpdateSidebar/UpdateBlockForm/BlockSettingsFields/TableSetSettingsFields.vue'
import DataRecordSettingsFields from '@/components/visualize/UpdateSidebar/UpdateBlockForm/BlockSettingsFields/DataRecordSettingsFields.vue'
import MapSettingsFields from '@/components/visualize/UpdateSidebar/UpdateBlockForm/BlockSettingsFields/MapSettingsFields.vue'
import ActionButtonSettingsFields from '@/components/visualize/UpdateSidebar/UpdateBlockForm/BlockSettingsFields/ActionButtonSettingsFields.vue'
import AutoComplete from '@/components/ui/AutoComplete/AutoComplete.vue'

interface PopupContentField {
  field: string;
  class?: string;
}

export default {
  name: 'UpdateBlockForm',
  components: {
    'lck-form': LckForm,
    'lck-autocomplete': AutoComplete,
    'paragraph-settings-fields': ParagraphSettingsFields,
    'markdown-settings-fields': MarkdownSettingsFields,
    'markdown-field-settings-fields': MarkdownFieldSettingsFields,
    'media-settings-fields': MediaSettingsFields,
    'table-set-settings-fields': TableSetSettingsFields,
    'data-record-settings-fields': DataRecordSettingsFields,
    'map-settings-fields': MapSettingsFields,
    'action-button-settings-fields': ActionButtonSettingsFields,
    'p-input-text': Vue.extend(InputText),
    'p-switch': Vue.extend(InputSwitch),
    'p-dropdown': Vue.extend(Dropdown),
    'validation-provider': Vue.extend(ValidationProvider),
  },
  props: {
    block: {
      type: Object as Vue.PropType<LckBlockExtended>,
      required: true,
    },
    submitting: {
      type: Boolean,
      default: false,
    },
    autocompleteSuggestions: {
      type: Array,
      default: () => ([]),
    } as Vue.PropOptions<{ label: string; value: string }[]>,
    blockDisplayTableViewSuggestions: {
      type: Array,
      default: () => ([]),
    } as Vue.PropOptions<{ label: string; value: string }[]>,
    blockDisplayFieldSuggestions: {
      type: Array,
      default: () => ([]),
    } as Vue.PropOptions<{ label: string; value: string }[]>,
    relatedChapterPages: {
      type: Array,
      default: () => ([]),
    },
  },
  data () {
    return {
      BLOCK_TYPE,
      blockCopy: new LckBlockExtended(),
      tableViewDefinition: null as Record<string, LckTableView> | LckTableView | null,
      blockRefreshRequired: false,
      blockDisplayTableView: null as { text: string; value: string } | null,
      blockDisplayField: null as { text: string; value: string } | null,
    }
  },
  computed: {
    blockTypesValues () {
      return Object.values(BLOCK_TYPE)
    },
  },
  methods: {
    resetBlockSettings (blockType: string) {
      const defaultSettings = {}
      switch (blockType) {
        case BLOCK_TYPE.MEDIA:
          (defaultSettings as MediaSettings).medias = []
          break
        case BLOCK_TYPE.MAP_SET:
        case BLOCK_TYPE.MAP_FIELD:
          (defaultSettings as MapSettings).sources = []
          break
      }
      this.$set(this.blockCopy, 'settings', defaultSettings)
    },
    onFormSubmit () {
      this.$emit('input', {
        blockToEdit: this.blockCopy,
        blockRefreshRequired: this.blockRefreshRequired,
      })
      this.blockRefreshRequired = false
    },
    onComponentRefreshRequired (refreshRequired: boolean) {
      this.blockRefreshRequired = refreshRequired
    },
    // Manage the media block
    onUpdateMediaName ({ media, name }: { media: MediaConfiguration; name: string }) {
      media.name = name
    },
    onUpdateMediaSrcURL ({ media, srcURL }: { media: MediaConfiguration; srcURL: string }) {
      media.srcURL = srcURL
    },
    onUpdateMediaType ({ media, type }: { media: MediaConfiguration; type: MEDIA_TYPE.IMAGE | MEDIA_TYPE.VIDEO }) {
      media.type = type
    },
    onAddMedia () {
      (this.blockCopy.settings as MediaSettings).medias.push({
        name: '',
        srcURL: '',
        type: MEDIA_TYPE.IMAGE,
      })
    },
    onUpdateMediaDisplayMode (displayMode: MEDIA_TYPE) {
      if (displayMode === MEDIA_TYPE.IMAGE || displayMode === MEDIA_TYPE.VIDEO) {
        (this.blockCopy.settings as MediaSettings).medias.splice(1)
      }
    },
    onDeleteMedia (index: number) {
      (this.blockCopy.settings as MediaSettings).medias.splice(index, 1)
    },
    // Manage the map block
    onAddMapSource () {
      (this.blockCopy.settings as MapSettings).sources.push({
        id: '',
      })
    },
    onDeleteMapSource (index: number) {
      (this.blockCopy.settings as MapSettings).sources.splice(index, 1)
    },
    onUpdateMapSourceId ({ index, id }: { index: number; id: string | null }) {
      (this.blockCopy.settings as MapSettings).sources.splice(index, 1, {
        id: id || '',
      })
    },
    onUpdateMapSourceProperty ({ source, propertyName, propertyValue }: {
      source: MapSourceSettings;
      propertyName: string;
      propertyValue: string | boolean;
    }) {
      this.$set(source, propertyName, propertyValue)
    },
    onUpdateMapSourcePopupProperty ({ source, propertyName, propertyValue }: {
      source: MapSourceSettings;
      propertyName: string;
      propertyValue: string | boolean;
    }) {
      if (source.popupSettings) {
        this.$set(source.popupSettings, propertyName, propertyValue)
      } else {
        this.$set(source, 'popupSettings', { [propertyName]: propertyValue })
      }
    },
    onAddMapSourcePopupContent (popupSettings: { contentFields?: PopupContentField[]}) {
      if (!popupSettings.contentFields) {
        this.$set(popupSettings, 'contentFields', [{
          field: '',
        }])
      } else {
        popupSettings.contentFields.push({
          field: '',
        })
      }
    },
    onDeleteMapSourcePopupContent ({ contentFields, index }: { contentFields: PopupContentField[]; index: number }) {
      contentFields.splice(index, 1)
    },
    onUpdateMapSourcePopupContentProperty ({ content, propertyName, propertyValue }: {
      content: PopupContentField;
      propertyName: string;
      propertyValue: string | null;
    }) {
      this.$set(content, propertyName, propertyValue)
    },
  },
  watch: {
    block: {
      handler (newValue: LckBlockExtended) {
        this.blockCopy = { ...newValue }
        this.tableViewDefinition = newValue.definition ? newValue.definition : null
        delete this.blockCopy.displayTableView
        delete this.blockCopy.displayField
        delete this.blockCopy.loading
        delete this.blockCopy.pageLoaded
        delete this.blockCopy.createdAt
        delete this.blockCopy.updatedAt
        delete this.blockCopy.definition
        this.blockDisplayTableView = null
        this.blockDisplayField = null
        if (newValue.displayTableView) {
          this.blockDisplayTableView = {
            text: newValue.displayTableView.text,
            value: newValue.displayTableView.id,
          }
        }
        if (newValue.displayField) {
          this.blockDisplayField = {
            text: newValue.displayField.text,
            value: newValue.displayField.id,
          }
        }
        if (!this.blockCopy.settings) this.resetBlockSettings(this.blockCopy.type)
      },
      immediate: true,
    },
  },
}
</script>
