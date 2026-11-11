<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import {
  IPA_CLUSTERS,
  IPA_CONSONANTS,
  IPA_DIPHTHONGS,
  IPA_MONOPHTHONGS,
  ipaKind,
  type IpaAccent,
  type IpaKind,
  type IpaPhone,
} from './ipa-data'
import { IPA_KIND_CLASS } from './ipa-style'
import './ipa.css'

const accent = ref<IpaAccent>('rp')
const playingId = ref<string | null>(null)

const accentItems: TabsItem[] = [
  { label: '英音', value: 'rp' },
  { label: '美音', value: 'ga' },
]

const accentLabel = computed(() => (accent.value === 'rp' ? '标准英音（RP）' : '通用美音（GA）'))

const kindLabel: Record<IpaKind, string> = {
  plosive: '爆破',
  affricate: '破擦',
  fricative: '摩擦',
  nasal: '鼻音',
  approximant: '近音',
}

const vowelRows = [
  { title: '较合', detail: '嘴张得小' },
  { title: '半开', detail: '嘴张到一半' },
  { title: '较开', detail: '嘴张得大' },
]

const diphthongRows = computed(() => [
  { title: '滑向 ɪ', detail: '收到前面' },
  { title: '滑向 ʊ', detail: '收到后面' },
  accent.value === 'ga'
    ? { title: '加 r', detail: '元音后面读出' }
    : { title: '滑向 ə', detail: '收到中央' },
])

const consonantPlaces = [
  { title: '唇', detail: '双唇闭合，或上齿轻咬下唇' },
  { title: '舌尖', detail: '舌尖抵上齿或齿龈' },
  { title: '舌面', detail: '舌面靠近齿龈后方' },
  { title: '舌后', detail: '舌后部向上抬' },
]

const consonantRows = [
  { title: '堵住', detail: '爆破和破擦' },
  { title: '摩擦', detail: '窄缝里挤出' },
  { title: '鼻音', detail: '改从鼻子出' },
  { title: '近音', detail: '靠近但不摩擦' },
]

const vowelCount = IPA_MONOPHTHONGS.flat().length
const diphthongCount = IPA_DIPHTHONGS.flat().filter((phone) => phone).length
const consonantCount = IPA_CONSONANTS.flat().filter((phone) => phone).length
const clusterCount = IPA_CLUSTERS.length

const NOVELTY =
  /bad news|bahh|bells|boing|bubbles|cellos|good news|jester|junior|organ|superstar|trinoids|whisper|wobble|zarvox|albert|fred|ralph|grandma|grandpa/i

function voices() {
  return speechSynthesis.getVoices().filter((voice) => !NOVELTY.test(voice.name))
}

function pickVoice(lang: 'en-GB' | 'en-US') {
  const list = voices().filter((voice) =>
    voice.lang.toLowerCase().replace('_', '-').startsWith(lang.toLowerCase()),
  )
  if (lang === 'en-GB') return list.find((voice) => /daniel/i.test(voice.name)) ?? list[0]
  return list.find((voice) => /samantha|kathy|alex/i.test(voice.name)) ?? list[0]
}

let speakTimer = 0

const play = useThrottleFn(
  (phone: IpaPhone) => {
    if (playingId.value === phone.id) return
    const synth = window.speechSynthesis
    window.clearTimeout(speakTimer)
    const utterance = new SpeechSynthesisUtterance(phone.word)
    const lang = accent.value === 'rp' ? 'en-GB' : 'en-US'
    utterance.lang = lang
    const voice = pickVoice(lang)
    if (voice) utterance.voice = voice
    playingId.value = phone.id
    const clear = () => {
      if (playingId.value === phone.id) playingId.value = null
    }
    utterance.onend = clear
    utterance.onerror = clear
    const start = () => {
      if (playingId.value === phone.id) synth.speak(utterance)
    }
    // Chrome 会把紧挨着 cancel() 的 speak() 一起取消
    if (synth.speaking || synth.pending) {
      synth.cancel()
      speakTimer = window.setTimeout(start, 50)
    } else {
      start()
    }
  },
  600,
  false,
)

onMounted(() => {
  window.speechSynthesis.addEventListener('voiceschanged', voices)
  voices()
})

watch(accent, () => {
  window.clearTimeout(speakTimer)
  window.speechSynthesis.cancel()
  playingId.value = null
})

onBeforeUnmount(() => {
  window.clearTimeout(speakTimer)
  window.speechSynthesis.cancel()
  window.speechSynthesis.removeEventListener('voiceschanged', voices)
})
</script>

<template>
  <div class="ipa-chart not-prose">
    <div class="ipa-toolbar">
      <UTabs
        v-model="accent"
        :items="accentItems"
        :content="false"
        color="neutral"
        variant="pill"
        size="sm"
      />
      <p class="ipa-accent-note">{{ accentLabel }}</p>
    </div>

    <section class="ipa-block">
      <h2 class="ipa-block-title">单元音（{{ vowelCount }}）</h2>
      <div class="ipa-vowel-grid">
        <div class="ipa-axis ipa-corner">
          <p class="m-0 text-sm font-medium">口型</p>
        </div>
        <div class="ipa-head ipa-span-4">
          <p class="m-0 text-sm font-medium">嘴唇由展到圆</p>
        </div>
        <template v-for="(row, rowIndex) in IPA_MONOPHTHONGS" :key="vowelRows[rowIndex]!.title">
          <div class="ipa-axis">
            <p class="m-0 text-sm font-medium">{{ vowelRows[rowIndex]!.title }}</p>
            <p class="mt-0.5 mb-0 text-xs text-muted">{{ vowelRows[rowIndex]!.detail }}</p>
          </div>
          <IpaPhoneButton
            v-for="phone in row"
            :key="phone.id"
            :phone="phone"
            :accent="accent"
            :playing="playingId === phone.id"
            tag="单元音"
            class="ipa-kind-vowel"
            @play="play(phone)"
          />
        </template>
      </div>
    </section>

    <section class="ipa-block">
      <h2 class="ipa-block-title">双元音（{{ diphthongCount }}）</h2>
      <div class="ipa-diphthong-grid">
        <template v-for="(row, rowIndex) in IPA_DIPHTHONGS" :key="diphthongRows[rowIndex]!.title">
          <div class="ipa-axis">
            <p class="m-0 text-sm font-medium">{{ diphthongRows[rowIndex]!.title }}</p>
            <p class="mt-0.5 mb-0 text-xs text-muted">{{ diphthongRows[rowIndex]!.detail }}</p>
          </div>
          <template v-for="(phone, index) in row" :key="phone?.id ?? index">
            <IpaPhoneButton
              v-if="phone"
              :phone="phone"
              :accent="accent"
              :playing="playingId === phone.id"
              tag="双元音"
              class="ipa-kind-diphthong"
              @play="play(phone)"
            />
            <div v-else class="ipa-phone-slot" />
          </template>
        </template>
      </div>
    </section>

    <section class="ipa-block">
      <h2 class="ipa-block-title">辅音（{{ consonantCount }}）</h2>
      <div class="min-w-0 overflow-x-auto">
        <div class="ipa-consonant-grid">
          <div class="ipa-axis ipa-corner">
            <p class="m-0 text-sm font-medium">方式</p>
          </div>
          <div v-for="place in consonantPlaces" :key="place.title" class="ipa-place">
            <p class="m-0 text-sm font-medium">{{ place.title }}</p>
            <p class="mt-0.5 mb-0 text-xs leading-snug text-muted">{{ place.detail }}</p>
          </div>
          <template v-for="(row, rowIndex) in IPA_CONSONANTS" :key="consonantRows[rowIndex]!.title">
            <div class="ipa-axis">
              <p class="m-0 text-sm font-medium">{{ consonantRows[rowIndex]!.title }}</p>
              <p class="mt-0.5 mb-0 text-xs text-muted">{{ consonantRows[rowIndex]!.detail }}</p>
            </div>
            <template v-for="(phone, index) in row" :key="phone?.id ?? index">
              <IpaPhoneButton
                v-if="phone"
                :phone="phone"
                :accent="accent"
                :playing="playingId === phone.id"
                :tag="kindLabel[ipaKind(phone)!]"
                :class="IPA_KIND_CLASS[ipaKind(phone)!]"
                @play="play(phone)"
              />
              <div v-else />
            </template>
          </template>
        </div>
      </div>
    </section>

    <section class="ipa-block">
      <h2 class="ipa-block-title">组合辅音（{{ clusterCount }}）</h2>
      <div class="ipa-cluster-grid">
        <IpaPhoneButton
          v-for="phone in IPA_CLUSTERS"
          :key="phone.id"
          :phone="phone"
          :accent="accent"
          :playing="playingId === phone.id"
          :tag="kindLabel[ipaKind(phone)!]"
          :class="IPA_KIND_CLASS[ipaKind(phone)!]"
          @play="play(phone)"
        />
      </div>
    </section>
  </div>
</template>
