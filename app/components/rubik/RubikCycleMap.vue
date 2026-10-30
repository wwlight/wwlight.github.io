<script setup lang="ts">
import type { Cube } from './rubik-engine'
import type { CubeTurn } from './rubik-scene'
import { RUBIK_FACE_HEX } from './rubik-colors'
import { RING_CIRCLES, RING_DOT_R, RING_REULEAUX, RING_VIEWBOX, ringDots } from './rubik-rings'

const props = defineProps<{
  cube: Cube
  turn?: CubeTurn | null
  label?: string
}>()

const host = ref<HTMLElement | null>(null)
const active = ref(false)
let io: IntersectionObserver | null = null

const dots = computed(() => active.value ? ringDots(props.cube, props.turn) : [])

onMounted(() => {
  io = new IntersectionObserver(
    (entries) => {
      const on = entries.some(e => e.isIntersecting)
      if (on !== active.value)
        active.value = on
    },
    { rootMargin: '80px 0px', threshold: 0.01 },
  )
  if (host.value)
    io.observe(host.value)
})

onBeforeUnmount(() => {
  io?.disconnect()
})
</script>

<template>
  <div ref="host" class="w-full">
    <svg
      v-if="active"
      class="mx-auto block aspect-square h-auto w-full"
      :viewBox="RING_VIEWBOX"
      role="img"
      :aria-label="label ?? '六面圆环图'"
    >
      <path
        :d="RING_REULEAUX"
        class="rubik-cycle-reuleaux"
      />
      <circle
        v-for="ring in RING_CIRCLES"
        :key="ring.id"
        :cx="ring.cx"
        :cy="ring.cy"
        :r="ring.r"
        :class="ring.mid ? 'rubik-cycle-ring rubik-cycle-ring-mid' : 'rubik-cycle-ring'"
      />
      <circle
        v-for="dot in dots"
        :key="dot.id"
        :cx="dot.x"
        :cy="dot.y"
        :r="RING_DOT_R"
        class="rubik-sticker"
        :style="{ fill: RUBIK_FACE_HEX[dot.color] }"
      />
    </svg>
    <div
      v-else
      class="aspect-square w-full"
      aria-hidden="true"
    />
  </div>
</template>
