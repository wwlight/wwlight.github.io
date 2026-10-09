<script setup lang="ts">
import './flypy.css'
import { ensureFontFaceCss } from '../../utils/font-subset'

defineProps<{
  ariaLabel?: string
}>()

onMounted(() => {
  void ensureFontFaceCss('LXGW WenKai Light')
})
</script>

<template>
  <figure class="flypy-figure" :aria-label="ariaLabel">
    <slot />
  </figure>
</template>
