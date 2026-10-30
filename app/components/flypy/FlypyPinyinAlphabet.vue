<script setup lang="ts">
import { FLYPY_PINYIN_ALPHABET } from './flypy-alphabet-data'
import type { PinyinAlphabetItem, PinyinAlphabetSection } from './flypy-alphabet-data'
import { FLYPY_GROUP_CLASS, FLYPY_SECTION_ACCENT, FLYPY_SECTION_TITLE } from './flypy-style'
import './flypy.css'

const hoveredGroup = ref<string | null>(null)

function sectionActive(section: PinyinAlphabetSection): boolean {
  return hoveredGroup.value?.startsWith(`${section.tone}:`) ?? false
}

function groupClass(item: PinyinAlphabetItem): string {
  return item.groupColor ? FLYPY_GROUP_CLASS[item.groupColor] ?? '' : ''
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
  <div class="my-5">
    <div class="flex flex-col gap-4">
      <section
        v-for="section in FLYPY_PINYIN_ALPHABET"
        :key="section.title"
        :class="['overflow-hidden rounded-md bg-muted/40 p-3 ring ring-default sm:p-4 border-s-[3px]', FLYPY_SECTION_ACCENT[section.tone]]"
      >
        <h3 :class="['mt-0 mb-3 text-sm font-semibold', FLYPY_SECTION_TITLE[section.tone]]">
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
              <span :class="['flypy-alphabet-card-category', groupClass(item)]">
                {{ item.category }}
              </span>
            </div>
            <div class="flypy-alphabet-card-body">
              <div class="flypy-alphabet-card-pinyin-wrap">
                <span :class="['flypy-alphabet-card-pinyin', section.tone, groupClass(item)]">
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
