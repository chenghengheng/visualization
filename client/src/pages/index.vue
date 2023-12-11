<script setup lang="ts" generic="T extends any, O extends any">
import TheSearchWeibo from '~/components/TheSearchWeibo.vue';
import TheTimeline from '~/components/TheTimeline.vue';
import useDataStore from '../stores/data'

defineOptions({
  name: 'IndexPage',
})

const event = ref(useDataStore().showEvent)
watch(() => useDataStore().showEvent, (newValue) => {
  event.value = newValue
})
const emotion = ref(useDataStore().showEmotion)
watch(() => useDataStore().showEmotion, (newValue) => {
  emotion.value = newValue
})
</script>

<template>
  <div class="m-1 h-[calc(100%-0.5rem)] w-[calc(100%-0.5rem)] flex border-2 border-slate-50 bg-white p-1">
        <div class="h-full w-75% flex-shrink-0 bg-slate-50 p-1">
          <div class="h-80% w-full bg-white border-2">
            <div class="h-50% w-full bg-white flex">
              <div class="h-full w-40%">
                <TheEventBarChart />
              </div>
              <div class="h-full w-60%">
                <TheEmotionPieChart />
              </div>
              <!--新的视图可以放在这里和上面保持一致-->
            </div>
          </div>
        </div> 
  </div>
</template>
