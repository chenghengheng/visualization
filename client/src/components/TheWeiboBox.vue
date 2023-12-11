<script setup lang="ts">
import { Icon } from '@iconify/vue'
import useDataStore from '../stores/data'
import type { Weibo } from '../stores/data'

const ifShowComments = ref(false)

function controlComments() {
  ifShowComments.value = !ifShowComments.value
}
const { weibo } = defineProps({
  weibo: {
    type: Object as PropType<Weibo>,
    default: {} as Weibo,
  },
})


function formatDate(inputDate: number) {
  // 将输入的日期字符串转换为 JavaScript Date 对象
  const date = new Date(inputDate*1000)

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
// 筛选user对应微博
function handleNameClick() {
  if (useDataStore().checkedPerson === weibo.name) {
    useDataStore().checkedPerson = ''
  }
  else {
    useDataStore().checkedPerson = weibo.name
  }
  console.log(useDataStore().checkedPerson)
}
</script>

<template>
  <div class="w-full overflow-auto border-1 border-slate-200 bg-white pl-4 pr-4">
    <div class="h-20 w-full flex" @click="handleNameClick">
      <img src="/src/assets/avatar/npc.jpeg" class="h-18 w-16 object-cover pb-2 pr-2 pt-2">
      <div>
        <p class="whitespace-nowrap pt-2 text-lg font-bold">
          {{ weibo.name }}
        </p>
        <p class="whitespace-nowrap text-lg text-slate-500 font-chi">
          {{ weibo.name }}
        </p>
      </div>

    </div>
    <div class="w-full">
      <p class="pb-2 text-lg font-chi">
        {{ weibo.text }}
      </p>
      
    </div>
    <div class="h-10 w-full flex">
      <p class="text-slate-500">
        {{ formatDate(weibo.t) }}
        <!-- <span class="pl-1 pr-1">
          ·
        </span>
        <span class="pr-1 font-black text-black">
          11.3K
        </span>
        Views -->
      </p>
    </div>
    <div class="border-b" />
    <div class="flex pb-4 pt-4">
      <p class="pr-3 text-slate-500">
        <span class="font-black text-black">
          {{ weibo.childnum }}
        </span>
        Replys
      </p>
      <!-- <p class="pr-3 text-slate-500">
        <span class="font-black text-black">
          0
        </span>
        Quotes
      </p> -->
      
      <!-- <p class="text-slate-500">
        <span class="font-black text-black">
          0
        </span>
        Bookmarks
      </p> -->
    </div>
    <div class="border-b" />
    <div class="flex pb-2 pt-2">
      <Icon
        icon="fluent:comment-12-regular" width="30" height="30" class="ml-6 mr-6"
        @click="controlComments()"
      />
      <Icon icon="zondicons:repost" color="#120" width="30" height="30" :vertical-flip="true" class="ml-6 mr-6" />
      <Icon icon="icon-park-outline:like" width="28" height="28" class="ml-6 mr-6" />
      <Icon icon="mingcute:bookmark-line" width="27" height="27" class="ml-6 mr-6" />
    </div>
    <div v-if="ifShowComments" class="pt-2">
      <div
        v-for="comment in weibo.children"
        :key="comment.text"
      >
        <div class="flex">
          <div class="w-16">
            <img src="/src/assets/avatar/npc.jpeg" alt="Avatar" class="h-18 w-16 object-cover pb-2 pr-2 pt-2">
          </div>
          <div class="w-[calc(100%-4rem)]">
            <div class="flex pt-2">
              <p class="whitespace-nowrap pr-2 text-lg font-bold">
                {{ comment.name }}
              </p>
              <p class="whitespace-nowrap text-lg text-slate-500">
                {{ comment.name }}
              </p>
            </div>
            <p class="text-lg">
              {{ comment.text }}
            </p>

            <div class="flex pb-2 pt-2">
              <div class="ml-6 mr-6 flex">
                <Icon icon="fluent:comment-12-regular" width="30" height="30" />
                <!-- <span class="pl-2 pt-1 text-slate-500">4</span> -->
              </div>
              <div class="ml-6 mr-6 flex">
                <Icon icon="zondicons:repost" color="#120" width="30" height="30" :vertical-flip="true" />
                <!-- <span class="pl-2 pt-1 text-slate-500">4</span> -->
              </div>
              <div class="ml-6 mr-6 flex">
                <Icon icon="icon-park-outline:like" width="28" height="28" />
                <!-- <span class="pl-2 pt-1 text-slate-500">4</span> -->
              </div>
              <div class="ml-6 mr-6 flex">
                <Icon icon="mingcute:bookmark-line" width="27" height="27" />
                <!-- <span class="pl-2 pt-1 text-slate-500">4</span> -->
              </div>
            </div>
          </div>
        </div>
        <div class="border-b" />
      </div>
    </div>
    
  </div>
</template>
