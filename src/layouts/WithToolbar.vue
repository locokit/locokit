<template>
  <div>
    <div
      class="
        p-p-1
        p-d-flex
        p-jc-between
        p-ai-center
        lck-toolbar
      "
    >
      <slot name='toolbar' />
    </div>
    <div
      class="
        lck-toolbar-content
        p-d-flex
        p-flex-column
        d-flex-1
        o-auto
      "
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.lck-toolbar {
  border-bottom: 1px solid var(--header-border-bottom-color);
  background-color: var(--header-background-color);
  height: 3rem;
  max-height: 3rem;
}
.lck-toolbar-content {
  position: relative;
}
</style>
