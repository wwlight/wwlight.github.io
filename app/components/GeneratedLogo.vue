<script setup lang="ts">
import { GENERATED_LOGO_PATHS, GENERATED_LOGO_STROKE } from '../utils/generated-logo'

defineProps<{
  class?: string
}>()

const { width, linecap, linejoin } = GENERATED_LOGO_STROKE
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 128 128"
    role="img"
    aria-label="logo"
    class="generated-logo text-primary"
    :class="$props.class"
  >
    <path
      v-for="(d, index) in GENERATED_LOGO_PATHS"
      :key="index"
      :d="d"
      fill="none"
      stroke="currentColor"
      :stroke-width="width"
      :stroke-linecap="linecap"
      :stroke-linejoin="linejoin"
    />
  </svg>
</template>
