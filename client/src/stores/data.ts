import { defineStore } from 'pinia'
import weibo from '../assets/weibo_data_label_index_new.json'

export interface Weibo {
  original_text: string
  loc: number[]
  evtlist: number[]
  uid: string
  name: string
  dep: number
  text: string
  pid: string
  mid: string
  tr: number
  childnum: number
  t: number
  totalChildren: number
  category: number
  dr: number
  times: number
  coarse_emotion: string
  fine_emotion: string
  strength: number
  point: string
  attitude: number
  children: Weibo[]
  id: number
  group: number
  importance: number
}

export interface Event {
  name: string
  mid: string
  text: string
  totalChildren: number
  t: number
}

export interface Emotion {
  index: number
  grade: number
  attitude: { [key: number]: number }
  hotness: number
}

function nearestHourTimestamp(date: number) { //秒级输入输出
  const nextHour = new Date(date * 1000)
  if (nextHour.getHours() === 23) {
    nextHour.setHours(0)
    nextHour.setDate(nextHour.getDate() + 1)
  } else {
    nextHour.setHours(nextHour.getHours() + 1)
  }
  nextHour.setMinutes(0)
  nextHour.setSeconds(0)
  nextHour.setMilliseconds(0)
  return nextHour.getTime() / 1000
}

function nearestDayTimestamp(date: number) { //秒级输入输出
  const nextDay = new Date(date * 1000)
  const currentDay = nextDay.getDate()
  const lastDayOfMonth = new Date(nextDay.getFullYear(), nextDay.getMonth() + 1, 0).getDate()
  if (currentDay === lastDayOfMonth) {
    nextDay.setDate(1)
    nextDay.setMonth(nextDay.getMonth() + 1)
  } else {
    nextDay.setDate(currentDay + 1)
  }
  nextDay.setHours(0)
  nextDay.setMinutes(0)
  nextDay.setSeconds(0)
  nextDay.setMilliseconds(0)
  return nextDay.getTime() / 1000
}

function timeDevide(start: number, end: number, interval = 1, unit = 'day') {  //秒级输入输出
  let cur = start
  const result = []
  result.push(start)

  cur = (unit === 'day') ? (nearestDayTimestamp(start) + (interval - 1) * 24 * 60 * 60): (nearestHourTimestamp(start) + (interval - 1) * 60 * 60)
  while (cur <= end) {
    result.push(cur)
    cur = (unit === 'day') ? (cur + interval * 24 * 60 * 60): (cur + interval * 60 * 60)
  }
  result.push(end)
  return result
}

export const useDataStore = defineStore({
  id: 'data',
  state: () => {
    return {
      isCreating: false,
      currentTime: new Date(meta.start_date) as Date,
      selectedTwitterID: -1,
      mouseOverTime: new Date(0) as Date,
      network: network as { nodes: { id: number; name: string }[];links: { source: number;target: number;aoe_time: number;aoe_curr_time: string }[] },
      weibos: weibo as Weibo[],
      dynamicTags: [] as string[],
      isSearchTags: false,
      newWeibos: weibo as Weibo[],
      weibo: weibo as Weibo[],
      flatten: [] as Weibo[],
      stemOnly: true, // 是否只查看主要帖子
      hotness: 0, // 查看所有帖子的情况下显示滑块对热度进行筛选
      sortByTotalChildren: false, // 按时间或热度排序bar
      barData: [] as Weibo[], // barplot数据
      byHour: false, // 默认按天检查
      interval: 1, // 默认1天
      pieData: [] as Emotion[], // piechart数据
      startTime: 1477911575, //秒级
      endTime: 1483263746, // 秒级
      group: null as number | null, // 分组查看数据
      timeList: [] as number[],
      checkedPerson: '' as string, // 当前查看的user
      showEvent: false,
      showEmotion: false
    }
  },
  getters: {
    
  },
  actions: {
    flattenWeiboData(data: Weibo[]): void {
      const flatList: Weibo[] = []
      function flatten(item: Weibo) {
        flatList.push(item)
        if (item.children && item.children.length > 0) {
          for (const child of item.children) flatten(child)
        }
      }
      for (const item of data) flatten(item)
      this.flatten = flatList
    },
    processBarData(): void {
      // console.log("processBarData, stemOnly:", this.stemOnly)
      if (this.stemOnly)
        this.barData = this.newWeibos.filter(d => d.t >= this.startTime && d.t <= this.endTime).map(item => ({
          name: item.name,
          mid: item.mid,
          text: item.text,
          totalChildren: item.totalChildren,
          t: item.t
        }))
      else {
        this.flattenWeiboData(this.newWeibos)
        this.barData = this.flatten.filter(d => d.t >= this.startTime && d.t <= this.endTime && d.totalChildren >= this.hotness).map(item => ({
          name: item.name,
          mid: item.mid,
          text: item.text,
          totalChildren: item.totalChildren,
          t: item.t
        }))
      }
    },
    processPieData(): void {
      // console.log("processPieData")
      this.flattenWeiboData(this.newWeibos)
      let filteredPieData
      if (this.group === 0 || this.group === 1 || this.group === 2) {
        filteredPieData = this.flatten.filter(d => d.t >= this.startTime && d.t <= this.endTime && d.group == this.group)
      }
      else {
        filteredPieData = this.flatten.filter(d => d.t >= this.startTime && d.t <= this.endTime)
      }
      filteredPieData.sort((a, b) => a.t - b.t)

      const emotionMap: { [key: string]: number } = {
        '负面': -1,
        '正面': 1,
        '中性': 0
      }
      
      this.timeList = timeDevide(this.startTime, this.endTime, this.interval, (this.byHour) ? 'hour' : 'day')
      const lineData = []
      for (let i = 0; i < this.timeList.length - 1; i++) {
        const subdata = filteredPieData.filter(d => d.t >= this.timeList[i] && (i === this.timeList.length - 2 ? d.t <= this.timeList[i + 1] : d.t < this.timeList[i + 1]))
        const attitudeCounts: { [key: number]: number } = {}
        let gradeSum = 0

        subdata.forEach(item => {
          const emotionValue = emotionMap[item.coarse_emotion] || 0
          const grade = (item.importance == 0 || item.importance == -1) ? (emotionValue * item.strength * 0.5) : (emotionValue * item.strength)
          gradeSum += grade

          const attitude = item.attitude
          if (attitude === null) {} 
          else {
            if (attitudeCounts.hasOwnProperty(attitude)) {
              attitudeCounts[attitude]++
            } else {
              attitudeCounts[attitude] = 1
            }
          }
        })
        lineData.push({index: i, grade: gradeSum, attitude: attitudeCounts, hotness: subdata.length})
      }
      lineData.forEach(d => {
        for (let i = 0; i < 4; i++) { 
          if (d.attitude.hasOwnProperty(i)) {}
          else {
            d.attitude[i] = 0
          }
        }
        if (d.attitude[0] == 0 && d.attitude[1] == 0 && d.attitude[2] == 0) {
          d.attitude[3] = 1
        } 
      })
      this.pieData = lineData
    },
    toggleStemOnly(): void {
      this.stemOnly = !this.stemOnly
    },
    sortDataByTotalChildren(): void {
      this.sortByTotalChildren = !this.sortByTotalChildren
    },
    countByHour(): void {
      this.byHour = !this.byHour
    },
    updateGroup(value: number): void {
      this.group = value
    },
    updateInterval(value: number): void {
      this.interval = value
    },
    updateHotness(value:number): void {
      this.hotness = value
    },
    updateStartTime(value: number) {
      this.startTime = value / 1000
    },
    updateEndTime(value: number) {
      this.endTime = value / 1000
    },
    isSearch(): void {
      this.isSearchTags = true
      const regtag = ref('')
      for (const tag of this.dynamicTags) {
        console.log(tag)
        regtag.value += tag + '|'
      }
      this.newWeibos = []
      for (const weibo of this.weibos) {
        const reg = new RegExp( regtag.value.slice(0 ,-1) )
        const matches = weibo.text.match(reg);
        if( matches !== null ){
          this.newWeibos.push(weibo)
          console.log(weibo.text)        
        }
      }
    },
    
    getTimeByRatio(ratio: number): string {
      const date = new Date(this.startTime.getTime() + (this.endTime.getTime() - this.startTime.getTime()) * ratio)
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    },
    selectTwitter(id: number): void {
      if (this.selectedTwitterID === id)
        this.selectedTwitterID = -1
      else this.selectedTwitterID = id
    },
    getSelectedTwitterID(): number {
      return this.selectedTwitterID
    },
    
    hideMouseOverTime(): void {
      this.mouseOverTime = new Date(0)
    },
    isHighLightTimeBlock(date: string, hour: number): boolean {
      const dateStr = `${this.mouseOverTime.getFullYear()}-${this.mouseOverTime.getMonth() + 1}-${this.mouseOverTime.getDate()}`
      const _hour = this.mouseOverTime.getHours()
      return dateStr === date && _hour === hour
    },
    isShowLink(): Date{
      return this.mouseOverTime
    },
    
  },
})

export default useDataStore
