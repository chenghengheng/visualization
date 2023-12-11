<script setup lang="ts">
import useDataStore from '../stores/data'
import TheWeiboBox from './TheWeiboBox.vue'

const isSearchTags = ref(useDataStore().isSearchTags)
watch(() => useDataStore().isSearchTags, (newisSearchTags) => {
  isSearchTags.value = newisSearchTags
})
// function timeControl(date: string, currentTime: Date) {
//   const time = new Date(date)
//   return time <= currentTime || time > currentTime 
// }
const newWeibos = ref(useDataStore().newWeibos)
watch(() => useDataStore().newWeibos, (newisSearchTags) => {
  newWeibos.value = newisSearchTags
})
const startTime= ref(useDataStore().startTime)
watch(() => useDataStore().startTime, (newstartTime) => {
  startTime.value = newstartTime
})
const endTime= ref(useDataStore().endTime)
watch(() => useDataStore().endTime, (newendTime) => {
  endTime.value = newendTime
})

// 筛选显示的微博
watch(() => useDataStore().checkedPerson, (newValue) => {
  if (newValue != '') newWeibos.value = useDataStore().newWeibos.filter(d => d.name ==  newValue)
  else newWeibos.value = useDataStore().newWeibos
})
</script>

<template>
  <div class="h-full w-full">
    <ThePanelHeader
    title="主题内容"
    background-color="bg-[#cee4c9]"
    />
    <div class="h-5% w-full pb-2 text-xl">
         山东产妇子宫内留纱布事件
    </div>
    <ThePanelHeader
    title="贴文内容"
    background-color="bg-[#c8c2a5]"
    />
    <div class="h-85% w-full overflow-auto">
      
      <TheWeiboBox
        v-for="newweibo in newWeibos.filter(d => d.t >= startTime && d.t <= endTime)"
        :id="`twitter-box-${newweibo.mid}`"
        :key="newweibo.mid"
        :weibo="newweibo"
      />
    </div>
  </div>
</template>
