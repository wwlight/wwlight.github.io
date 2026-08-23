import { defu } from 'defu'
import { themeIcons, cssVariableDefaults } from '../utils/theme'

export default defineNuxtPlugin({
  enforce: 'post',
  setup() {
    const appConfig = useAppConfig()
    const { style, link } = useTheme()

    useHead({ style, link })

    if (import.meta.client) {
      const primary = localStorage.getItem('nuxt-ui-primary')
      if (primary) appConfig.ui.colors.primary = primary

      const neutral = localStorage.getItem('nuxt-ui-neutral')
      if (neutral) appConfig.ui.colors.neutral = neutral

      onNuxtReady(() => {
        const icons = localStorage.getItem('nuxt-ui-icons')
        if (icons) appConfig.ui.icons = themeIcons[icons as keyof typeof themeIcons] as any
      })

      function restoreState<T>(key: string) {
        try {
          const raw = localStorage.getItem(key)
          if (raw) {
            const state = useState<T>(key)
            state.value = JSON.parse(raw)
          }
        } catch {
          // ignore malformed localStorage
        }
      }

      restoreState('nuxt-ui-ai-theme')
      restoreState('nuxt-ui-custom-colors')
      restoreState('nuxt-ui-css-variables')

      try {
        const extras = JSON.parse(localStorage.getItem('nuxt-ui-ai-theme') || '{}')
        if (extras.colors) {
          for (const [key, value] of Object.entries(extras.colors)) {
            (appConfig.ui.colors as any)[key] = value
          }
        }
        if (extras.ui) {
          onNuxtReady(() => {
            for (const [key, value] of Object.entries(extras.ui)) {
              if (key === 'colors' || key === 'icons') continue
              (appConfig.ui as any)[key] = defu(value as Record<string, any>, (appConfig.ui as any)[key] || {})
            }
          })
        }
      } catch {
        // ignore malformed localStorage
      }
    }

    if (import.meta.server) {
      useHead({
        script: [{
          innerHTML: `
            (function() {
              var primaryColor = localStorage.getItem('nuxt-ui-primary');
              var neutralColor = localStorage.getItem('nuxt-ui-neutral');
              if (!primaryColor && !neutralColor) return;
              function swapColors(el) {
                var html = el.innerHTML;
                if (primaryColor && primaryColor !== 'black') {
                  html = html.replace(
                    /(--ui-color-primary-\\d{2,3}:\\s*var\\(--color-)${appConfig.ui.colors.primary}(-\\d{2,3}.*?\\))/g,
                    \`$1\${primaryColor}$2\`
                  );
                }
                if (neutralColor) {
                  html = html.replace(
                    /(--ui-color-neutral-\\d{2,3}:\\s*var\\(--color-)${appConfig.ui.colors.neutral}(-\\d{2,3}.*?\\))/g,
                    \`$1\${neutralColor === 'neutral' ? 'old-neutral' : neutralColor}$2\`
                  );
                }
                el.innerHTML = html;
              }
              var colorsEl = document.querySelector('style#nuxt-ui-colors');
              if (colorsEl) {
                swapColors(colorsEl);
              } else {
                var obs = new MutationObserver(function(mutations) {
                  for (var i = 0; i < mutations.length; i++) {
                    for (var j = 0; j < mutations[i].addedNodes.length; j++) {
                      var node = mutations[i].addedNodes[j];
                      if (node.id === 'nuxt-ui-colors') {
                        swapColors(node);
                        obs.disconnect();
                        return;
                      }
                    }
                  }
                });
                obs.observe(document.head, { childList: true });
              }
            })();
            `.replace(/\s+/g, ' '),
          type: 'text/javascript',
          tagPriority: -1
        }]
      })
    }
  }
})
