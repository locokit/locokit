<template>
  <nav>
    <ul class="flex flex-col flex-wrap list-none pl-0">
      <li v-if="title" class="flex-grow text-left">
        <component :is="titleTag ?? 'h2'" class="mb-4 text-lg font-bold">
          {{ title }}
        </component>
      </li>
      <li v-for="link in links" class="group flex-grow text-left border-b last:border-b-0 border-slate-300">
        <RouterLink
          :to="{ name: link.routeName }"
          class="block px-5 py-4 hover:bg-slate-300 focus:bg-slate-200"
        >
          <i v-if="link.iconClass" class="mr-2 bi" :class="link.iconClass" aria-hidden="true"/>
          <span>{{ link.title }}</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
export type NavLink = {
  routeName: string
  title: string
  iconClass?: string
}
</script>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  links: NavLink[]
  title?: string
  titleTag?: string
}>()
</script>

<style scoped>
.router-link-exact-active {
  @apply ps-4 font-bold border-l-4 border-secondary bg-slate-200;
}
</style>
