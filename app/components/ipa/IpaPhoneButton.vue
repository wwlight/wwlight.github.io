<script setup lang="ts">
import { ipaDiffers, ipaSymbol, type IpaAccent, type IpaPhone } from './ipa-data'
import './ipa.css'

const props = defineProps<{
  phone: IpaPhone
  accent: IpaAccent
  playing: boolean
  tag: string
}>()

defineEmits<{ play: [] }>()

const symbol = computed(() => ipaSymbol(props.phone, props.accent))
const differs = computed(() => ipaDiffers(props.phone))
const label = computed(() => `朗读 ${props.phone.word}，${symbol.value}，${props.phone.gloss}`)
</script>

<template>
  <UButton
    type="button"
    color="neutral"
    variant="ghost"
    block
    :ui="{ base: 'focus-visible:outline-none' }"
    class="ipa-phone"
    :aria-pressed="playing"
    :aria-label="label"
    @click="$emit('play')"
  >
    <span class="ipa-voice">{{ tag }}</span>
    <span
      class="ipa-glyph text-lg leading-none font-semibold"
      :class="differs ? 'text-primary' : undefined"
    >
      {{ symbol }}
    </span>
    <span class="ipa-word" :class="{ 'is-hidden': !playing }">{{ phone.word }}</span>
  </UButton>
</template>
