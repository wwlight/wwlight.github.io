<script setup lang="ts">
import type { TabsProps } from '@nuxt/ui'

withDefaults(
  defineProps<{
    size?: TabsProps['size']
  }>(),
  {
    size: 'xs',
  },
)

const appConfig = useAppConfig()
const colorMode = useColorMode()
const mounted = useMounted()
const { setModeWithTransition } = useThemeTransition()

const items = computed(() => [
  { label: 'Light', value: 'light' as const, icon: appConfig.ui.icons.light },
  { label: 'Dark', value: 'dark' as const, icon: appConfig.ui.icons.dark },
  { label: 'System', value: 'system' as const, icon: appConfig.ui.icons.system },
])

const mode = computed(() => (mounted.value ? colorMode.preference : 'system'))

function onModeSelect(preference: 'light' | 'dark' | 'system', event: MouseEvent) {
  void setModeWithTransition(preference, event)
}
</script>

<template>
  <div
    class="inline-flex items-center rounded-md bg-elevated/50 p-0.5 ring ring-default"
    role="tablist"
    aria-label="Color mode"
  >
    <UButton
      v-for="item in items"
      :key="item.value"
      :icon="item.icon"
      :aria-label="item.label"
      color="neutral"
      :variant="mode === item.value ? 'soft' : 'ghost'"
      :size="size"
      square
      class="p-1.5"
      @click="onModeSelect(item.value, $event)"
    />
  </div>
</template>
