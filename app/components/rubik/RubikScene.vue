<script setup lang="ts">
import type { Cube } from './rubik-engine'
import { cubeKey } from './rubik-engine'
import { drawCubeScene, type CubeTurn } from './rubik-scene'

const props = defineProps<{
  cube: Cube
  turn?: CubeTurn | null
  label?: string
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
const host = ref<HTMLElement | null>(null)
const active = ref(false)

let ro: ResizeObserver | null = null
let io: IntersectionObserver | null = null
let ctx: CanvasRenderingContext2D | null = null
let dirty = true
let raf = 0

function paintNow() {
  raf = 0
  if (!active.value) {
    dirty = true
    return
  }
  const el = canvas.value
  const box = host.value
  if (!el || !box)
    return
  const w = box.clientWidth
  const h = box.clientHeight
  if (w < 2 || h < 2)
    return
  if (el.width !== w || el.height !== h) {
    el.width = w
    el.height = h
    ctx = null
  }
  if (!ctx) {
    ctx = el.getContext('2d', { alpha: true })
    if (!ctx)
      return
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  drawCubeScene(ctx, w, h, props.cube, props.turn ?? null)
  dirty = false
}

function requestPaint() {
  dirty = true
  if (props.turn) {
    if (raf)
      cancelAnimationFrame(raf)
    paintNow()
    return
  }
  if (raf)
    return
  raf = requestAnimationFrame(paintNow)
}

onMounted(() => {
  ro = new ResizeObserver(() => requestPaint())
  if (host.value)
    ro.observe(host.value)

  io = new IntersectionObserver(
    (entries) => {
      const on = entries.some(e => e.isIntersecting)
      if (on === active.value)
        return
      active.value = on
      if (on && dirty)
        requestPaint()
    },
    { rootMargin: '40px 0px', threshold: 0.01 },
  )
  if (host.value)
    io.observe(host.value)
})

watch(
  () => [cubeKey(props.cube), props.turn?.move ?? '', props.turn?.t ?? 0] as const,
  () => requestPaint(),
)

onBeforeUnmount(() => {
  if (raf)
    cancelAnimationFrame(raf)
  ro?.disconnect()
  io?.disconnect()
  ctx = null
})
</script>

<template>
  <div ref="host" class="relative aspect-square w-full overflow-visible">
    <canvas
      v-show="active"
      ref="canvas"
      class="block size-full"
      role="img"
      :aria-label="label ?? '魔方'"
    />
  </div>
</template>
