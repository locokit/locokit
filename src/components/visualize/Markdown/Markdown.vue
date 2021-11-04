<template>
  <div
    v-if="settings && settings.content"
    v-html="markdownToDisplay"
    :class="[settings.textColor, settings.textAlign]"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import marked from 'marked'

import { MarkdownSettings } from '@locokit/lck-glossary'

export default Vue.extend({
  name: 'Markdown',
  props: {
    settings: {
      type: Object as PropType<MarkdownSettings>,
      default: () => ({
        content: '',
      }),
    },
  },
  computed: {
    markdownToDisplay (): string {
      return marked(this.settings.content || '')
    },
  },
})
</script>

<style scoped>
::v-deep table td,
::v-deep table th {
  border: 1px solid #e9ecef;
  padding: 0.5rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
  line-break: loose;
  /*
    Draft in doing: https://drafts.csswg.org/css-text-4/#propdef-text-wrap
    Demo + Explain: https://opensource.adobe.com/balance-text/
    text-wrap: balance; // https://drafts.csswg.org/css-text-4/#valdef-text-wrap-balance
  */
  min-width: 5rem;
  vertical-align: top;
}

::v-deep table th {
  background-color: #ededed;
}

::v-deep table {
  margin: auto;
  border-collapse: collapse;
  display: inline-block;
  vertical-align: top;
  max-width: 100%;
  overflow-x: auto;
  border-spacing: 0;
}

</style>

<style scoped lang="scss">
// We need to use ::v-deep with v-html and scoped
::v-deep {
  padding: 1rem;
  background-color: var(--color-white);

  h2 {
    padding: 0.5rem 0;
  }

  a {
    text-decoration: underline;
    color: var(--primary-color);

    &:hover {
      text-decoration: none;
    }
  }

  table th {
    color: var(--primary-color-dark);
    background-color: #ededed;
  }

  &.primary {
    color: var(--primary-color);
  }

  &.secondary {
    color: var(--secondary-color);
  }

  &.danger {
    color: var(--color-error);
  }

  &.warning {
    color: var(--color-warning);
  }

  &.success {
    color: var(--color-success);
  }

  &:not(.success, .warning, .danger, .secondary, .primary) {
    color: var(--text-color);

    h1, h3, h5 {
      color: var(--primary-color);
    }

    h2, h4, h6 {
      color: var(--primary-color);
    }

    h2 {
      display: inline-block;

      &:after {
        display: block;
        width: 30px;
        height: 4px;
        content: "";
        background-color: var(--primary-color);
      }
    }
  }

  &.right {
    text-align: right;
  }

  &.center {
    text-align: center;
  }

  &.justify {
    text-align: justify;
  }

  &:not(.right, .center, .justify) {
    text-align: left;
  }
}
</style>
