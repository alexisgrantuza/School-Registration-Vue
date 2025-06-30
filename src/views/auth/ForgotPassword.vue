<template>
  <main>
    <img src="../assets/BG.png" alt="logo" />
    <ForgotPasswordForm />
  </main>
</template>

<script lang="ts" setup>
import ForgotPasswordForm from '@/components/forms/ForgotPassword.vue'
</script>

<style scoped>
* {
  background-color: #244bc5;
}
img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
