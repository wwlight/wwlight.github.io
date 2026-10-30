<script setup lang="ts">
withDefaults(defineProps<{
  as?: string
}>(), { as: 'div' })
</script>

<template>
  <component
    :is="as"
    class="my-5 w-full overflow-visible rounded-lg bg-muted/80 p-3.5 ring ring-default sm:p-4"
  >
    <slot />
  </component>
</template>
