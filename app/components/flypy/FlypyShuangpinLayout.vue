<script setup lang="ts">
import { onMounted } from 'vue'
import { buildLayoutSvgLayout, FLYPY_SVG_RADIUS } from './flypy-shuangpin-svg-layout'
import { setupFlypySvgDownload } from './flypy-svg-download'
import FlypyFigure from './FlypyFigure.vue'

const layout = buildLayoutSvgLayout()

onMounted(() => {
  setupFlypySvgDownload()
})
</script>

<template>
  <FlypyFigure aria-label="小鹤双拼键盘布局">
    <svg
      class="flypy-svg-type"
      :viewBox="layout.viewBox"
      role="img"
      aria-label="小鹤双拼键盘布局"
    >
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
            :x="key.letter.x"
            :y="key.letter.y"
            :font-size="key.letter.size"
            font-weight="700"
            :text-anchor="key.letter.anchor"
            fill="currentColor"
            :class="`flypy-tone-${key.letter.tone}`"
          >
            {{ key.letter.text }}
          </text>
          <text
            v-for="item in key.topRight"
            :key="`tr-${item.text}-${item.x}`"
            :x="item.x"
            :y="item.y"
            :font-size="item.size"
            font-weight="500"
            :text-anchor="item.anchor"
            fill="currentColor"
            :class="`flypy-tone-${item.tone}`"
          >
            {{ item.text }}
          </text>
          <text
            v-for="item in key.finals"
            :key="`f-${item.text}-${item.y}`"
            :x="item.x"
            :y="item.y"
            :font-size="item.size"
            font-weight="500"
            :text-anchor="item.anchor"
            fill="currentColor"
            :class="`flypy-tone-${item.tone}`"
          >
            {{ item.text }}
          </text>
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
              data-download-name="小鹤双拼键盘布局.png"
              aria-label="下载小鹤双拼键盘布局 PNG"
              title="下载 PNG"
            >
              <span>小鹤<br />双拼</span>
            </button>
          </div>
        </foreignObject>
      </g>
    </svg>
  </FlypyFigure>
</template>