<script setup lang="ts">
const requestURL = useRequestURL()

const isLocal = computed(() => {
  const host = requestURL.hostname
  return host === 'localhost' || host === '127.0.0.1' || import.meta.dev
})

const interviewSiteUrl = computed(() => {
  const url = new URL(requestURL.origin)
  if (!url.hostname.startsWith('interview-')) {
    url.hostname = `interview-${url.hostname}`
  }
  return url.origin
})
</script>

<template>
  <UButton
    v-if="!isLocal"
    icon="i-lucide-book-open"
    :to="interviewSiteUrl"
    target="_blank"
    color="neutral"
    variant="link"
    size="sm"
    label="面试"
    class="text-muted hover:text-highlighted"
  />
</template>
