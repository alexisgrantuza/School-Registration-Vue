import { ref } from 'vue'

export const useToggle = () => {
  const viewMode = ref<'grid' | 'list'>('grid')
  const toggleView = (mode: 'grid' | 'list') => {
    viewMode.value = mode
  }

  return {
    viewMode,
    toggleView,
  }
}
