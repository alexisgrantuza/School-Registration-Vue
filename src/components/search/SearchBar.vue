<template>
  <el-input
    v-model="inputValue"
    placeholder="Search students by name..."
    :prefix-icon="Search"
    size="large"
    clearable
    class="search-input"
    @input="handleSearchQueryUpdate"
  />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'

const props = defineProps({
  searchQuery: {
    type: String,
    required: true,
  },
})
const emit = defineEmits(['searchQuery'])

const inputValue = ref(props.searchQuery)

// watch for search query and pass it to the other component

watch(
  () => props.searchQuery,
  (newVal) => {
    inputValue.value = newVal
  },
)

const handleSearchQueryUpdate = (value: string) => {
  emit('searchQuery', value)
}
</script>
