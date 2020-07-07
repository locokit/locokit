<template>
  <el-menu
      default-active="0-0"
      class="el-menu-vertical-demo"
  >
    <div v-if="chapters.length > 0">
      <el-submenu
        v-for="(chapter, index) in chapters"
        :key="chapter.id"
        :index="`${index}`"
      >
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>Nom du chapter: {{chapter.text}}</span>
        </template>
        <div v-if="chapter.pages.length > 0">
            <el-menu-item
              v-for="(page, i) in chapter.pages"
              :key="page.id"
              :index="`${index}-${i}`"
            >
              Nom de la page: {{page.text}}
            </el-menu-item>
        </div>
      </el-submenu>
    </div>
  </el-menu>
</template>

<script>
export default {
  name: 'Chapter',
  props: {
    chapters: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>

</style>
