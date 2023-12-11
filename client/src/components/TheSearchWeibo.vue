<template>
  <div class="w-full h-full">
    <div class="w-full h-55%">
      <div class="bg-slate-50 relative left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] mb-4 flex w-80% flex-wrap items-stretch justify-center items-center">
       <div class="relative m-0 -mr-0.5 block w-[1px] min-w-0 flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary">
      <el-tag
          v-for="tag in dynamicTags"
          :key="tag"
          class="mx-1"
          closable
          type='info'
          :disable-transitions="false"
          @close="handleClose(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-input
          v-if="inputVisible"
          ref="InputRef"
          v-model="inputValue"
          class="ml-1 w-20"
          size="small"
          type='success'
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput" >
          + New Tag
        </el-button>
    </div>
    
    <button
      class="relative z-[2] rounded-r border-2 border-primary px-6 py-2 text-xs font-medium uppercase text-primary transition duration-150 ease-in-out hover:bg-blue hover:bg-opacity-30 focus:outline-none focus:ring-0"
      type="button"
      id="button-addon3"
      data-te-ripple-init
      @click="isSearch">
      Search
    </button>
  </div>
    </div>
    <div class="w-full h-40%">
      <div class="w-full overflow-auto translate-y-4">
        <el-tag
          v-for="tag in simTags"
          :key="tag"
          class="mx-1"
          
          :disable-transitions="false"
          @close="handleClose(tag)"
          @click="addKeywords(tag)"
        >
          {{ tag }}
        </el-tag>
        
        
      </div>
    <div class="mb-3 w-80%">
  
</div>  
    </div> 
  </div>
</template>


<script lang="ts" setup>
import { nextTick, ref } from 'vue'
import { ElInput } from 'element-plus'
import useDataStore from '../stores/data'

const { isSearch, dynamicTags } = useDataStore()
const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref<InstanceType<typeof ElInput>>()
const simTags = ref(['Tag 1', 'Tag 2', 'Tag 3'])
const tick = ref(1)
const handleClose = (tag: string) => {
  dynamicTags.splice(dynamicTags.indexOf(tag), 1)
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}

const addKeywords = (tag: string) => {
  dynamicTags.push(tag)
  simTags.value.splice(simTags.value.indexOf(tag), 1)
}

const freshSimTags = () => {
  tick.value += 1
  simTags.value = [`Tag ${tick.value+3}`, `Tag ${tick.value+4}`, `Tag ${tick.value+5}`]
}

watch(() => dynamicTags.length, (newdynamicTags) => {
  console.log(newdynamicTags)
  freshSimTags()
})
</script>
