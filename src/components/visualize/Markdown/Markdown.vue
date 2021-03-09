<template>
  <div
    v-if="settings && settings.content"
    v-html="markdownToDisplay"
  />
</template>

<script lang="ts">
import { MarkdownSettings } from '@locokit/lck-glossary'
import { PropType } from 'vue'
import marked from 'marked'

export default {
  name: 'Markdown',
  props: {
    settings: {
      type: Object as PropType<MarkdownSettings>,
      default: () => ({
        content: ''
      })
    }
  },
  computed: {
    markdownToDisplay () {
      return marked(this.settings.content || '')
    }
  }
}
</script>

<style scoped>
/deep/ table td,
/deep/ table th {
  border: 1px solid #e9ecef;
  padding: 0.5rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
  line-break: loose;
  text-wrap: balance;
  min-width: 5rem;
  vertical-align: top;
}

/deep/ table th {
  background-color: #ededed;
}

/deep/ table {
  margin: auto;
  border-collapse: collapse;
  display: inline-block;
  vertical-align: top;
  max-width: 100%;
  overflow-x: auto;
  border-collapse: collapse;
  border-spacing: 0;
}

</style>

<style lang="scss">
.lck-markdown {
  margin: 1rem;
  padding: 1rem;
  background-color: var(--background-color-light);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  h1, h3, h5 {
    color: var(--primary-color);
  }

  h2, h4, h6 {
    color: var(--surface-lck-1);
  }

  h2 {
    font-weight: 700;
    padding: 0.5rem 0;

    &:after {
      display: block;
      width: 30px;
      height: 4px;
      content: "";
      background-color: var(--primary-color);
    }
  }

  p, ol, ul, li {
    color: #495057;
  }

  a {
    text-decoration: underline;
    color: var(--primary-color);

    &:hover {
      text-decoration: none;
    }
  }

  table th {
    color: var(--primary-color-text);;
    background-color: #ededed;
  }
}
</style>
