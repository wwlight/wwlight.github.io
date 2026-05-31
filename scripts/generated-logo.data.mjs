/** 站点标识：纯曲线镂空 W（favicon 内联脚本与组件共用） */
export const GENERATED_LOGO_STROKE = {
  width: 14,
  linecap: 'round',
  linejoin: 'round',
}

/** 仅 M / C，无直线段 */
export const GENERATED_LOGO_PATHS = [
  'M20 44 C24 44 32 96 46 92 C52 86 60 44 64 40 C68 44 76 86 82 92 C96 96 104 44 108 44',
]

/** @param {string} stroke */
export function buildGeneratedLogoSvg(stroke = 'currentColor') {
  const { width, linecap, linejoin } = GENERATED_LOGO_STROKE
  const shapes = GENERATED_LOGO_PATHS.map(
    d =>
      `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="${linecap}" stroke-linejoin="${linejoin}" />`,
  ).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="logo">${shapes}</svg>`
}
