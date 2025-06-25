<!-- src/views/NotFound.vue -->
<template>
  <div class="not-found-container">
    <!-- Animated background -->
    <div class="background-animation">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
        <div class="shape shape-5"></div>
      </div>
    </div>

    <!-- Main content -->
    <div class="content-wrapper">
      <!-- 404 Number with glitch effect -->
      <div
        class="error-code"
        @mouseenter="triggerGlitch"
        :class="{ 'glitch-active': glitchActive }"
      >
        <span class="glitch-text" data-text="404">404</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftBold, ArrowRightBold, Search } from '@element-plus/icons-vue'

const router = useRouter()
const searchQuery = ref('')
const glitchActive = ref(false)
const currentFact = ref('')

const facts = [
  'The first 404 error was at CERN in 1992 - the birthplace of the web!',
  "404 means 'Not Found' - but you probably knew that already 😉",
  'Some say 404 errors are where lost socks end up in the internet.',
  'The average person encounters 404 errors about 25 times per month.',
  '404 pages are a chance for websites to show their personality!',
  "In HTTP status codes, 4xx means client error - it's not the server's fault!",
  'Creative 404 pages can actually improve user experience and reduce bounce rates.',
]

const triggerGlitch = () => {
  glitchActive.value = true
  setTimeout(() => {
    glitchActive.value = false
  }, 500)
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // In a real app, you'd implement actual search functionality
    console.log('Searching for:', searchQuery.value)
    // For demo purposes, redirect to home with search query
    router.push(`/?search=${encodeURIComponent(searchQuery.value)}`)
  }
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

const getNewFact = () => {
  const randomIndex = Math.floor(Math.random() * facts.length)
  currentFact.value = facts[randomIndex]
}

// Initialize with random fact
onMounted(() => {
  getNewFact()
})
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: #764ba2;
  overflow: hidden;
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    sans-serif;
}

/* Animated Background */
.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.floating-shapes {
  position: relative;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 120px;
  height: 120px;
  top: 60%;
  right: 10%;
  animation-delay: 2s;
}

.shape-3 {
  width: 60px;
  height: 60px;
  top: 80%;
  left: 20%;
  animation-delay: 4s;
}

.shape-4 {
  width: 100px;
  height: 100px;
  top: 10%;
  right: 30%;
  animation-delay: 1s;
}

.shape-5 {
  width: 90px;
  height: 90px;
  bottom: 20%;
  left: 60%;
  animation-delay: 3s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-20px) rotate(120deg);
  }
  66% {
    transform: translateY(10px) rotate(240deg);
  }
}

/* Main Content */
.content-wrapper {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 600px;
  padding: 2rem;
  text-align: center;
}

/* 404 Error Code with Glitch Effect */
.error-code {
  margin-bottom: 2rem;
  cursor: pointer;
}

.glitch-text {
  font-size: 8rem;
  font-weight: 900;
  color: #fff;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  position: relative;
  display: inline-block;
  transition: all 0.3s ease;
}

.glitch-text:hover {
  transform: scale(1.05);
}

.glitch-active .glitch-text::before,
.glitch-active .glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch-active .glitch-text::before {
  animation: glitch-1 0.5s ease-in-out;
  color: #ff00ff;
  z-index: -1;
}

.glitch-active .glitch-text::after {
  animation: glitch-2 0.5s ease-in-out;
  color: #00ffff;
  z-index: -2;
}

@keyframes glitch-1 {
  0%,
  100% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 2px);
  }
  40% {
    transform: translate(-2px, -2px);
  }
  60% {
    transform: translate(2px, 2px);
  }
  80% {
    transform: translate(2px, -2px);
  }
}

@keyframes glitch-2 {
  0%,
  100% {
    transform: translate(0);
  }
  20% {
    transform: translate(2px, -2px);
  }
  40% {
    transform: translate(2px, 2px);
  }
  60% {
    transform: translate(-2px, -2px);
  }
  80% {
    transform: translate(-2px, 2px);
  }
}

@keyframes shimmer {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.9;
}

/* Responsive Design */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 1rem;
  }

  .glass-card {
    padding: 2rem 1.5rem;
  }

  .glitch-text {
    font-size: 5rem;
  }

  .title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .glitch-text {
    font-size: 4rem;
  }

  .glass-card {
    padding: 1.5rem 1rem;
  }

  .title {
    font-size: 1.5rem;
  }

  .description {
    font-size: 1rem;
  }
}
</style>
