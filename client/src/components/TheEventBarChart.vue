<script setup lang="ts">
import * as d3 from 'd3'
import useDataStore from '../stores/data'

const svgWidth = ref(window.innerWidth * 0.7 * 0.4)
const svgHeight = ref(window.innerHeight * 0.6)

// watch(() => this.$refs.barPlot.parentElement.clientWidth, (newWidth) => {
//   console.log(newWidth)
// })
// watch(() => this.$refs.barPlot.parentElement.clientHeight, (newHeight) => {
//   svgHeight.value = newHeight * 0.6
// })

const store = useDataStore()
const barData = computed(() => store.barData)
const sortByTotalChildren = computed(() => store.sortByTotalChildren)
const hotness = ref(0)

function timestampToDateTime(timestamp: number) {
  const date = new Date(timestamp * 1000)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`
  const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`

  return { date: formattedDate, time: formattedTime }
}
function drawBarChart() {
  const data1 = JSON.parse(JSON.stringify(barData.value))
  // console.log(data1)
  data1.sort((a, b) => a.t - b.t)

  const xScale = d3.scaleBand()
      .domain(data1.map(d => d.t))
      .range([svgWidth.value * 0.04, svgWidth.value * 0.96])
      .padding(0.1)
  
  if (sortByTotalChildren.value) {
    data1.sort((a, b) => b.totalChildren - a.totalChildren)
    xScale.domain(data1.map(d => d.totalChildren))
  }

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data1, d => d.totalChildren + 1)])
    .range([0, svgHeight.value])

  const svg = d3.select(".chart-container")
  svg.selectAll("*").remove()
  svg.selectAll("rect")
    .data(data1)
    .enter()
    .append("rect")
    .attr("x", d => xScale(sortByTotalChildren.value ? d.totalChildren : d.t))
    .attr("y", d => svgHeight.value - yScale(d.totalChildren + 1))
    .attr("width", xScale.bandwidth())
    .attr("height", d => yScale(d.totalChildren + 1))
    .attr("fill", "steelblue")
    .on("mouseover", (event, d) => {
      const tooltip = d3.select("#tooltip")
      tooltip.transition().duration(200)
        .style("opacity", 0.9)
      tooltip.html(`<strong>@${d.name}:</strong> ${d.text}<br><strong>热度:</strong> ${d.totalChildren}<br><strong>日期:</strong> ${timestampToDateTime(d.t).date}<br><strong>时间:</strong> ${timestampToDateTime(d.t).time}`)
        .style("left", (event.pageX + 5) + "px")
        .style("top", (event.pageY - 28) + "px")
    })
    .on("mouseout", () => {
      const tooltip = d3.select("#tooltip")
      tooltip.transition().duration(500).style("opacity", 0)
    })

  const yAxis = d3.select(".y-axis")
  const yAxisScale = d3.scaleLinear()
    .domain([0, d3.max(data1, d => d.totalChildren + 1)])
    .range([svgHeight.value, 0])
  const yAxisAxis = d3.axisLeft(yAxisScale)
  yAxis.call(yAxisAxis)
    .selectAll("text")
    .style("text-anchor", "start")
    .attr("transform", "translate(10,-4)")
  yAxis.attr("transform", `translate(${svgWidth.value * 0.04},0)`)

  const yAxisLabel = svg.append("text")
    .attr("class", "y-axis-label")
    .attr("y", svgHeight.value / 2)
    .style("text-anchor", "middle")
  yAxisLabel.append("tspan")
    .text("热")
    .attr("x", svgWidth.value * 0.02)
  yAxisLabel.append("tspan")
    .text("度")
    .attr("x", svgWidth.value * 0.02)
    .attr("dy", "1.2em")

  svg.append("text")
    .attr("class", "x-axis-label")
    .attr("x", svgWidth.value * 0.95)
    .attr("y", svgHeight.value * 0.95)
    .style("text-anchor", "middle")
    .text((sortByTotalChildren.value) ? "热度" : "时间")
}

const handleButtonClickStem = () => {
  console.log('ggg')
  store.toggleStemOnly()
  store.processBarData()
  drawBarChart()
}

const handleButtonClickSort = () => {
  store.sortDataByTotalChildren()
  store.processBarData()
  drawBarChart()
}

const slideUpdateHotness = () => {
  store.updateHotness(hotness)
  store.processBarData()
  drawBarChart()
}

onMounted(() => {
  store.processBarData()
  drawBarChart()
})

watch(() => useDataStore().newWeibos, () => {
  store.processBarData()
  drawBarChart()
})
watch(() => store.startTime, (newValue) => {
  // console.log("bar start time change:", newValue)
  store.processBarData()
  drawBarChart()
})

watch(() => store.endTime, (newValue) => {
  // console.log("bar end time change:", newValue)
  store.processBarData()
  drawBarChart()
})
</script>

<template>
  <div class="p-4 flex items-center">
    <el-button @click="handleButtonClickStem" class="ml-4">Stem Only</el-button>
    <el-slider v-if="!store.stemOnly" v-model="hotness" :min="0" :max="150" :step="1" @change="slideUpdateHotness" class="ml-4 w-30%"/>
    <el-button @click="handleButtonClickSort" class="ml-4">Sort</el-button>
  </div>
  <svg ref="barPlot" class="mt-4"  :width="svgWidth" :height="svgHeight">
    <g class="chart-container"></g>
    <g ref="yAxis" class="y-axis"></g>
  </svg>
  <div id="tooltip" class="absolute bg-white p-1 border border-gray-300 opacity-0"></div>
</template>
