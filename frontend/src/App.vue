<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <nav class="navbar bg-base-100">
    <RouterLink class="btn btn-ghost text-xl" to="/"> Main </RouterLink>
    <RouterLink class="btn btn-ghost text-xl" to="/post-message">Post message</RouterLink>
  </nav>
  <RouterView />
</template>

<style scoped>
.router-link-active {
  border-radius: 0;
  border-bottom: 2px solid #fff;
}
</style>
