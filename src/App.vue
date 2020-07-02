<template>
  <div id="app" class="flex flex-col">
    <header class="h-16 flex bg-primary">
      <img alt="logo" src="/img/logo.png" class="my-auto" />
    </header>
    <main class="flex-grow">
      <router-view/>
    </main>
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style src="@/styles/main.css" />
