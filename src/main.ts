import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { useStudentStore } from './stores/student'
import { useAuthStore } from './stores/auth'
import { generateFakeStudents } from './lib/seeder'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(ElementPlus)

// Initialize stores
const studentStore = useStudentStore()
const authStore = useAuthStore()

// Initialize the app
const initializeApp = async () => {
  // Restore authentication state and fetch students
  await authStore.getAuth()
  studentStore.fetchStudents()

  app.mount('#app')
}

initializeApp()
