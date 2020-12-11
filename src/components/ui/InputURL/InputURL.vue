<template>
  <span class="p-input-icon-right">
    <p-input-text
      :class="{
        'input-url-valid': validURL
      }"
      v-on="$listeners"
      v-bind="$attrs"
      :appendTo="appendTo"
      :value="value"
      type="url"
      ref="inputURL"
    >
    </p-input-text>
    <i v-show="validURL" class="pi pi-external-link" @click="openLink" />
  </span>

</template>

<script>
import Vue from 'vue'
import InputText from 'primevue/inputtext'

export default {
  name: 'LckInputURL',
  components: {
    'p-input-text': Vue.extend(InputText)
  },
  props: {
    appendTo: {
      type: String,
      default: 'body'
    },
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      validURL: false
    }
  },
  mounted () {
    this.validURL = this.urlValidity()
  },
  methods: {
    openLink () {
      if (!this.validURL) return
      try {
        window.open(this.value, '_blank')
      } catch (error) {}
    },
    urlValidity () {
      return this.value && this.$refs?.inputURL?.$el.checkValidity()
    }
  },
  watch: {
    value () {
      this.validURL = this.urlValidity()
    }
  }
}
</script>

<style scoped>
.input-url-valid {
  text-decoration: underline;
}
.pi-external-link {
  cursor: pointer;
}

</style>
