<script setup lang="ts">
import { onMounted } from 'vue'
import { GLYPH_CROPS } from './flypy-data'
import type { RadicalSvgGlyphPos } from './flypy-radical-svg-layout'
import { buildRadicalSvgLayout, FLYPY_SVG_RADIUS } from './flypy-radical-svg-layout'
import { setupFlypySvgDownload } from './flypy-svg-download'
import FlypyFigure from './FlypyFigure.vue'

const layout = buildRadicalSvgLayout()
const cropMap = new Map(GLYPH_CROPS.map((c) => [c.id, c]))

function hasShape(glyph: RadicalSvgGlyphPos): boolean {
  if (glyph.type !== 'symbol') return false
  const crop = cropMap.get(glyph.id)
  return Boolean(crop?.path || crop?.strokes?.length)
}

onMounted(() => {
  setupFlypySvgDownload()
})
</script>

<template>
  <FlypyFigure aria-label="小鹤音形部件字根键位图">
    <svg
      class="flypy-svg-type"
      :viewBox="layout.viewBox"
      role="img"
      aria-label="小鹤音形部件字根键位图"
    >
      <defs>
        <symbol
          v-for="crop in GLYPH_CROPS"
          :key="crop.id"
          :id="`flypy-glyph-${crop.id}`"
          :viewBox="crop.viewBox"
        >
          <path v-if="crop.path" :d="crop.path" fill="currentColor" stroke="none" />
          <path
            v-for="(d, i) in crop.strokes ?? []"
            :key="i"
            :d="d"
            stroke="currentColor"
            stroke-width="8"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
          />
        </symbol>
      </defs>

      <g data-part="keyboard">
        <g v-for="key in layout.keys" :key="key.key" :data-key="key.key">
          <rect
            :x="key.x"
            :y="key.y"
            :width="key.size"
            :height="key.size"
            :rx="FLYPY_SVG_RADIUS"
            :ry="FLYPY_SVG_RADIUS"
            class="flypy-svg-key-fill flypy-svg-key-stroke"
            stroke-width="1"
          />
          <text
            :x="key.letterX"
            :y="key.letterY"
            :font-size="key.letterSize"
            font-weight="700"
            fill="currentColor"
            class="flypy-kind-phonetic"
          >
            {{ key.key }}
          </text>
          <text
            v-if="key.corner"
            :x="key.corner.x"
            :y="key.corner.y"
            :font-size="key.corner.size"
            font-weight="500"
            text-anchor="end"
            fill="currentColor"
            :class="`flypy-kind-${key.corner.kind}`"
          >
            {{ key.corner.text }}
          </text>
          <template v-for="(glyph, gIdx) in key.glyphs" :key="gIdx">
            <text
              v-if="glyph.type === 'text'"
              :x="glyph.x + glyph.w / 2"
              :y="glyph.y + glyph.h * 0.82"
              :font-size="glyph.h"
              font-weight="500"
              text-anchor="middle"
              fill="currentColor"
              :class="`flypy-kind-${glyph.kind}`"
            >
              {{ glyph.char }}
            </text>
            <use
              v-else-if="hasShape(glyph)"
              :href="`#flypy-glyph-${glyph.id}`"
              :x="glyph.x"
              :y="glyph.y"
              :width="glyph.w"
              :height="glyph.h"
              fill="currentColor"
              :class="`flypy-kind-${glyph.kind}`"
            />
          </template>
        </g>

        <foreignObject
          :x="layout.brand.x"
          :y="layout.brand.y"
          :width="layout.brand.size"
          :height="layout.brand.size"
        >
          <div class="flypy-svg-brand-fo">
            <button
              type="button"
              class="flypy-svg-download-btn"
              data-flypy-svg-download
              data-download-name="小鹤音形部件字根键位图.png"
              aria-label="下载小鹤音形部件字根键位图 PNG"
              title="下载 PNG"
            >
              <span>小鹤<br />双形</span>
            </button>
          </div>
        </foreignObject>
      </g>

      <text
        :x="layout.width / 2"
        :y="layout.legendY"
        :font-size="layout.font.legend"
        font-weight="500"
        text-anchor="middle"
        fill="currentColor"
        class="flypy-kind-phonetic"
      >
        基本以音定键，
        <tspan class="flypy-kind-non-phonetic" fill="currentColor">红色非音托部件</tspan>
        ，
        <tspan class="flypy-kind-special" fill="currentColor">绿色特别规则部件</tspan>
        ，
        <tspan class="flypy-kind-stroke" fill="currentColor">蓝色为笔画</tspan>
      </text>

      <text
        :x="0"
        :y="layout.smallTitleY"
        :font-size="layout.font.smallTitle"
        font-weight="500"
        fill="currentColor"
        class="flypy-kind-phonetic"
      >
        小字字根
      </text>

      <g data-part="small-chars">
        <g v-for="item in layout.smallItems" :key="item.key" :data-small-key="item.key">
          <text
            :x="item.keyX"
            :y="item.keyY"
            :font-size="layout.font.smallKey"
            font-weight="700"
            class="flypy-small-key"
          >
            {{ item.key }}
          </text>
          <template v-for="(ch, chIdx) in item.chars" :key="chIdx">
            <text
              :x="ch.x"
              :y="ch.pinyinY"
              :font-size="layout.font.smallPinyin"
              font-weight="400"
              text-anchor="middle"
              class="flypy-small-pinyin"
              :aria-hidden="ch.pinyin ? undefined : 'true'"
            >
              {{ ch.pinyin ?? '' }}
            </text>
            <text
              :x="ch.x"
              :y="ch.charY"
              :font-size="layout.font.smallHanzi"
              font-weight="500"
              text-anchor="middle"
              fill="currentColor"
              class="flypy-kind-phonetic"
            >
              {{ ch.char }}
            </text>
          </template>
        </g>
      </g>
    </svg>
  </FlypyFigure>
</template>
