<script setup lang="ts">
import LoginForm from '@/components/forms/LoginForm.vue'
</script>

<template>
  <main>
    <img src="@/assets/BG.png" alt="logo" />
    <LoginForm />
  </main>
</template>

<style scoped>
* {
  background-color: #244bc5;
}
img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  aspect-ratio: 16/9;
}
</style>
