// 在 Netlify 构建之间恢复 TTF / cn-split 产物，避免每次冷切 13 个中文字库
const TTF_DIR = '.cache/font-subset/ttf'
const SPLIT_DIR = '.cache/font-subset/split'

module.exports = {
  async onPreBuild({ utils }) {
    const ttf = await utils.cache.restore(TTF_DIR)
    const split = await utils.cache.restore(SPLIT_DIR)
    console.log(`[font-subset-cache] restore ttf=${ttf} split=${split}`)
  },
  async onEnd({ utils }) {
    const ttf = await utils.cache.save(TTF_DIR)
    const split = await utils.cache.save(SPLIT_DIR)
    console.log(`[font-subset-cache] save ttf=${ttf} split=${split}`)
  }
}
