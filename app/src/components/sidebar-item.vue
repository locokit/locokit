<template>
  <li>
    <router-link
      activeClass="font-bold"
      exactActiveClass="font-bold"
      :to="item.to"
      class="flex items-center justify-between hover:font-bold hover:bg-primary hover:text-white p-1 rounded"
      @click="isOpened = !isOpened"
    >
      <span class="flex items-center gap-2">
        <i :class="item.icon"></i>
        {{ item.label }}
      </span>
      <i
        v-if="item.children"
        class="bi font-bold text-xs"
        :class="{ 'bi-chevron-right': !isOpened, 'bi-chevron-down': isOpened }"
      />
    </router-link>
    <ul v-if="item.children && isOpened" class="ml-3 my-1 pl-3 border-l hover:border-primary-400">
      <sidebar-item :item="i" v-for="i in item.children" :key="i.key" />
    </ul>
  </li>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'

export type SidebarItemProp = {
  key: string
  label: string
  icon: string
  to: RouteLocationRaw
  children?: SidebarItemProp[]
}

const isOpened = ref(false)

defineProps<{
  item: SidebarItemProp
}>()
</script>
