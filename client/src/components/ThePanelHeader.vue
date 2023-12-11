<script setup lang="ts">
const { title } = defineProps({
  title: {
    type: String,
    default: '',
  },
  backgroundColor: {
    type: String,
    default: 'bg-regal-blue',
  },
})
</script>

<template>
  <div
    class="h-4% flex items-center gap-2 border-b border-gray-200 px-2 text-white text-xl"
    :class="backgroundColor"
  >
    <div>
      {{ title }}
    </div>
  </div>
</template>
