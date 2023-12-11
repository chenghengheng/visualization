<script setup lang="ts">
import * as d3 from 'd3'
import useDataStore from '../stores/data'

const svgWidth = ref(window.innerWidth * 0.7 * 0.6)
const svgHeight = ref(window.innerHeight * 0.6)

const store = useDataStore()
const pieData = computed(() => store.pieData)
const timeList = computed(() => store.timeList)
const group = ref(3)
const interval = ref(1)
const options = [{value:0, label: 'Group 0'}, {value:1, label: 'Group 1'}, {value:2, label: 'Group 2'}, {value:3, label: 'All'}]
const buttonText = store.byHour ? 'count by day' : 'count by hour'
const attitudeMap: { [key: number]: string } = {
    0: '患者',
    1: '中立',
    2: '医院',
    3: '未知'
  }

function timestampToDateTime(timestamp) {
  const date = new Date(timestamp * 1000)

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`
  const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`

  return `${formattedDate} ${formattedTime}`
}

function drawPieChart() {
  const data = JSON.parse(JSON.stringify(pieData.value))
  const time = JSON.parse(JSON.stringify(timeList.value))

  const xScale = d3.scaleLinear()
    .domain([0, data.length + 1])
    .range([svgWidth.value * 0.04, svgWidth.value * 0.96])
  const yScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.grade), d3.max(data, d => d.grade)])
    .range([svgHeight.value * 0.9, svgHeight.value * 0.1])

  const svg = d3.select(".piechart-container")
  svg.selectAll("*").remove()
  const yAxis = d3.axisLeft(yScale)
    .tickSizeInner(-svgWidth.value * 0.9)
  const xAxis = d3.axisBottom(xScale).ticks(data.length)
  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${yScale(0)})`)
    .call(xAxis)
  svg.append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${svgWidth.value * 0.04},0)`)
    .call(yAxis)

  const yAxisLabel = svg.append("text")
    .attr("class", "y-axis-label")
    .attr("x", svgWidth.value * 0.02)
    .attr("y", yScale((d3.min(data, d => d.grade) + d3.max(data, d => d.grade)) / 2))
    .style("text-anchor", "middle")
  yAxisLabel.append("tspan")
    .text("情")
  yAxisLabel.append("tspan")
    .text("绪")
    .attr("x", svgWidth.value * 0.02)
    .attr("dy", "1.2em")
  svg.append("text")
    .attr("class", "x-axis-label")
    .attr("x", svgWidth.value / 2)
    .attr("y", yScale(0) - 10)
    .style("text-anchor", "middle")
    .text("时间区间")

  const colorScale = d3.scaleOrdinal()
    .domain(Object.keys(data[0].attitude)) 
    .range(["yellowgreen", "#8DB1AB", "#587792", "black"])

  data.forEach((d, i) => {
    const pieData = d3.pie().sort(null)(Object.values(d.attitude))
    const radiusScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.hotness)])
      .range([5, 30])

    const arcGenerator = d3.arc()
      .innerRadius(0)
      .outerRadius(radiusScale(d.hotness))

    const pieGroup = svg.append("g")
      .attr("transform", `translate(${xScale(d.index)},${yScale(d.grade)})`)

    pieGroup.selectAll("path")
      .data(pieData)
      .enter()
      .append("path")
      .attr("d", arcGenerator)
      .attr("fill", (d) => colorScale(d.index))
      .on("mouseover", (event, d) => {
        const tooltip = d3.select("#tooltip")
        tooltip.transition().duration(200)
          .style("opacity", 0.9)
        tooltip.html(`<strong>立场：</strong> ${attitudeMap[d.index]} \
        <br><strong>占比：</strong> ${Math.round((d.endAngle-d.startAngle)/(2 * Math.PI)*100)}% \
        <br><strong>时间：</strong> ${timestampToDateTime(time[i])}~${timestampToDateTime(time[i+1])}`)
          .style("left", (event.pageX + 5) + "px")
          .style("top", (event.pageY - 28) + "px")
      })
      .on("mouseout", () => {
        const tooltip = d3.select("#tooltip")
        tooltip.transition().duration(500).style("opacity", 0)
      })

      if (i > 0) {
        const prevX = xScale(data[i - 1].index)
        const prevY = yScale(data[i - 1].grade)
        const currentX = xScale(d.index)
        const currentY = yScale(d.grade)

        svg.insert("line", ":first-child")
          .attr("x1", prevX)
          .attr("y1", prevY)
          .attr("x2", currentX)
          .attr("y2", currentY)
          .attr("stroke", "gray")
          .attr("stroke-width", 1)
      }
  })

  const legend = d3.select(".legend-container")
  const legendType = ["患者", "中立", "医院", "未知"]
  const legendColor = ["yellowgreen", "#8DB1AB", "#587792", "black"]
  legend.selectAll(".circles")
    .data(legendType)
    .enter()
    .append("circle")
    .attr("fill", (d, i) => legendColor[i])
    .attr('cx', (d, i) => i * 50 + 20)
    .attr('cy', 8)
    .attr('r', 8)

  legend.selectAll(".texts")
    .data(legendType)
    .enter()
    .append("text")
    .attr('x', (d, i) => i * 50 + 30)
    .attr('y', 14)
    .text(d => d)
}

onMounted(() => {
  store.processPieData()
  drawPieChart()
})

const handleButtonClickDay = () => {
  store.countByHour()
  store.processPieData()
  drawPieChart()
}

const slideUpdateInterval = () => {
  store.updateInterval(interval)
  store.processPieData()
  drawPieChart()
}

watch(() => group.value, (newValue) => {
  store.updateGroup(newValue)
  store.processPieData()
  drawPieChart()
})

watch(() => useDataStore().newWeibos, () => {
  store.processPieData()
  drawPieChart()
})

watch(() => store.startTime, (newValue) => {
  // console.log("pie start time change:", newValue)
  store.processPieData()
  drawPieChart()
})

watch(() => store.endTime, (newValue) => {
  // console.log("pie end time change:", newValue)
  store.processPieData()
  drawPieChart()
})
</script>

<template>
  <div class="p-4">
    <div class="flex items-center mt-4">
      <el-select v-model="group" placeholder="All" class="ml-4" size="small">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button @click="handleButtonClickDay" class="ml-4" size="small" text bg>{{ buttonText }}</el-button>
      <el-slider v-model="interval" :min="1" :max="12" :step="1" @change="slideUpdateInterval" class="ml-4 w-25%" />
      <svg class="ml-4 h-20px">
        <g class="legend-container"></g>
      </svg>
    </div>

    <svg ref="linePlot" :width="svgWidth" :height="svgHeight">
      <g class="piechart-container"></g>
    </svg>
    <div id="tooltip" class="absolute bg-white p-1 border border-gray-300 opacity-0"></div>
  </div>
</template>
