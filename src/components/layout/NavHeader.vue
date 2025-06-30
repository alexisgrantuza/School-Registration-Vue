<template>
  <el-header class="app-header">
    <div class="header-container">
      <!-- Logo -->
      <div class="brand">
        <span class="brand-name">LULULEMON</span>
      </div>

      <!-- Desktop Actions -->
      <div class="desktop-actions">
        <el-input
          v-model="searchQuery"
          placeholder="Search..."
          class="search-input"
          :prefix-icon="Search"
          clearable
          @input="$emit('searchQuery', $event)"
        />

        <el-button circle @click="toggleTheme" class="theme-btn">
          <el-icon><Sunny v-if="isDark" /><Moon v-else /></el-icon>
        </el-button>

        <el-dropdown @command="handleCommand">
          <div class="user-menu">
            <el-avatar :size="32" class="user-avatar">
              <el-icon><User /></el-icon>
            </el-avatar>
            <span class="username">{{ username }}</span>
            <el-icon class="arrow"><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><User /></el-icon> Profile
              </el-dropdown-item>
              <el-dropdown-item command="settings">
                <el-icon><Setting /></el-icon> Settings
              </el-dropdown-item>
              <el-dropdown-item divided command="logout" @click="handleLogout">
                <el-icon><SwitchButton /></el-icon> Logout
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <!-- Mobile Actions -->
      <div class="mobile-actions">
        <el-button circle @click="showMobileSearch = !showMobileSearch" class="mobile-btn">
          <el-icon><Search /></el-icon>
        </el-button>

        <el-button circle @click="toggleTheme" class="mobile-btn">
          <el-icon><Sunny v-if="isDark" /><Moon v-else /></el-icon>
        </el-button>

        <el-dropdown @command="handleCommand">
          <el-avatar :size="32" class="mobile-avatar">
            <el-icon><User /></el-icon>
            <span class="username">{{ username }}</span>
          </el-avatar>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><User /></el-icon> Profile
              </el-dropdown-item>
              <el-dropdown-item command="settings">
                <el-icon><Setting /></el-icon> Settings
              </el-dropdown-item>
              <el-dropdown-item divided command="logout" @click="handleLogout">
                <el-icon><SwitchButton /></el-icon> Logout
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- Mobile Search Bar -->
    <div v-if="showMobileSearch" class="mobile-search">
      <el-input
        v-model="searchQuery"
        placeholder="Search..."
        :prefix-icon="Search"
        clearable
        @input="$emit('searchQuery', $event)"
      />
    </div>
  </el-header>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  User,
  Setting,
  Search,
  Sunny,
  Moon,
  ArrowDown,
  SwitchButton,
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const isDark = ref(false)
const showMobileSearch = ref(false)
const searchQuery = ref('')
const authStore = useAuthStore()

// Make username reactive to auth store changes
const username = computed(() => authStore.getUser.username || 'User')

defineEmits(['searchQuery'])

const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      // Handle logout
      ElMessage.success('Logged out successfully')
      router.push('/')
      break
  }
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}

const handleLogout = () => {
  authStore.logout()
  ElMessage.success('Logged out successfully')
  router.push('/')
}
</script>

<style scoped>
.app-header {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0;
  height: auto;
  min-height: 60px;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 24px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Brand */
.brand {
  flex: 0 0 auto;
  margin-right: 24px;
}

.brand-name {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
  letter-spacing: -0.5px;
  white-space: nowrap;
}

/* Desktop Actions */
.desktop-actions {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
  justify-content: flex-end;
}

.search-input {
  width: 240px;
  margin-right: 12px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 20px;
  background: #f5f7fa;
}

.theme-btn {
  border: none;
  background: #f5f7fa;
  transition: all 0.2s;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.theme-btn:hover {
  background: #409eff;
  color: #fff;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 16px;
  border-radius: 20px;
  border: none;
  outline: none;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
  min-width: 150px;
}

.user-menu:hover {
  background: #f5f7fa;
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin: 0 4px;
}

.arrow {
  width: 12px;
  height: 12px;
  color: #909399;
  margin-left: auto;
}

/* Mobile Actions */
.mobile-actions {
  display: none;
  align-items: center;
  gap: 16px;
}

.mobile-btn {
  border: none;
  background: #f5f7fa;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.mobile-avatar {
  cursor: pointer;
  width: 40px !important;
  height: 40px !important;
}

/* Mobile Search */
.mobile-search {
  padding: 12px 24px;
  background: #f5f7fa;
  border-top: 1px solid #e4e7ed;
}

.mobile-search .el-input {
  width: 100%;
}

/* Dark Theme */
.dark .app-header {
  background: #1f2937;
  border-bottom-color: #374151;
}

.dark .brand-name {
  color: #fff;
}

.dark .username {
  color: #fff;
}

.dark .theme-btn,
.dark .mobile-btn {
  background: #374151;
  color: #d1d5db;
}

.dark .user-menu:hover {
  background: #374151;
}

.dark .mobile-search {
  background: #374151;
}

/* Responsive Breakpoints */
@media (max-width: 1024px) {
  .search-input {
    width: 200px;
  }
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 20px;
  }

  .desktop-actions {
    display: none;
  }

  .mobile-actions {
    display: flex;
  }

  .brand-name {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .header-container {
    padding: 0 16px;
  }

  .mobile-actions {
    gap: 12px;
  }

  .mobile-btn {
    width: 36px;
    height: 36px;
  }

  .mobile-avatar {
    width: 36px !important;
    height: 36px !important;
  }
}
</style>
