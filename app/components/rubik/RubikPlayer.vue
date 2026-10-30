<script setup lang="ts">
import { cubeAfter, invertMove, moveZh, parseAlg } from './rubik-engine'
import { getRubikStage } from './rubik-stages'
import type { CubeTurn } from './rubik-scene'
import './rubik.css'

const props = defineProps<{
  stage?: string
  title?: string
  mnemonic?: string
  alg?: string
  setup?: string
  view?: 'iso' | 'both'
  note?: string
}>()

const stage = computed(() => getRubikStage(props.stage))
const title = computed(() => props.title ?? stage.value?.title ?? '公式复盘')
const mnemonic = computed(() => props.mnemonic ?? stage.value?.mnemonic ?? '')
const alg = computed(() => props.alg ?? stage.value?.alg ?? "R U R' U'")
const setup = computed(() => props.setup ?? stage.value?.setup ?? '')
const view = computed(() => props.view ?? stage.value?.view ?? 'iso')
const note = computed(() => props.note ?? stage.value?.note ?? '')
const moves = computed(() => parseAlg(alg.value))

const index = ref(0)
const playing = ref(false)
const busy = ref(false)
const fast = ref(false)
const turn = ref<CubeTurn | null>(null)
/** True while animating an undo (stepBack). */
const rewinding = ref(false)
let playGen = 0
let raf = 0

const cube = computed(() => cubeAfter(setup.value, alg.value, index.value))
const moving = computed(() => !!turn.value)
/** Before any turn: soft preview on first chip only. */
const pristine = computed(() => index.value === 0 && !moving.value)
/**
 * Selection = move being turned, or last committed move.
 * Never pre-selects the next idle move (except pristine preview of step 0).
 */
const focusMoveIndex = computed(() => {
  const n = moves.value.length
  if (n === 0)
    return -1
  if (moving.value)
    return rewinding.value ? index.value - 1 : index.value
  if (index.value === 0)
    return 0
  return Math.min(index.value, n) - 1
})
const doneMoveCount = computed(() => Math.min(index.value, moves.value.length))
const focusMove = computed(() => {
  const i = focusMoveIndex.value
  if (i < 0)
    return ''
  return moves.value[i] ?? ''
})
const focusMoveZh = computed(() => focusMove.value ? moveZh(focusMove.value) : '')
/** Matches selection: preview 1/n; after/during step k → k/n. */
const stepNo = computed(() => {
  const n = moves.value.length
  if (n === 0)
    return 0
  if (moving.value)
    return rewinding.value ? index.value : index.value + 1
  if (index.value === 0)
    return 1
  return Math.min(index.value, n)
})
const atEnd = computed(() => index.value >= moves.value.length && moves.value.length > 0)

function cancelRaf() {
  if (raf) {
    cancelAnimationFrame(raf)
    raf = 0
  }
}

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function duration(move: string) {
  const base = fast.value ? 220 : 520
  return move.includes('2') ? base * 1.28 : base
}

function ease(t: number) {
  return 1 - (1 - t) ** 3
}

function animate(move: string, gen: number) {
  if (reducedMotion()) {
    turn.value = null
    return Promise.resolve(gen === playGen)
  }
  const dur = duration(move)
  const t0 = performance.now()
  return new Promise<boolean>((resolve) => {
    const tick = (now: number) => {
      if (gen !== playGen) {
        resolve(false)
        return
      }
      const t = Math.min(1, (now - t0) / dur)
      turn.value = { move, t: ease(t) }
      if (t < 1) {
        raf = requestAnimationFrame(tick)
        return
      }
      raf = 0
      resolve(true)
    }
    raf = requestAnimationFrame(tick)
  })
}

function stop() {
  playing.value = false
}

function reset() {
  playGen += 1
  cancelRaf()
  playing.value = false
  busy.value = false
  turn.value = null
  rewinding.value = false
  index.value = 0
}

async function play() {
  if (index.value >= moves.value.length)
    index.value = 0
  playing.value = true
  const gen = ++playGen
  busy.value = true
  rewinding.value = false
  while (playing.value && gen === playGen && index.value < moves.value.length) {
    const move = moves.value[index.value]
    if (!move)
      break
    const ok = await animate(move, gen)
    if (!ok || gen !== playGen)
      return
    index.value += 1
    turn.value = null
  }
  if (gen === playGen) {
    playing.value = false
    busy.value = false
  }
}

function togglePlay() {
  if (playing.value)
    stop()
  else if (!busy.value)
    play()
}

async function stepBack() {
  if (busy.value || index.value === 0)
    return
  const gen = ++playGen
  playing.value = false
  busy.value = true
  rewinding.value = true
  const prev = moves.value[index.value - 1]
  if (!prev) {
    rewinding.value = false
    busy.value = false
    return
  }
  const ok = await animate(invertMove(prev), gen)
  if (ok && gen === playGen)
    index.value -= 1
  if (gen === playGen) {
    turn.value = null
    rewinding.value = false
    busy.value = false
  }
}

async function stepForward() {
  if (busy.value || index.value >= moves.value.length)
    return
  const gen = ++playGen
  playing.value = false
  busy.value = true
  rewinding.value = false
  const move = moves.value[index.value]
  if (!move) {
    busy.value = false
    return
  }
  const ok = await animate(move, gen)
  if (ok && gen === playGen)
    index.value += 1
  if (gen === playGen) {
    turn.value = null
    busy.value = false
  }
}

watch([alg, setup], () => {
  reset()
})

onBeforeUnmount(reset)
</script>

<template>
  <GuidePanel role="group" :aria-label="title">
    <div class="mb-3 flex flex-col gap-0.5">
      <p class="m-0 text-sm font-semibold text-highlighted">
        {{ title }}
      </p>
      <p v-if="mnemonic" class="m-0 text-sm text-muted">
        口诀：{{ mnemonic }}
      </p>
    </div>

    <div
      class="grid items-center gap-3"
      :class="view === 'both' ? 'max-md:grid-cols-1 md:grid-cols-2' : 'grid-cols-1'"
    >
      <RubikScene
        :cube="cube"
        :turn="turn"
        :label="`${title} 立体视图`"
      />
      <RubikCycleMap
        v-if="view === 'both'"
        :cube="cube"
        :turn="turn"
        :label="`${title} 六面圆环图`"
      />
    </div>

    <div
      class="mt-3 mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm"
      aria-label="WCA 公式"
    >
      <span
        v-if="moves.length"
        class="shrink-0 font-mono text-xs text-muted tabular-nums"
      >{{ stepNo }}/{{ moves.length }}</span>
      <div class="flex flex-wrap items-center gap-1 font-mono">
        <span
          v-for="(move, i) in moves"
          :key="`${move}-${i}`"
          class="inline-flex min-w-6 justify-center rounded px-1 py-0.5"
          :class="i === focusMoveIndex
            ? (pristine
              ? 'bg-primary/15 text-primary ring ring-inset ring-primary/35'
              : 'bg-primary text-inverted')
            : i < doneMoveCount
              ? 'bg-elevated text-default opacity-55'
              : 'bg-elevated text-default'"
          :title="moveZh(move)"
        >
          {{ move }}
        </span>
      </div>
      <p
        v-if="focusMove"
        class="m-0 shrink-0 text-xs text-muted"
        aria-live="polite"
      >
        <span class="font-mono text-default">{{ focusMove }}</span>
        {{ focusMoveZh }}
      </p>
    </div>

    <div class="flex flex-wrap gap-1.5">
      <UButton
        type="button"
        size="xs"
        color="neutral"
        variant="outline"
        :disabled="index === 0 && !busy"
        @click="reset"
      >
        重置
      </UButton>
      <UButton
        type="button"
        size="xs"
        color="neutral"
        variant="outline"
        :disabled="busy || index === 0"
        @click="stepBack"
      >
        上一步
      </UButton>
      <UButton
        type="button"
        size="xs"
        color="primary"
        @click="togglePlay"
      >
        {{ playing ? '暂停' : '播放' }}
      </UButton>
      <UButton
        type="button"
        size="xs"
        color="neutral"
        variant="outline"
        :disabled="busy || atEnd"
        @click="stepForward"
      >
        下一步
      </UButton>
      <UButton
        type="button"
        size="xs"
        color="neutral"
        variant="outline"
        @click="fast = !fast"
      >
        {{ fast ? '2x' : '1x' }}
      </UButton>
    </div>

    <p v-if="note" class="mt-2.5 mb-0 text-sm leading-snug text-muted">
      {{ note }}
    </p>
  </GuidePanel>
</template>
