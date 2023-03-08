<template>
  <Story title="Tags/SingleTag" icon="bi:tag-fill">
    <Variant title="allColor" auto-props-disabled>
      <p>Each combination for single tag</p>
      <div class="wrapper">
        <div v-for="color in COLOR_SCHEME" :key="color.name">
          <SingleTag class="m-4" v-bind="color" label="placeholder" />
        </div>
      </div>
    </Variant>
    <Variant title="example">
      <SingleTag class="m-4" v-bind="COLOR_SCHEME[17]" label="placeholder" />
    </Variant>
    <Variant title="default">
      <SingleTag class="m-4" label="placeholder" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import SingleTag from '../../components/SingleTag/SingleTag.vue'
import { COLOR_SCHEME } from '../../helpers/color'
</script>

<style scoped>
.wrapper {
  display: grid;
  grid-gap: 4px;
  grid-template-columns: repeat(8, 100px);
  grid-template-rows: 60px 60px 60px 60px;
  grid-auto-flow: column;
}
</style>

<docs lang="md">
### SingleTag

Add a tag for single select or display a tag
</docs>
