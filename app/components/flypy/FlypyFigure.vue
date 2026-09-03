<script setup lang="ts">
import './flypy.css'

defineProps<{
  ariaLabel?: string
}>()
</script>

<template>
  <figure class="flypy-figure" :aria-label="ariaLabel">
    <slot />
  </figure>
</template>