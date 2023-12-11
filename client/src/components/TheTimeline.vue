<script setup lang="ts">
import useDataStore from '../stores/data'


const { weibos } = useDataStore()
const sortWeibos = weibos.sort((a, b) => a.t - b.t)
const minTime = sortWeibos[0].t
const maxTime = sortWeibos[sortWeibos.length - 1].t
const svgWidth = ref(window.innerWidth * 0.8)
const svgHeigt = ref(window.innerHeight * 0.15)
const timeLineLength = ref(svgWidth.value * 0.85)
const x = ref(70)
const y = ref(svgHeigt.value * 0.3)
const left = ref(window.innerWidth * 0.2)
const rectHeight = ref(2)
const rectWidth = ref(20)
const isSearchTags = ref(useDataStore().isSearchTags)
watch(() => useDataStore().isSearchTags, (newisSearchTags) => {
  isSearchTags.value = newisSearchTags
})
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
const showTooltip = ref(false)
const tooltipText = ref('')
const tooltipLocation = ref(0)
function mouseout() {
  showTooltip.value = false
}

function mousemove(event, text) {
  showTooltip.value = true
  tooltipText.value = text
  tooltipLocation.value = event.clientX
  
}
function formatDate(inputDate: number) {
  // 将输入的日期字符串转换为 JavaScript Date 对象
  const date = new Date(inputDate * 1000)

  // 获取日期和时间的各个部分
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]
  const year = date.getFullYear()
  const month = monthNames[date.getMonth()]
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()

  // 格式化时间部分（小时和分钟）
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const formattedHours = hours % 12 || 12
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes

  // 构建最终的日期字符串
  const formattedDate = `${formattedHours}:${formattedMinutes} ${ampm} · ${month} ${day}, ${year}`

  return formattedDate
}
function getXposition(inputDate: number) {
  return (inputDate - minTime) / (maxTime - minTime) * timeLineLength.value + x.value
}

</script>

<template>
  <div class="h-full w-full p-2">
    <div class="mb-1 border-b" />
    <div class="w-full pl-1">
      <div class="w-40%">
        时间轴
      </div>
      <div class="w-full pl-2" id="timeline">
        <svg :width="svgWidth" :height="svgHeigt" class="absolute">
          <rect
            :x="x" :y="y" :width="timeLineLength" :height="rectHeight"
            class="fill-gray-100"
          />
          <rect      
            v-for="newweibo in newWeibos.filter(d => d.t >= startTime && d.t <= endTime)"
            :id="`twitter-box-${newweibo.mid}`"
            :key="newweibo.mid"
            :width="5"
            :height="newweibo.childnum * 0.35"
            :x="getXposition(newweibo.t)"
            :y="y - newweibo.childnum * 0.35"
            class="fill-gray-400"
            @mouseout="mouseout()"
            @mousemove="mousemove($event, newweibo.text)"
          />
        </svg>
        <div
          v-if="showTooltip"
          class="absolute top-15% overflow-auto rounded-md bg-orange-100 p-2"
          :style="{ left: `${tooltipLocation}px` }"
        >
          {{ tooltipText }}
        </div>
      </div>
    </div>
  </div>
</template>
