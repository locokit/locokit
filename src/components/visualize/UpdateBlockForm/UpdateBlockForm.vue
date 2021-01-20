<template>
  <lck-form
    :submitting="submitting"
    @submit="$emit('input', blockCopy)"
    @cancel="$emit('close')"
    class="lck-update-block-form"
  >
    <div class="p-field">
      <label for="blockTitleField">{{ $t('pages.workspace.block.title') }}</label>
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
        :options="blockTypes"
        required
      />
    </div>
    <component
      v-bind:is="getBlockSettingsUpdateComponent(blockCopy.type)"
      :blockSettings="blockCopy.settings" />
  </lck-form>
</template>

<script lang="ts">

import Vue from 'vue'
import { BLOCK_TYPE, Block } from '@locokit/lck-glossary'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import cloneDeep from 'lodash/cloneDeep'

import LckForm from '@/components/ui/Form/Form.vue'
import UpdateParagraphFields from '@/components/visualize/UpdateBlockForm/UpdateParagraphFields/UpdateParagraphFields.vue'
import UpdateMarkdownFields from '@/components/visualize/UpdateBlockForm/UpdateMarkdownFields/UpdateMarkdownFields.vue'
import UpdateMediaFields from '@/components/visualize/UpdateBlockForm/UpdateMediaFields/UpdateMediaFields.vue'

export default {
  name: 'PageDialog',
  components: {
    'p-input-text': Vue.extend(InputText),
    'p-dropdown': Vue.extend(Dropdown),
    'lck-form': LckForm,
    'update-paragraph-fields': UpdateParagraphFields,
    'update-markdown-fields': UpdateMarkdownFields,
    'update-media-fields': UpdateMediaFields
  },
  props: {
    block: {
      type: Object as Vue.PropType<Block>,
      default: () => ({})
    },
    submitting: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      blockCopy: {}
    }
  },
  computed: {
    blockTypes () {
      return Object.values(BLOCK_TYPE)
    }
  },
  watch: {
    block: {
      handler ({ id, title, type, settings }) {
        this.blockCopy = {
          id,
          title,
          type,
          settings: cloneDeep(settings || {})
        }
      },
      immediate: true
    }
  },
  methods: {
    getBlockSettingsUpdateComponent (blockType: string) {
      switch (blockType) {
        case BLOCK_TYPE.PARAGRAPH:
          return 'update-paragraph-fields'
        case BLOCK_TYPE.MARKDOWN:
          return 'update-markdown-fields'
        case BLOCK_TYPE.MEDIA:
          return 'update-media-fields'
      }
    }
  }
}
</script>

<style scoped>
.lck-update-block-form {
  position: relative;
}

.lck-update-block-form input {
  display: block;
}
</style>
