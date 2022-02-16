<script>
import InputNumber from 'primevue/inputnumber'

export default {
  extends: InputNumber,
  methods: {
    onInputBlur (event) {
      InputNumber.methods.onInputBlur.call(this, event)
      this.$emit('blur', event)
    },
  },
}
</script>
