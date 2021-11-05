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
  border-bottom: 1px solid var(--secondary-color-ligth);
  background-color: var(--color-white);
  min-height: 3rem;
  color: var(--primary-color);
}

.lck-toolbar-content {
  position: relative;
}
</style>
