declare module '*.ttf?subsets' {
  const src: string
  export default src
}

declare module '../../modules/font-subset/sources.json' {
  const sources: { name: string, url: string, family: string, dir: string }[]
  export default sources
}
