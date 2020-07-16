<template>
  <el-menu
    :default-openeds="listChaptersId"
    class="nav-chapters bg-primary text-white"
    active-text-color="#53acb4"
  >
    <el-submenu
      class="menu-chapter"
      v-for="chapter in chapters"
      :key="chapter.id"
      :index="`${chapter.id}`"
    >
      <template slot="title">
        <span class="text-white hover:text-primary">
          {{chapter.text}}
        </span>
      </template>
      <el-menu-item
        class="submenu-pages"
        :class="
          onRoute === `${ROUTES_PATH.WORKSPACE}/${chapter.workspace_id}/page/${page.id}`
          ? 'is-page-active text-primary bg-white'
          : 'bg-primary text-white hover:text-primary'
        "
        v-for="page in chapter.pages"
        :key="page.id"
        :index="`${chapter.id}-${page.id}`"
      >
        <router-link
          class="submenu-item-page block h-full"
          :to="`${ROUTES_PATH.WORKSPACE}/${chapter.workspace_id}/page/${page.id}`"
        >{{page.text}}
        </router-link>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
import { ROUTES_PATH } from '@/router/paths'

export default {
  name: 'Chapter',
  props: {
    chapters: {
      type: Array,
      default: () => [{
        text: 'No chapter to display'
      }]
    }
  },
  data () {
    return {
      ROUTES_PATH
    }
  },
  computed: {
    listChaptersId () {
      return this.chapters.map(({ id }) => `${id}`)
    },
    onRoute () {
      return this.$route.path
    }
  }
}
</script>

<style>
.menu-chapter .el-submenu__title {
  color: #ffffff;
}

.menu-chapter .el-submenu__title:hover {
  background-color: #a0dfe5;
}

.menu-chapter .el-submenu__icon-arrow {
  color: #ffffff;
  font-size: 1rem;
  font-weight: bold;
}
</style>
