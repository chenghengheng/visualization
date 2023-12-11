<script setup lang="ts">
import useEvents from '../stores/data'

// const { interval } = useEvents()
const postDetails = ref(false)
const dynamicTree = ref(true)
const persona = ref(true)
const attitude = ref(false)
const opinion = ref(true)
const density = ref(true)
const heat = ref(true)

watch(postDetails, (newValue) => {
  useEvents().showEvent = newValue
})

watch(attitude, (newValue) => {
  useEvents().showEmotion = newValue
})
</script>

<template>
  <div class="h-full w-full p-2">
    Checkbox Group 
    <div class="w-full ">
      <el-checkbox v-model="postDetails" label="post etails" size="large" />
      <el-checkbox v-model="dynamicTree" label="dynamic tree" size="large" />
      <el-checkbox v-model="persona" label="persona" size="large" />
      
      <el-checkbox v-model="attitude" label="attitude" size="large" />
      <el-checkbox v-model="opinion" label="opinion" size="large" />
      <el-checkbox v-model="density" label="density" size="large" />
      <el-checkbox v-model="heat" label="heat" size="large" />
      </div>    
  </div>
</template>
