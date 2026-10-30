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
  <GuidePanel as="figure" :aria-label="ariaLabel">
    <slot />
  </GuidePanel>
</template>
