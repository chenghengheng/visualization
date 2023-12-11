<script setup lang="ts">
import useDataStore from '../stores/data'
import TheTwitterBox from './TheTwitterBox.vue'

const { twitters, getSelectedTwitterID } = useDataStore()
const currentTime = ref(useDataStore().currentTime)
watch(() => useDataStore().currentTime, (newTime) => {
  currentTime.value = newTime
})

function timeControl(date: string, currentTime: Date) {
  const time = new Date(date)
  return time <= currentTime || time > currentTime 
}
</script>

<template>
  <div class="h-full w-full overflow-auto">
    <TheTwitterBox
      v-for="twitter in twitters.filter(twitter => (getSelectedTwitterID() === -1 || twitter.id === getSelectedTwitterID()) && timeControl(twitter.aoe_curr_time, currentTime))"
      :id="`twitter-box-${twitter.id}`"
      :key="twitter.id"
      :twitter="twitter"
    />
  </div>
</template>
