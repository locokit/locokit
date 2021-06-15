<template>
  <div>
    <h4>{{ this.title }}</h4>
    <div v-if="result" class="p-grid">
      <div class="p-col-12 lck-synthesis">
        <p class="lck-synthesis-result">{{ this.result }}</p>
      </div>
    </div>
    <div v-else>
      {{ this.noResult }}
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'HighlightField',
  props: {
    title: {
      type: String,
      default: ''
    },
    result: {
      type: String,
      default: ''
    },
    noResult: {
      type: String,
      default: ''
    }
  }
})
</script>

<style scoped>
.lck-synthesis {
  color: var(--primary-color);
}
.lck-synthesis-result {
  font-size: 1.5em;
  margin-block-start: 0.83em;
  margin-block-end: 0.83em;
  font-weight: bold;
}
</style>
