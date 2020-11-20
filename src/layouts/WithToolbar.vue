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
      <slot name='toolbar'>
      </slot>
    </div>
    <div class="lck-toolbar-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.lck-toolbar {
  border-bottom: 1px solid var(--header-border-bottom-color);
  background-color: var(--header-background-color);
  height: 2.5rem;
  max-height: 2.5rem;
}
</style>
