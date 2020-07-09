<template>
  <el-menu
      default-active="0-0"
      class="nav-chapters"
      background-color="#53acb4"
      text-color="#fff"
      active-text-color="#ffd04b"
  >
    <div v-if="chapters.length > 0">
      <el-submenu
        v-for="(chapter, index) in chapters"
        :key="chapter.id"
        :index="`${index}`"
      >
        <template slot="title">
          <span>Nom du chapter: {{chapter.text}}</span>
        </template>
        <div v-if="chapter.pages.length > 0">
            <el-menu-item
              v-for="(page, i) in chapter.pages"
              :key="page.id"
              :index="`${index}-${i}`"
            >
                <router-link :to="`${ROUTES_PATH.WORKSPACE}/page/${page.id}`">Nom de la page: {{page.text}}</router-link>
            </el-menu-item>
        </div>
      </el-submenu>
    </div>
  </el-menu>
</template>

<script>
import { ROUTES_PATH } from '../../../router/paths'

export default {
  name: 'Chapter',
  props: {
    chapters: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    chaptersEnhancedWithURLs () {
      if (this.chapters.length === 0) return []
      return this.chapters.map(c => ({
        ...c,
        pages: c.pages.map(p => ({
          ...p,
          url: '/workspace' + this.$route.params.workspaceId + '/page/' + p.id
        }))
      }))
    }
  },
  data () {
    return {
      ROUTES_PATH
    }
  }
}
</script>

<style scoped>
  .nav-chapters {
    height: calc(100vh - 64px);
  }
  .is-active {
    background-color: #ffffff;
  }
</style>
