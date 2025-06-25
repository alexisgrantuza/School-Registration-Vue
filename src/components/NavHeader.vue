<template>
  <el-header class="app-header">
    <div class="header-container">
      <!-- Logo and Brand -->
      <div class="brand-section">
        <el-icon class="logo-icon" :size="28">
          <Component />
        </el-icon>
        <span class="brand-name">LULULEMON</span>
      </div>

      <!-- Navigation Menu -->
      <div class="nav-section">
        <el-menu
          :default-active="activeIndex"
          class="nav-menu"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="1">
            <el-icon><House /></el-icon>
            <span>Home</span>
          </el-menu-item>
          <el-menu-item index="2">
            <el-icon><Setting /></el-icon>
            <span>Settings</span>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- Right Section -->
      <div class="actions-section">
        <!-- Search -->
        <el-input
          v-model="props.searchQuery"
          placeholder="Search..."
          class="search-input"
          :prefix-icon="Search"
          clearable
          @input="handleSearch"
        />

        <!-- Notifications -->
        <el-badge
          :value="notificationCount"
          :hidden="notificationCount === 0"
          class="notification-badge"
        >
          <el-button circle class="action-btn">
            <el-icon><Bell /></el-icon>
          </el-button>
        </el-badge>

        <!-- Theme Toggle -->
        <el-button circle @click="toggleTheme" class="action-btn">
          <el-icon><Sunny v-if="isDark" /><Moon v-else /></el-icon>
        </el-button>

        <!-- User Menu -->
        <el-dropdown @command="handleCommand" class="user-dropdown">
          <div class="user-info">
            <el-avatar :size="36" :src="userAvatar" class="user-avatar">
              <el-icon><User /></el-icon>
            </el-avatar>
            <span class="username">{{ username }}</span>
            <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><User /></el-icon>
                Profile
              </el-dropdown-item>
              <el-dropdown-item command="settings">
                <el-icon><Setting /></el-icon>
                Settings
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <el-icon><SwitchButton /></el-icon>
                Logout
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </el-header>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  House,
  User,
  Setting,
  Search,
  Bell,
  Sunny,
  Moon,
  ArrowDown,
  SwitchButton,
} from '@element-plus/icons-vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const activeIndex = ref('1')
const notificationCount = ref(3)
const isDark = ref(false)
const username = ref(authStore.getUser.username)
const userAvatar = ref('https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png')

const props = defineProps({
  searchQuery: {
    type: String,
    required: true,
  },
})
const emit = defineEmits(['searchQuery'])

const handleSelect = (key: string) => {
  activeIndex.value = key

  switch (key) {
    case '1':
      router.push('/dashboard')
      break
    case '2':
      router.push('/projects')
      break
    case '3':
      router.push('/users')
      break
    case '4':
      router.push('/settings')
      break
  }
}

const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      ElMessage.info('Navigating to profile')
      break
    case 'settings':
      router.push('/settings')
      ElMessage.info('Navigating to settings')
      break
    case 'logout':
      handleLogout()
      break
  }
}

const handleLogout = () => {
  authStore.logout()
  ElMessage.success('Logged out successfully')
  router.push('/')
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  ElMessage.success(`Switched to ${isDark.value ? 'dark' : 'light'} theme`)
}

const handleSearch = (query: string) => {
  emit('searchQuery', query)
}
</script>

<style scoped>
.app-header {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 0;
  height: 60px;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Brand Section */
.brand-section {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 200px;
}

.logo-icon {
  color: #409eff;
  font-weight: bold;
}

.brand-name {
  font-size: 20px;
  font-weight: bolder;
  color: #303133;
  letter-spacing: -0.5px;
}

/* Navigation Section */
.nav-section {
  flex: 1;
  display: flex;
  justify-content: center;
  max-width: 500px;
}

.nav-menu {
  border-bottom: none;
  background: transparent;
}

.nav-menu .el-menu-item {
  border-bottom: 2px solid transparent;
  height: 60px;
  line-height: 60px;
  padding: 0 20px;
  color: #606266;
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-menu .el-menu-item:hover {
  background-color: #f5f7fa;
  color: #409eff;
}

.nav-menu .el-menu-item.is-active {
  border-bottom-color: #409eff;
  color: #409eff;
  background-color: #ecf5ff;
}

.nav-menu .el-menu-item .el-icon {
  margin-right: 8px;
  width: 18px;
  height: 18px;
}

/* Actions Section */
.actions-section {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 300px;
  justify-content: flex-end;
}

.search-input {
  width: 200px;
}

.search-input :deep(.el-input__wrapper) {
  background-color: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.search-input :deep(.el-input__wrapper:hover) {
  border-color: #c0c4cc;
}

.search-input :deep(.el-input__wrapper.is-focus) {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.action-btn {
  border: none;
  background-color: #f5f7fa;
  color: #606266;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background-color: #409eff;
  color: #fff;
}

.notification-badge {
  position: relative;
}

/* User Dropdown */
.user-dropdown {
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 20px;
  transition: all 0.3s ease;
  outline: none;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.user-avatar {
  border: 2px solid #e4e7ed;
}

.username {
  font-weight: 500;
  color: #303133;
  font-size: 14px;
}

.dropdown-icon {
  width: 12px;
  height: 12px;
  color: #909399;
  transition: transform 0.3s ease;
}

.user-dropdown.is-active .dropdown-icon {
  transform: rotate(180deg);
}

/* Dark Theme Support */
.dark .app-header {
  background: #1f2937;
  border-bottom-color: #374151;
}

.dark .brand-name {
  color: #fff;
}

.dark .nav-menu .el-menu-item {
  color: #d1d5db;
}

.dark .nav-menu .el-menu-item:hover {
  background-color: #374151;
  color: #60a5fa;
}

.dark .nav-menu .el-menu-item.is-active {
  background-color: #1e40af;
  color: #93c5fd;
}

.dark .username {
  color: #fff;
}

.dark .action-btn {
  background-color: #374151;
  color: #d1d5db;
}

.dark .action-btn:hover {
  background-color: #60a5fa;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-container {
    padding: 0 16px;
  }

  .nav-section {
    display: none;
  }

  .search-input {
    width: 150px;
  }

  .username {
    display: none;
  }
}
</style>
