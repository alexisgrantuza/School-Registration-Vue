<template>
  <el-form
    :model="form"
    label-width="auto"
    style="
      max-width: 600px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    "
  >
    <el-form-item>
      <el-input
        v-model="form.username"
        placeholder="USERNAME"
        style="width: 300px; height: 45px; border-radius: 10px"
        clearable
        class="transparent-input"
        @keyup.enter="onSubmit"
        autocomplete="off"
      >
        <template #prefix>
          <el-icon><User /></el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item>
      <el-input
        v-model="form.password"
        placeholder="PASSWORD"
        show-password
        style="width: 300px; height: 45px; border-radius: 10px"
        clearable
        class="transparent-input"
        @keyup.enter="onSubmit"
        autocomplete="off"
      >
        <template #prefix>
          <el-icon><Lock /></el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        @click="onSubmit"
        style="
          width: 100%;
          height: 45px;
          border-radius: 4px;
          color: #244bc5;
          font-size: 16px;
          font-weight: 600;
          font-family: 'Montserrat';
          line-height: 20px;
          text-transform: uppercase;
          background-color: #fff;
          margin-top: 25px;
        "
      >
        Login
      </el-button>

      <div style="width: 100%; text-align: right; margin-top: -15px">
        <el-link
          href="/forgot-password"
          style="
            color: #fff;
            font-size: 16px;
            font-weight: 600;
            font-family: 'Montserrat';
            line-height: 20px;
            margin-top: 30px;
          "
        >
          Forgot password?
        </el-link>
      </div>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import { useAuthStore } from '../stores/auth'
import type { User } from '../types/auth'

const authStore = useAuthStore()

const router = useRouter()

const form = reactive({
  username: '',
  password: '',
})

// Simulate async login
const onSubmit = async () => {
  console.log('submit!')

  if (!form.username || !form.password) {
    ElMessage.error('Username and password are required')
    return
  }

  let loadingInstance: any
  try {
    loadingInstance = ElLoading.service({
      lock: true,
      text: 'Logging in... Please wait',
      background: 'rgba(0, 0, 0, 0.7)',
    })

    const userData: User = {
      username: form.username,
      password: form.password,
    }
    // const token = '4123123141241234123'
    const loginResult = await authStore.login(userData.username, userData.password || '')

    if (loginResult.success) {
      ElMessage.success('Login successful')
      router.push('/dashboard')
    } else {
      ElMessage.error(loginResult.error || 'Login failed. Please try again.')
    }
  } catch (error) {
    ElMessage.error('Login failed. Please try again.')

    console.error(error)
  } finally {
    if (loadingInstance) loadingInstance.close()
  }
}

onMounted(() => {
  // Initialize default credentials when login form shows
  authStore.DefaultCredentials()
  authStore.getAuth()

  if (authStore.isLoggedIn) {
    router.push('/dashboard')
  } else {
    router.push('/')
  }
})
</script>

<style scoped>
.transparent-input :deep(.el-input__wrapper) {
  background-color: transparent !important;
  box-shadow: none !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
}

.transparent-input :deep(.el-input__inner) {
  background-color: transparent !important;
  color: #fff !important;
}

.transparent-input :deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.7) !important;
}

.transparent-input :deep(.el-input__prefix) {
  color: #fff !important;
}

.transparent-input :deep(.el-input__prefix .el-icon) {
  color: #fff !important;
  font-size: 16px !important;
}

.transparent-input :deep(.el-input__suffix .el-input__clear) {
  color: #fff !important;
}

.transparent-input :deep(.el-input__suffix .el-input__password) {
  color: #fff !important;
}

.transparent-input :deep(.el-input__suffix .el-icon) {
  color: #fff !important;
}

.transparent-input :deep(.el-input__wrapper:focus-within) {
  border-color: rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2) inset !important;
}

.transparent-input :deep(.el-input__wrapper:hover) {
  border-color: rgba(255, 255, 255, 0.5) !important;
}
</style>
