/**
 * 功能：主题定制下拉面板（Primary / Neutral / Radius / Color Mode、随机、重置）。
 */
import { Laptop, Moon, RotateCcw, Shuffle, Sun } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type MouseEvent } from 'react'
import { flushSync } from 'react-dom'
import {
  getDocumentThemeCustomizerState,
  getServerThemeCustomizerStateSnapshot,
  isDefaultThemeCustomizerState,
  randomThemeCustomizerState,
  resetThemeCustomizerToDefaults,
  setThemeCustomizerState,
  subscribeThemeCustomizerState,
} from '@/theme/customizer/state'
import {
  DEFAULT_COLOR_MODE,
  NEUTRAL_THEMES,
  PRIMARY_THEMES,
  RADIUS_OPTIONS,
  type NeutralThemeId,
  type PrimaryThemeId,
  type RadiusOptionId,
} from '@/theme/customizer/options'
import {
  getStoredThemePreference,
  setThemePreference,
  setThemePreferenceWithTransition,
  type ThemePreference,
} from '@/theme/color-mode/color-mode'
import { subscribeSiteThemeStorage } from '@/theme/site/sync'
import { themeCustomizerSwatchClass, type ThemeSurface } from '@/theme/customizer/trigger-classes'
import {
  optionButtonClass,
  panelFooterBorderClass,
  sectionTitleClass,
} from '@/theme/customizer/surface'
import { cn } from '@/lib/utils'

const THEME_ACTION_DEBOUNCE_MS = 400

function useDebouncedCallback(callback: () => void, delayMs: number) {
  const callbackRef = useRef(callback)
  const timerRef = useRef<number | undefined>(undefined)

  callbackRef.current = callback

  useEffect(() => {
    return () => {
      if (timerRef.current !== undefined)
        window.clearTimeout(timerRef.current)
    }
  }, [])

  return useCallback(() => {
    if (timerRef.current !== undefined)
      window.clearTimeout(timerRef.current)

    timerRef.current = window.setTimeout(() => {
      timerRef.current = undefined
      callbackRef.current()
    }, delayMs)
  }, [delayMs])
}

function SwatchOption({
  label,
  swatch,
  selected,
  surface,
  onClick,
}: {
  label: string
  swatch: string
  selected: boolean
  surface: ThemeSurface
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex cursor-pointer items-center gap-1.5 theme-r-md border px-2 py-1.5 text-left text-xs',
        optionButtonClass(surface, selected),
      )}
    >
      <span
        className={themeCustomizerSwatchClass()}
        style={{ backgroundColor: swatch }}
        aria-hidden
      />
      <span className="min-w-0 leading-tight">{label}</span>
    </button>
  )
}

function RadiusOptionButton({
  label,
  selected,
  surface,
  onClick,
}: {
  label: string
  selected: boolean
  surface: ThemeSurface
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex-1 cursor-pointer theme-r-lg border px-2 py-1.5 text-center text-xs',
        optionButtonClass(surface, selected),
      )}
    >
      {label}
    </button>
  )
}

function ColorModeButton({
  label,
  icon: Icon,
  selected,
  surface,
  onClick,
}: {
  label: string
  icon: typeof Sun
  selected: boolean
  surface: ThemeSurface
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex cursor-pointer flex-col items-center gap-1 theme-r-md border px-2 py-2 text-xs',
        optionButtonClass(surface, selected),
      )}
    >
      <Icon className="size-4" aria-hidden />
      <span>{label}</span>
    </button>
  )
}

interface ThemeCustomizerPanelProps {
  variant?: ThemeSurface
  open?: boolean
  onUpdated?: () => void
}

export function ThemeCustomizerPanel({ variant = 'bookmarks', open = true, onUpdated }: ThemeCustomizerPanelProps) {
  const state = useSyncExternalStore(
    subscribeThemeCustomizerState,
    getDocumentThemeCustomizerState,
    getServerThemeCustomizerStateSnapshot,
  )
  const [colorMode, setColorMode] = useState(getStoredThemePreference)

  useEffect(() => {
    if (!open)
      return

    setColorMode(getStoredThemePreference())
  }, [open])

  useEffect(() => {
    return subscribeSiteThemeStorage(() => {
      setColorMode(getStoredThemePreference())
    })
  }, [])

  const isDefault = useMemo(
    () => isDefaultThemeCustomizerState(state) && colorMode === DEFAULT_COLOR_MODE,
    [state, colorMode],
  )

  const applyThemeCustomizer = (partial: Parameters<typeof setThemeCustomizerState>[0]) => {
    flushSync(() => {
      setThemeCustomizerState(partial)
    })
    onUpdated?.()
  }

  const handleRandom = useDebouncedCallback(() => {
    flushSync(() => {
      randomThemeCustomizerState(getDocumentThemeCustomizerState())
    })
    onUpdated?.()
  }, THEME_ACTION_DEBOUNCE_MS)

  const handleReset = useDebouncedCallback(() => {
    flushSync(() => {
      setColorMode(DEFAULT_COLOR_MODE)
      setThemePreference(DEFAULT_COLOR_MODE)
      resetThemeCustomizerToDefaults()
    })
    onUpdated?.()
  }, THEME_ACTION_DEBOUNCE_MS)

  return (
    <div className="space-y-4" data-theme-surface={variant}>
      <section className="space-y-2">
        <p className={sectionTitleClass(variant)}>Primary</p>
        <div className="grid grid-cols-3 gap-1.5">
          {PRIMARY_THEMES.map(theme => (
            <SwatchOption
              key={theme.id}
              label={theme.label}
              swatch={theme.swatch}
              surface={variant}
              selected={state.primary === theme.id}
              onClick={() => applyThemeCustomizer({ primary: theme.id as PrimaryThemeId })}
            />
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <p className={sectionTitleClass(variant)}>Neutral</p>
        <div className="grid grid-cols-3 gap-1.5">
          {NEUTRAL_THEMES.map(theme => (
            <SwatchOption
              key={theme.id}
              label={theme.label}
              swatch={theme.swatch}
              surface={variant}
              selected={state.neutral === theme.id}
              onClick={() => applyThemeCustomizer({ neutral: theme.id as NeutralThemeId })}
            />
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <p className={sectionTitleClass(variant)}>Radius</p>
        <div className="flex gap-1.5">
          {RADIUS_OPTIONS.map(option => (
            <RadiusOptionButton
              key={option.id}
              label={option.label}
              surface={variant}
              selected={state.radius === option.id}
              onClick={() => applyThemeCustomizer({ radius: option.id as RadiusOptionId })}
            />
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <p className={sectionTitleClass(variant)}>Color Mode</p>
        <div className="grid grid-cols-3 gap-1.5">
          {(
            [
              { id: 'light' as ThemePreference, label: 'Light', icon: Sun },
              { id: 'dark' as ThemePreference, label: 'Dark', icon: Moon },
              { id: 'system' as ThemePreference, label: 'System', icon: Laptop },
            ] as const
          ).map(({ id, label, icon }) => (
            <ColorModeButton
              key={id}
              label={label}
              icon={icon}
              surface={variant}
              selected={colorMode === id}
              onClick={(event) => {
                setColorMode(id)
                void setThemePreferenceWithTransition(id, event)
                onUpdated?.()
              }}
            />
          ))}
        </div>
      </section>

      <div className={cn('flex gap-1.5 border-t pt-3', panelFooterBorderClass(variant))}>
        <button
          type="button"
          onClick={handleRandom}
          className={cn(
            'flex flex-1 cursor-pointer items-center justify-center gap-1.5 theme-r-md border px-2 py-2 text-xs',
            optionButtonClass(variant, false),
          )}
          aria-label="随机主题"
        >
          <Shuffle className="size-3.5" aria-hidden />
          随机
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={isDefault}
          className={cn(
            'flex flex-1 cursor-pointer items-center justify-center gap-1.5 theme-r-md border px-2 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-45',
            optionButtonClass(variant, false),
          )}
          aria-label="重置主题为默认"
        >
          <RotateCcw className="size-3.5" aria-hidden />
          重置
        </button>
      </div>
    </div>
  )
}
