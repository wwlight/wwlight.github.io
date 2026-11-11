<script setup lang="ts">
import { PINYIN_ALPHABET } from './pinyin-alphabet-data'
import type { PinyinAlphabetItem, PinyinAlphabetSection } from './pinyin-alphabet-data'
import './pinyin.css'

const hoveredGroup = ref<string | null>(null)

function sectionActive(section: PinyinAlphabetSection): boolean {
  return hoveredGroup.value?.startsWith(`${section.tone}:`) ?? false
}

function cardClass(
  section: PinyinAlphabetSection,
  item: PinyinAlphabetItem,
): Record<string, boolean> {
  const active = Boolean(item.groupKey) && hoveredGroup.value === item.groupKey
  const dimmed =
    Boolean(item.groupKey) && sectionActive(section) && hoveredGroup.value !== item.groupKey
  return { active, dimmed }
}

function onCardEnter(item: PinyinAlphabetItem) {
  if (item.groupKey) hoveredGroup.value = item.groupKey
}
</script>

<template>
  <div class="pinyin-chart not-prose">
    <section v-for="section in PINYIN_ALPHABET" :key="section.title" class="pinyin-block">
      <h2 class="pinyin-block-title">{{ section.title }}（{{ section.items.length }}）</h2>
      <div class="pinyin-alphabet-grid">
        <article
          v-for="item in section.items"
          :key="`${section.tone}-${item.pinyin}`"
          :class="['pinyin-key-size', 'pinyin-alphabet-card', cardClass(section, item)]"
          @mouseenter="onCardEnter(item)"
          @mouseleave="hoveredGroup = null"
        >
          <div v-if="item.category" class="pinyin-alphabet-card-head">
            <span :class="['pinyin-alphabet-card-category', item.groupColor]">
              {{ item.category }}
            </span>
          </div>
          <div class="pinyin-alphabet-card-body">
            <div class="pinyin-alphabet-card-pinyin-wrap">
              <span :class="['pinyin-alphabet-card-pinyin', section.tone, item.groupColor]">
                {{ item.pinyin }}
              </span>
            </div>
            <div class="pinyin-alphabet-card-footer">
              <span class="pinyin-alphabet-card-hanzi">{{ item.hanzi }}</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
