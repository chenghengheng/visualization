<script setup lang="ts">
import * as d3 from 'd3'
import useDataStore from '../stores/data'

const {
  width,
  height,
  linkSource,
  linkTarget,
  nodeStrength,
  linkStrength,
} = defineProps({
  width: { default: 640 },
  height: { default: 640 },
  linkSource: { default: (d: { source: number;target: number;aoe_time: number;aoe_curr_time: string }) => d.source },
  linkTarget: { default: (d: { source: number;target: number;aoe_time: number;aoe_curr_time: string }) => d.target },
  nodeStrength: { default: -1000 },
  linkStrength: { default: undefined },
})

const {isShowLink} = useDataStore()
function timeControl(date: string, currentTime: Date) {
  const time = new Date(date)
  if (isShowLink() <= new Date(0))
     return time <= currentTime
  else
     return time <= isShowLink()
}

const nodes = ref(useDataStore().network.nodes)
const links = ref(useDataStore().network.links)
watch(() => useDataStore().network, (newValue) => {
  nodes.value = newValue.nodes
  links.value = newValue.links
})

const currentTime = ref(useDataStore().currentTime)
watch(() => useDataStore().currentTime, (newTime) => {
  currentTime.value = newTime
})

const N = computed(() => d3.map(nodes.value, (d: { id: number;name: string }) => d.id).map(intern))
const LS = computed(() => d3.map(links.value, (d: { source: number;target: number;aoe_time: number;aoe_curr_time: string }) => d.source).map(intern))
const LT = computed(() => d3.map(links.value, (d: { source: number;target: number;aoe_time: number;aoe_curr_time: string }) => d.target).map(intern))

const nodes1 = computed(() => d3.map(nodes.value, (_: any, i: any) => ({ id: N.value[i] })))
const links1 = computed(() => d3.map(links.value, (_: any, i: any) => ({ source: LS.value[i], target: LT.value[i], aoe_curr_time: links.value[i].aoe_curr_time })))

const forceNode = computed(() => d3.forceManyBody())
const forceLink = computed(() => d3.forceLink(links1.value).id(({ index: i }) => N.value[i]))
if (nodeStrength !== undefined)
  forceNode.value.strength(nodeStrength)

if (linkStrength !== undefined)
  forceLink.value.strength(linkStrength)

const forceX = d3.forceX().strength(-0.25).x(width / 2)
const forceY = d3.forceY().strength(-0.13).y(height / 2)

const simulation = computed(() => d3.forceSimulation(nodes1.value)
  .force('link', forceLink.value)
  .force('charge', forceNode.value)
  .force('center', d3.forceCenter(width / 2, height / 2 + 10))
  .force('x', forceX)
  .force('y', forceY)
  .on('tick', ticked))

const link = ref<SVGElement>()

onMounted(() => {
  d3.selectAll(Array.from(link.value))
    .data(links1.value)
})
const node = ref<SVGElement>()

watchEffect(() => {
  if (node.value === null)
    return
  d3.selectAll(node.value)
    .call(drag(simulation.value))
})

onMounted(() => {
  d3.selectAll(Array.from(node.value))
    .data(nodes1.value)
})

function intern(value: any) {
  return value !== null && typeof value === 'object' ? value.valueOf() : value
}
function ticked() {
  const svg = d3.select('svg') // 假设你的 SVG 元素已经存在

  // 在 <defs> 内创建箭头定义
  const arrowMarker = svg.append('defs')
    .append('marker')
    .attr('id', 'arrow')
    .attr('markerUnits', 'userSpaceOnUse')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 15)// 箭头坐标
    .attr('refY', -1)
    .attr('markerWidth', 12)// 标识的大小
    .attr('markerHeight', 12)
    .attr('orient', 'auto')// 绘制方向，可设定为：auto（自动确认方向）和 角度值
    .attr('stroke-width', 2)// 箭头宽度
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')// 箭头的路径
    .attr('fill', 'gray')// 箭头颜色

  // 在箭头定义内添加箭头路径
  arrowMarker.append('path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('class', 'arrowhead')
  d3.selectAll(Array.from(link.value))
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y)
    .attr('marker-end', 'url(#arrow)')

  d3.selectAll(Array.from(node.value))
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('fill', (d, i) => {
      const img_w = 20
      const img_h = 20
      const radius = 10
      const defs = d3.select('svg').append('defs').attr('id', 'imgdefs')

      const catpattern = defs.append('pattern')
        .attr('id', `catpattern${i}`)
        .attr('height', 1)
        .attr('width', 1)

      catpattern.append('image')
        .attr('x', -(img_w / 2 - radius))
        .attr('y', -(img_h / 2 - radius))
        .attr('width', img_w)
        .attr('height', img_h)
        .attr('xlink:href', `/src/assets/avatar/${d.id + 1}.png`)

      return `url(#catpattern${i})`
    })
}
function drag(simulation: any) {
  function dragstarted(event: any) {
    if (!event.active)
      simulation.alphaTarget(0.3).restart()
    event.subject.fx = event.subject.x
    event.subject.fy = event.subject.y
  }

  function dragged(event: any) {
    event.subject.fx = event.x
    event.subject.fy = event.y
  }

  function dragended(event: any) {
    if (!event.active)
      simulation.alphaTarget(0)
    event.subject.fx = null
    event.subject.fy = null
  }

  return d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended)
}
</script>

<template>
  <div class="full m-1">
    <svg
      :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`"
    >
      <g>
        <line
          v-for="(_, index0) in links1"
          :key="index0"
          ref="link"
          stroke="orange"
          stroke-width="2"
        />
      </g>
      <g>
        <circle
          v-for="(_, index1) in nodes1"
          :key="index1"
          ref="node"
          r="5"
          fill="grey"
        />
      </g>
    </svg>
  </div>
</template>
