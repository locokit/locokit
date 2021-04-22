<template>
  <input
    type="file"
    ref="input-file"
    @input="$emit('input', $refs['input-file'].files)"
    :multiple="true"
  />
</template>

<script>
export default {
  name: 'LckInputFile'
}
</script>
