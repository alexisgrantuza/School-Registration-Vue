<script setup lang="ts">
import LoginForm from '@/components/forms/LoginForm.vue'
import curve from '@/assets/yy.png'
import ellispse from '@/assets/tt.png'
</script>

<template>
  <main>
    <div class="container">
      <!-- Inject any component here-->
      <LoginForm />
      <img :src="curve" alt="curve" class="top-right" loading="eager" />
      <img :src="ellispse" alt="ellispse" class="bottom-left" loading="eager" />
    </div>
  </main>
</template>

<style scoped>
* {
  background-color: #244bc5;
}

/* Full-page container with centered content and relative positioning */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: var(--brand-blue);
  position: relative;
  z-index: 10;
}

/* Images positioning */
.top-right,
.bottom-left {
  position: absolute;
  z-index: -1;
}

.top-right {
  top: 0px;
  width: 60%;
  height: 100%;
  right: 0px;
}

.bottom-left {
  bottom: 0px;
  width: 40%;
  left: 0px;
}

/* Responsize adjustment for images */
@media (max-width: 1174px) {
  .top-right {
    width: 60%;
    height: 80%;
  }
}

@media (max-width: 560px) {
  .top-right {
    width: 80%;
    height: 80%;
  }
}

@media (max-width: 768px) {
  .bottom-left {
    width: 60%;
  }
}

@media (max-width: 375px) {
  .bottom-left {
    width: 50%;
  }
}
</style>
