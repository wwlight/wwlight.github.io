<script setup lang="ts">
const appConfig = useAppConfig()
const colorMode = useColorMode()
const { setModeWithTransition } = useThemeTransition()

const forcedColorMode = computed(() => {
  const forced = (appConfig.docus as { colorMode?: string })?.colorMode
  return forced === 'light' || forced === 'dark' ? forced : undefined
})

interface FooterLink {
  icon: string
  to: string
  target: '_blank'
  'aria-label': string
}

const links = computed<FooterLink[]>(() => {
  return [
    ...Object.entries(appConfig.socials || {}).flatMap(([key, url]) => {
      if (typeof url !== 'string' || !url) {
        return []
      }

      return [
        {
          icon: `i-simple-icons-${key}`,
          to: url,
          target: '_blank' as const,
          'aria-label': `${key} social link`,
        },
      ]
    }),
    ...(appConfig.github && appConfig.github.url
      ? [
          {
            icon: 'i-simple-icons-github',
            to: appConfig.github.url,
            target: '_blank' as const,
            'aria-label': 'GitHub repository',
          },
        ]
      : []),
  ]
})

function onToggleColorMode(event: MouseEvent) {
  const next: 'dark' | 'light' = colorMode.value === 'dark' ? 'light' : 'dark'
  void setModeWithTransition(next, event)
}
</script>

<template>
  <template v-if="links.length">
    <UButton
      v-for="(link, index) of links"
      :key="index"
      size="sm"
      v-bind="{ color: 'neutral', variant: 'ghost', ...link }"
    />
  </template>
  <UButton
    v-if="!forcedColorMode"
    color="neutral"
    variant="ghost"
    size="xl"
    :aria-label="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="onToggleColorMode"
  >
    <template #leading="{ ui }">
      <UIcon :class="[ui.leadingIcon, 'dark:hidden']" :name="appConfig.ui.icons.light" />
      <UIcon
        :class="[ui.leadingIcon, 'hidden dark:inline-block']"
        :name="appConfig.ui.icons.dark"
      />
    </template>
  </UButton>
</template>
