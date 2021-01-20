<template>
  <div>
    <h4>{{ this.title }}</h4>
    <div v-if="result" class="p-grid">
      <div class="p-col-12 lck-color-page-title">
        <h2>{{ this.result }}</h2>
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
  name: 'Synthesis',
  props: {
    title: "",
    result: "",
    noResult: ""
  }
})
</script>
