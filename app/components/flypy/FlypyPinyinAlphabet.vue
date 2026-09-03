<script setup lang="ts">
import { ref } from 'vue'
import { FLYPY_PINYIN_ALPHABET } from './flypy-alphabet-data'
import type { PinyinAlphabetItem, PinyinAlphabetSection } from './flypy-alphabet-data'

const hoveredGroup = ref<string | null>(null)

function sectionActive(section: PinyinAlphabetSection): boolean {
  return hoveredGroup.value?.startsWith(`${section.tone}:`) ?? false
}

function groupClass(item: PinyinAlphabetItem): string {
  return item.groupColor ? `flypy-group-${item.groupColor}` : ''
}

function cardClass(section: PinyinAlphabetSection, item: PinyinAlphabetItem): Record<string, boolean> {
  const active = Boolean(item.groupKey) && hoveredGroup.value === item.groupKey
  const dimmed = Boolean(item.groupKey) && sectionActive(section) && hoveredGroup.value !== item.groupKey
  return { active, dimmed }
}

function onCardEnter(item: PinyinAlphabetItem) {
  if (item.groupKey)
    hoveredGroup.value = item.groupKey
}
</script>

<template>
  <div class="flypy-alphabet-outer">
    <div class="flypy-alphabet-wrap">
      <section
        v-for="section in FLYPY_PINYIN_ALPHABET"
        :key="section.title"
        :class="['flypy-alphabet-section', section.tone]"
      >
        <h3 :class="['flypy-alphabet-section-title', section.tone]">
          {{ section.title }}
        </h3>
        <div class="flypy-alphabet-grid" @mouseleave="hoveredGroup = null">
          <article
            v-for="item in section.items"
            :key="`${section.tone}-${item.pinyin}`"
            :class="['flypy-key-size', 'flypy-alphabet-card', cardClass(section, item)]"
            @mouseenter="onCardEnter(item)"
          >
            <div v-if="item.category" class="flypy-alphabet-card-head">
              <span
                :class="['flypy-alphabet-card-category', groupClass(item)]"
              >
                {{ item.category }}
              </span>
            </div>
            <div class="flypy-alphabet-card-body">
              <div class="flypy-alphabet-card-pinyin-wrap">
                <span
                  :class="['flypy-alphabet-card-pinyin', section.tone, groupClass(item)]"
                >
                  {{ item.pinyin }}
                </span>
              </div>
              <div class="flypy-alphabet-card-footer">
                <span class="flypy-alphabet-card-hanzi">{{ item.hanzi }}</span>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>