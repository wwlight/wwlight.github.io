<script setup lang="ts">
import {
  DIRECTION_GRID,
  DIRECTION_LABEL,
  borderDeclaration,
  borderParts,
  triangleCss,
  triangleLayers,
  type TriangleDirection,
} from './triangle'

const themeColor = 'var(--ui-primary)'

const direction = ref<TriangleDirection>('bottom-right')
const width = ref(36)
const height = ref(36)
const showLayers = ref(true)
const drawnWidth = keepSize(width)
const drawnHeight = keepSize(height)

function keepSize(size: Ref<number>) {
  const last = ref(size.value)
  watch(size, (value) => {
    if (Number.isFinite(value) && value >= 1 && value <= 200) {
      last.value = value
      return
    }
    nextTick(() => {
      size.value = last.value
    })
  })
  return last
}

const parts = computed(() =>
  borderParts(direction.value, drawnWidth.value, drawnHeight.value, themeColor),
)
const layers = computed(() => triangleLayers(parts.value))
const elementCode = computed(() => triangleCss(parts.value, 'element'))
const pseudoCode = computed(() => triangleCss(parts.value, 'pseudo'))
const codeSample = refDebounced(
  computed(() =>
    [
      '::code-group',
      '',
      '```css [Element.css]',
      elementCode.value,
      '```',
      '',
      '```css [Pseudo-element.css]',
      pseudoCode.value,
      '```',
      '',
      '::',
    ].join('\n'),
  ),
  200,
)

const MINI_SIDE = 14
const MINI_TURN: Partial<Record<TriangleDirection, number>> = {
  top: 0,
  right: 90,
  bottom: 180,
  left: 270,
}

function miniStyle(item: TriangleDirection) {
  const color = direction.value === item ? themeColor : 'currentColor'
  const turn = MINI_TURN[item]
  const mini =
    turn === undefined
      ? borderParts(item, MINI_SIDE, MINI_SIDE, color)
      : borderParts('top', MINI_SIDE, (MINI_SIDE * Math.sqrt(3)) / 2, color)
  const border = borderDeclaration(mini)
  return {
    width: '0',
    height: '0',
    borderStyle: 'solid',
    borderWidth: border.width,
    borderColor: border.color,
    transform: turn === undefined ? undefined : `rotate(${turn}deg)`,
  }
}
</script>

<template>
  <div class="not-prose my-6 flex flex-col gap-4">
    <UCard variant="subtle">
      <div class="grid items-center gap-8 lg:grid-cols-2">
        <figure
          class="aspect-square w-full overflow-hidden rounded-lg bg-slate-50 text-slate-700 ring ring-default dark:bg-slate-950 dark:text-slate-100"
        >
          <svg viewBox="0 0 320 320" class="h-full w-full" aria-hidden="true">
            <defs>
              <pattern
                id="tools-triangle-placeholder"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"
                  fill="none"
                  class="stroke-inverted/10"
                />
              </pattern>
            </defs>
            <polygon
              v-for="part in layers.polygons"
              v-show="part.colored"
              :key="part.side"
              :points="part.points"
              :fill="part.color"
            />
            <polygon
              v-for="part in layers.polygons"
              v-show="!part.colored && showLayers"
              :key="`${part.side}-placeholder`"
              :points="part.points"
              fill="url(#tools-triangle-placeholder)"
              class="stroke-(--ui-border-accented)"
              stroke-dasharray="4 4"
            />
          </svg>
        </figure>

        <div class="flex min-w-0 flex-col gap-4">
          <USwitch v-model="showLayers" label="显示透明边" />

          <UFormField label="方向">
            <div class="grid w-fit grid-cols-3 gap-1.5" role="group" aria-label="方向">
              <template v-for="(item, index) in DIRECTION_GRID" :key="index">
                <div v-if="!item" class="size-10 rounded-md bg-muted" aria-hidden="true" />
                <UButton
                  v-else
                  color="neutral"
                  :variant="direction === item ? 'soft' : 'outline'"
                  class="size-10 items-center justify-center p-0"
                  :aria-label="DIRECTION_LABEL[item]"
                  :aria-pressed="direction === item"
                  @click="direction = item"
                >
                  <span class="inline-block" :style="miniStyle(item)" />
                </UButton>
              </template>
            </div>
          </UFormField>

          <UFormField label="宽">
            <div class="flex items-center gap-3">
              <USlider v-model="width" :min="1" :max="200" aria-label="宽" class="flex-1" />
              <UInputNumber v-model="width" :min="1" :max="200" size="sm" class="w-24" />
            </div>
          </UFormField>

          <UFormField label="高">
            <div class="flex items-center gap-3">
              <USlider v-model="height" :min="1" :max="200" aria-label="高" class="flex-1" />
              <UInputNumber v-model="height" :min="1" :max="200" size="sm" class="w-24" />
            </div>
          </UFormField>
        </div>
      </div>
    </UCard>

    <ClientOnly>
      <MDC class="my-0" :value="codeSample" />
    </ClientOnly>
  </div>
</template>
