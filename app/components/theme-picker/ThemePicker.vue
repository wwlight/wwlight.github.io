<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { chipColors } from '~/utils/theme'
import { themeChipStyle, type ThemePreset } from '~/utils/theme/presets'
import { DEFAULT_SANS_FAMILY } from '~/utils/font-subset'

const props = defineProps<{
  /** Sidebar collapsed: open panel to the right instead of bottom-left. */
  collapsed?: boolean
}>()

const appConfig = useAppConfig()
const colorMode = useColorMode()
const open = ref(false)
const mounted = useMounted()

const menuContent = computed(() =>
  props.collapsed
    ? { side: 'right' as const, align: 'end' as const, sideOffset: 8, collisionPadding: 8 }
    : { align: 'center' as const, sideOffset: 8, collisionPadding: 8 },
)

const tooltipContent = computed(() => (props.collapsed ? { side: 'right' as const } : undefined))

const {
  themePresets,
  selectedPreset,
  currentPreset,
  applyPreset,
  neutralColors,
  neutral,
  primaryColors,
  primary,
  blackAsPrimary,
  setBlackAsPrimary,
  radiuses,
  radius,
  fonts,
  font,
  fontWeights,
  weight,
  icon,
  icons,
  hasCSSChanges,
  hasAppConfigChanges,
  resetTheme,
} = useTheme()

const mode = computed(
  () => (mounted.value ? colorMode.preference : 'system') as 'light' | 'dark' | 'system',
)
const modified = computed(
  () => hasCSSChanges.value || hasAppConfigChanges.value || selectedPreset.value === 'custom',
)
const name = computed(() => `${currentPreset.value?.name || 'Custom'} theme`)
const isDark = computed(() => mounted.value && colorMode.value === 'dark')

/** Header trigger: palette for Default (like docs); otherwise the preset glyph. */
const triggerIcon = computed(() => {
  if (!mounted.value) return 'i-lucide-palette'
  const id = currentPreset.value?.id
  if (!id || id === 'default' || id === 'custom') return 'i-lucide-palette'
  return currentPreset.value?.icon || 'i-lucide-palette'
})

function upperFirst(value: string) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value
}

function rampCssName(palette: string) {
  return palette === 'neutral' ? 'old-neutral' : palette
}

function swatch(palette: string) {
  const key = rampCssName(palette)
  const chip = chipColors[key]
  if (chip) return isDark.value ? chip.dark : chip.light
  return `var(--color-${key}-500)`
}

/** Docs-style chip avatar: icon in primary, on a soft primary tint. */
function presetChip(preset: ThemePreset): NonNullable<DropdownMenuItem['avatar']> {
  return {
    icon: preset.icon,
    class: 'bg-(image:--chip-bg-light) dark:bg-(image:--chip-bg-dark)',
    style: themeChipStyle(preset, chipColors),
    ui: { icon: 'text-(--chip-icon-light) dark:text-(--chip-icon-dark)' },
  }
}

const keep = (apply: () => void) => (event: Event) => {
  event.preventDefault()
  apply()
}

const submenu = { content: { class: 'w-auto' } }

function setting(row: {
  label: string
  icon: string
  value: string
  dot?: string
  dirty?: boolean
  children: NonNullable<DropdownMenuItem['children']>
}): DropdownMenuItem {
  return {
    ...row,
    ...submenu,
    slot: 'setting',
    ui: { itemWrapper: 'flex-none', itemTrailing: 'min-w-0' },
  }
}

const fontLabel = computed(
  () => fonts.find((item) => item.value === font.value)?.label ?? font.value,
)
const weightLabel = computed(
  () => fontWeights.value.find((item) => item.value === weight.value)?.label ?? weight.value,
)

const items = computed<DropdownMenuItem[][]>(() => [
  [
    {
      ...submenu,
      label: currentPreset.value?.name || 'Custom',
      avatar: currentPreset.value ? presetChip(currentPreset.value) : undefined,
      ui: {
        itemLabel: `font-semibold ${modified.value ? 'text-primary' : 'text-highlighted'}`,
      },
      children: themePresets.map((preset) => ({
        label: preset.name,
        avatar: presetChip(preset),
        type: 'checkbox' as const,
        checked: selectedPreset.value === preset.id,
        onSelect: keep(() => applyPreset(preset)),
      })),
    },
  ],
  [
    setting({
      label: 'Primary',
      dirty: mounted.value && (blackAsPrimary.value || primary.value !== 'green'),
      icon: 'i-lucide-brush',
      value: blackAsPrimary.value ? 'Black' : upperFirst(primary.value),
      dot: blackAsPrimary.value ? (isDark.value ? '#fff' : '#000') : swatch(primary.value),
      children: [
        {
          label: 'Black',
          slot: 'color',
          dot: isDark.value ? '#fff' : '#000',
          type: 'checkbox' as const,
          checked: blackAsPrimary.value,
          onSelect: keep(() => setBlackAsPrimary(true)),
        },
        ...primaryColors.map((color) => ({
          label: upperFirst(color),
          slot: 'color',
          dot: swatch(color),
          type: 'checkbox' as const,
          checked: !blackAsPrimary.value && primary.value === color,
          onSelect: keep(() => {
            primary.value = color
          }),
        })),
      ],
    }),
    setting({
      label: 'Neutral',
      dirty: mounted.value && neutral.value !== 'slate',
      icon: 'i-lucide-contrast',
      value: upperFirst(neutral.value),
      dot: swatch(neutral.value),
      children: neutralColors.map((color) => ({
        label: upperFirst(color),
        slot: 'color',
        dot: swatch(color),
        type: 'checkbox' as const,
        checked: neutral.value === color,
        onSelect: keep(() => {
          neutral.value = color
        }),
      })),
    }),
    setting({
      label: 'Icons',
      dirty: mounted.value && icon.value !== 'lucide',
      icon: 'i-lucide-shapes',
      value: icons.find((pack) => pack.value === icon.value)?.label ?? icon.value,
      children: icons.map((pack) => ({
        label: pack.label,
        icon: pack.icon,
        type: 'checkbox' as const,
        checked: icon.value === pack.value,
        onSelect: keep(() => {
          icon.value = pack.value as typeof icon.value
        }),
      })),
    }),
    setting({
      label: 'Radius',
      dirty: mounted.value && radius.value !== 0.25,
      icon: 'i-lucide-square-round-corner',
      value: `${radius.value}rem`,
      children: radiuses.map((value) => ({
        label: `${value}rem`,
        type: 'checkbox' as const,
        checked: radius.value === value,
        onSelect: keep(() => {
          radius.value = value
        }),
      })),
    }),
    setting({
      label: 'Font',
      dirty: mounted.value && font.value !== DEFAULT_SANS_FAMILY,
      icon: 'i-lucide-type',
      value: fontLabel.value,
      children: fonts.map((item) => ({
        label: item.label,
        type: 'checkbox' as const,
        checked: font.value === item.value,
        onSelect: keep(() => {
          font.value = item.value
        }),
      })),
    }),
    ...(fontWeights.value.length
      ? [
          setting({
            label: 'Weight',
            dirty: mounted.value && weight.value !== fontWeights.value[0]?.value,
            icon: 'i-lucide-bold',
            value: weightLabel.value,
            children: fontWeights.value.map((item) => ({
              label: item.label,
              type: 'checkbox' as const,
              checked: weight.value === item.value,
              onSelect: keep(() => {
                weight.value = item.value
              }),
            })),
          }),
        ]
      : []),
  ],
  [
    {
      type: 'label',
      slot: 'color-mode',
      label: upperFirst(mode.value),
      icon: appConfig.ui.icons[mode.value],
      ui: { label: 'font-normal text-sm text-default' },
    },
  ],
  [
    {
      label: 'Reset theme',
      icon: 'i-lucide-rotate-ccw',
      disabled: !modified.value && selectedPreset.value === 'default',
      onSelect: () => resetTheme(),
    },
  ],
])

function asRow(item: unknown) {
  return item as { label: string; icon?: string; value?: string; dot?: string; dirty?: boolean }
}
</script>

<template>
  <UDropdownMenu
    v-model:open="open"
    :items="items"
    :content="menuContent"
    :ui="{ content: 'w-56 min-w-36 max-h-98', label: 'text-xs' }"
  >
    <UTooltip :text="name" :content="tooltipContent">
      <UButton
        :icon="triggerIcon"
        color="neutral"
        variant="ghost"
        square
        :aria-label="name"
        :ui="{ leadingIcon: 'text-primary' }"
      />
    </UTooltip>

    <template #setting-trailing="{ item }">
      <span
        class="flex items-center gap-1.5 min-w-0"
        :class="asRow(item).dirty ? 'text-primary' : 'text-muted'"
      >
        <span
          v-if="asRow(item).dot"
          class="inline-block size-2.5 shrink-0 rounded-full ring ring-default"
          :style="{ backgroundColor: asRow(item).dot }"
        />
        <span class="truncate">{{ asRow(item).value }}</span>
      </span>

      <UIcon :name="appConfig.ui.icons.chevronRight" class="size-5 shrink-0 text-dimmed" />
    </template>

    <template #color-leading="{ item }">
      <span class="size-5 shrink-0 flex items-center justify-center">
        <span
          class="inline-block size-2.5 rounded-full ring ring-default"
          :style="{ backgroundColor: asRow(item).dot }"
        />
      </span>
    </template>

    <template #color-mode="{ item }">
      <UIcon :name="asRow(item).icon!" class="size-5 shrink-0 text-dimmed" />
      {{ asRow(item).label }}
      <ThemePickerColorModeTabs class="ms-auto -my-1.5 [&>div]:ring-0" />
    </template>
  </UDropdownMenu>
</template>
