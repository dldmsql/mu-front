<template>
  <div id="app">
    <Navbar />
    <router-view />
  </div>
</template>

<script>
import Navbar from './components/AppNavbar.vue'

export default {
  components: { Navbar },
}
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

#app {
  display: flex;
}
</style>
