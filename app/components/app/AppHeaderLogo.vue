<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const appConfig = useAppConfig()
</script>

<template>
  <span class="inline-flex items-center gap-2">
    <GeneratedLogo class="h-6 w-6 shrink-0" />
    <span class="text-base font-semibold leading-none text-primary">
      {{ appConfig.header?.title }}
    </span>
  </span>
</template>
