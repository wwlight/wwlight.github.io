<script setup lang="ts">
import colors from 'tailwindcss/colors'

const props = defineProps<{
  label: string
  icon?: string
  chip?: string
  selected?: boolean
}>()

const slots = defineSlots<{
  leading: () => any
}>()

const lightColor = computed(() => props.chip
  ? (colors as any)[props.chip]?.[500] || `var(--color-${props.chip}-500)`
  : '')
const darkColor = computed(() => props.chip
  ? (colors as any)[props.chip]?.[400] || `var(--color-${props.chip}-400)`
  : '')
</script>

<template>
  <UButton
    size="sm"
    color="neutral"
    variant="outline"
    :icon="icon"
    :label="label"
    class="capitalize ring-default rounded-sm text-[11px]"
    :class="[selected ? 'bg-elevated' : 'hover:bg-elevated/50']"
  >
    <template v-if="chip || !!slots.leading" #leading>
      <slot name="leading">
        <span
          class="inline-block size-2 rounded-full"
          :class="`bg-(--color-light) dark:bg-(--color-dark)`"
          :style="{
            '--color-light': lightColor,
            '--color-dark': darkColor
          }"
        />
      </slot>
    </template>
  </UButton>
</template>
