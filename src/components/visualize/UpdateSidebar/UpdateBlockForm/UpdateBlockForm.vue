<template>
  <lck-form
    :submitting="submitting"
    @submit="onFormSubmit"
    @cancel="$emit('close')"
    class="lck-update-block-form lck-color-content p-text-bold"
  >
    <div class="p-field ">
      <label for="blockTitleField">{{ $t('pages.workspace.block.name') }}</label>
      <p-input-text
        id="blockTitleField"
        v-model="blockCopy.title"
      />
    </div>
    <div class="p-field">
      <label for="blockTypeField">{{ $t('pages.workspace.block.type') }}</label>
      <p-dropdown
        id="blockTypeField"
        v-model="blockCopy.type"
        :placeholder="$t('components.datatable.placeholder')"
        :options="blockTypesValues"
        @input="resetBlockSettings"
      />
    </div>

    <div class="p-field p-d-flex p-flex-column">
      <label for="blockElevation">
        {{ $t('pages.workspace.block.elevation') }}
      </label>
      <p-switch
        id="blockElevation"
        v-model="blockCopy.elevation"
      />
    </div>

    <!-- Custom settings -->
    <paragraph-settings-fields
      v-if="blockCopy.type === BLOCK_TYPE.PARAGRAPH"
      :content.sync="blockCopy.settings.content"
    />
    <markdown-settings-fields
      v-else-if="blockCopy.type === BLOCK_TYPE.MARKDOWN"
      :content.sync="blockCopy.settings.content"
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
      :tableViewDefinition="blockCopy.definition"
      :relatedChapterPages="relatedChapterPages"
      :autocompleteSuggestions="autocompleteSuggestions"
      @search-table-view="$emit('search-table-view', $event)"
      @component-refresh-required="onComponentRefreshRequired"
    />
    <data-record-settings-fields
      v-else-if="blockCopy.type === BLOCK_TYPE.DATA_RECORD"
      :id.sync="blockCopy.settings.id"
      :tableViewDefinition="blockCopy.definition"
      :autocompleteSuggestions="autocompleteSuggestions"
      @search-table-view="$emit('search-table-view', $event)"
      @component-refresh-required="onComponentRefreshRequired"
    />
    <map-settings-fields
      v-else-if="[BLOCK_TYPE.MAP_SET, BLOCK_TYPE.MAP_FIELD].includes(blockCopy.type)"
      :id.sync="blockCopy.settings.id"
      :tableViewDefinition="blockCopy.definition"
      :relatedChapterPages="relatedChapterPages"
      :pageDetailId.sync="blockCopy.settings.pageDetailId"
      :autocompleteSuggestions="autocompleteSuggestions"
      @search-table-view="$emit('search-table-view', $event)"
      @component-refresh-required="onComponentRefreshRequired"
    />
    <action-button-settings-fields
      v-else-if="blockCopy.type === BLOCK_TYPE.ACTION_BUTTON"
      :id.sync="blockCopy.settings.id"
      :label.sync="blockCopy.settings.label"
      :classButton.sync="blockCopy.settings.classButton"
      :icon.sync="blockCopy.settings.icon"
      :action.sync="blockCopy.settings.action"
      :processId.sync="blockCopy.settings.processId"
      :typePageTo.sync="blockCopy.settings.typePageTo "
      :pageDetailId.sync="blockCopy.settings.pageDetailId"
      :pageRedirectId.sync="blockCopy.settings.pageRedirectId"
      :pageQueryFieldId.sync="blockCopy.settings.pageQueryFieldId"
      :tableViewDefinition="blockCopy.definition"
      :autocompleteSuggestions="autocompleteSuggestions"
      @search-table-view="$emit('search-table-view', $event)"
      :displayFieldId.sync="blockCopy.settings.displayFieldId"
      :displayFieldConditionQuery.sync="blockCopy.settings.displayFieldConditionQuery"
    />
  </lck-form>
</template>

<script lang="ts">
import Vue from 'vue'

import { BLOCK_TYPE, MediaSettings, MEDIA_TYPE } from '@locokit/lck-glossary'
import { LckBlockExtended, MediaConfiguration } from '@/services/lck-api/definitions'

import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import InputSwitch from 'primevue/inputswitch'

import LckForm from '@/components/ui/Form/Form.vue'
import ParagraphSettingsFields from '@/components/visualize/UpdateSidebar/UpdateBlockForm/BlockSettingsFields/ParagraphSettingsFields.vue'
import MarkdownSettingsFields from '@/components/visualize/UpdateSidebar/UpdateBlockForm/BlockSettingsFields/MarkdownSettingsFields.vue'
import MediaSettingsFields from '@/components/visualize/UpdateSidebar/UpdateBlockForm/BlockSettingsFields/MediaSettingsFields.vue'
import TableSetSettingsFields from '@/components/visualize/UpdateSidebar/UpdateBlockForm/BlockSettingsFields/TableSetSettingsFields.vue'
import DataRecordSettingsFields from '@/components/visualize/UpdateSidebar/UpdateBlockForm/BlockSettingsFields/DataRecordSettingsFields.vue'
import MapSettingsFields from '@/components/visualize/UpdateSidebar/UpdateBlockForm/BlockSettingsFields/MapSettingsFields.vue'
import ActionButtonSettingsFields from '@/components/visualize/UpdateSidebar/UpdateBlockForm/BlockSettingsFields/ActionButtonSettingsFields.vue'

export default {
  name: 'UpdateBlockForm',
  components: {
    'lck-form': LckForm,
    'paragraph-settings-fields': ParagraphSettingsFields,
    'markdown-settings-fields': MarkdownSettingsFields,
    'media-settings-fields': MediaSettingsFields,
    'table-set-settings-fields': TableSetSettingsFields,
    'data-record-settings-fields': DataRecordSettingsFields,
    'map-settings-fields': MapSettingsFields,
    'action-button-settings-fields': ActionButtonSettingsFields,
    'p-input-text': Vue.extend(InputText),
    'p-switch': Vue.extend(InputSwitch),
    'p-dropdown': Vue.extend(Dropdown)
  },
  props: {
    block: {
      type: Object as Vue.PropType<LckBlockExtended>,
      required: true
    },
    submitting: {
      type: Boolean,
      default: false
    },
    autocompleteSuggestions: {
      type: Array,
      default: () => ([])
    } as Vue.PropOptions<{ label: string; value: string }[]>,
    relatedChapterPages: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      BLOCK_TYPE,
      blockCopy: new LckBlockExtended(),
      blockRefreshRequired: false
    }
  },
  computed: {
    blockTypesValues () {
      return Object.values(BLOCK_TYPE)
    }
  },
  methods: {
    resetBlockSettings (blockType: string) {
      const defaultSettings = {}
      switch (blockType) {
        case BLOCK_TYPE.MEDIA:
          (defaultSettings as MediaSettings).medias = []
          break
      }
      this.$set(this.blockCopy, 'settings', defaultSettings)
    },
    onFormSubmit () {
      this.$emit('input', {
        blockToEdit: this.blockCopy,
        blockRefreshRequired: this.blockRefreshRequired
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
        type: MEDIA_TYPE.IMAGE
      })
    },
    onUpdateMediaDisplayMode (displayMode: MEDIA_TYPE) {
      if (displayMode === MEDIA_TYPE.IMAGE || displayMode === MEDIA_TYPE.VIDEO) {
        (this.blockCopy.settings as MediaSettings).medias.splice(1)
      }
    },
    onDeleteMedia (index: number) {
      (this.blockCopy.settings as MediaSettings).medias.splice(index, 1)
    }
  },
  watch: {
    block: {
      handler (newValue: LckBlockExtended) {
        this.blockCopy = { ...newValue }
        if (!this.blockCopy.settings) this.resetBlockSettings(this.blockCopy.type)
      },
      immediate: true
    }
  }
}
</script>
