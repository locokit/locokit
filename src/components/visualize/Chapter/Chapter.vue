<template>
  <el-menu
      :default-openeds="listChaptersId"
      class="nav-chapters"
  >
    <div v-if="chapters.length > 0">
      <el-submenu
          class="menu-chapter"
          v-for="(chapter) in chapters"
          :key="chapter.id"
          :index="`${chapter.id}`"
      >
        <template slot="title">
          <span>Nom du chapter: {{chapter.text}}</span>
        </template>
        <div v-if="chapter.pages.length > 0">
          <el-menu-item
              class="submenu-pages"
              :class="{'is-page-active': onRoute === `${ROUTES_PATH.WORKSPACE}/${chapter.workspace_id}/page/${page.id}`}"
              v-for="(page) in chapter.pages"
              :key="page.id"
              :index="`${chapter.id}-${page.id}`"
          >
            <router-link
                class="submenu-item-page"
                :to="`${ROUTES_PATH.WORKSPACE}/${chapter.workspace_id}/page/${page.id}`"
            >Nom de la page: {{page.text}}
            </router-link>
          </el-menu-item>
        </div>
      </el-submenu>
    </div>
  </el-menu>
</template>

<script>
import { ROUTES_PATH } from '@/router/paths'

export default {
  name: 'Chapter',
  props: {
    chapters: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      ROUTES_PATH,
      listChaptersId: []
    }
  },
  mounted () {
    this.listChaptersId = this.chapters.map(({ id }) => `${id}`)
  },
  computed: {
    onRoute () {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
  .nav-chapters {
    height: calc(100vh - 64px);
    background-color: #53acb4;
    color: #ffffff;
  }

  /deep/ .el-submenu__title, .submenu-pages {
    color: #ffffff;
  }

  /deep/ .el-submenu__title:hover, .submenu-pages:hover {
    background-color: #a0dfe5;
  }

  /deep/ .el-submenu__icon-arrow {
    color: #ffffff;
    font-size: 1rem;
    font-weight: bold;
  }

  .menu-chapter >>> ul {
    background-color: #53acb4;
  }

  .submenu-item-page {
    display: block;
    height: 100%;
  }

  /deep/ .is-page-active {
    background-color: #ffffff;
    color: #53acb4;
  }
</style>
