<script setup lang="ts">
const appConfig = useAppConfig()
const { isEnabled: isAssistantEnabled } = useAssistant()
const { isEnabled, locales } = useDocusI18n()
const { subNavigationMode } = useSubNavigation()

const githubUrl = computed(() => appConfig.github?.url)
</script>

<template>
  <UHeader
    :class="{ 'flex flex-col': subNavigationMode === 'header' }"
  >
    <template #left>
      <AppHeaderLeft />
    </template>

    <template #right>
      <AppHeaderCTA />

      <template v-if="isAssistantEnabled">
        <AssistantChat />
      </template>

      <template v-if="isEnabled && locales.length > 1">
        <ClientOnly>
          <LanguageSelect />

          <template #fallback>
            <div class="h-8 w-8 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-md" />
          </template>
        </ClientOnly>

        <USeparator
          orientation="vertical"
          class="h-8"
        />
      </template>

      <UContentSearchButton />

      <UButton
        v-if="githubUrl"
        icon="i-simple-icons-github"
        color="neutral"
        variant="ghost"
        :to="githubUrl"
        target="_blank"
        aria-label="GitHub"
      />

      <ThemePicker />
    </template>

    <template #toggle="{ open, toggle }">
      <IconMenuToggle
        :open="open"
        class="lg:hidden"
        @click="toggle"
      />
    </template>

    <template #body>
      <AppHeaderBody />
    </template>

    <template
      v-if="subNavigationMode === 'header'"
      #bottom
    >
      <AppHeaderBottom />
    </template>
  </UHeader>
</template>
