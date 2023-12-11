<script setup lang="ts">
import useDataStore from '../stores/data'

const store = useDataStore()
const startTimeRef = ref(Date.parse("2016-10-31 18:59:35"))
const endTimeRef = ref(Date.parse("2017-01-01 17:42:26"))

watch(() => startTimeRef.value, (newValue) => {
  if (newValue === null || newValue < 1477911575000 || newValue > 1483263746000) {
    newValue = 1477911575000
  }
  // console.log("time control changes start time:", newValue)
  store.updateStartTime(newValue)
})

watch(() => endTimeRef.value, (newValue) => {
  if (newValue === null || newValue < 1477911575000 || newValue > 1483263746000 || newValue <= startTimeRef.value) {
    newValue = 1483263746000
  }
  // console.log("time control changes end time:", newValue)
  store.updateEndTime(newValue)
})
</script>

<template>
  <div class="my-1 mx-1">
    <el-date-picker
      v-model="startTimeRef"
      type="datetime"
      placeholder="2016-10-31 18:59:35"
      format="YYYY-MM-DD HH:mm:ss"
      value-format="x"
      class="mr-1 mt-1 ml-1 mb-1"
    ></el-date-picker>
    <el-date-picker
      v-model="endTimeRef"
      type="datetime"
      placeholder="2017-01-01 17:42:26"
      format="YYYY-MM-DD HH:mm:ss"
      value-format="x"
      class="mt-1 ml-1 mb-1"
    ></el-date-picker>
  </div>
</template>
