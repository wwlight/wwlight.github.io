import type { IpaKind } from './ipa-data'

export const IPA_KIND_CLASS: Record<IpaKind, string> = {
  plosive: 'ipa-kind-plosive',
  affricate: 'ipa-kind-affricate',
  fricative: 'ipa-kind-fricative',
  nasal: 'ipa-kind-nasal',
  approximant: 'ipa-kind-approximant',
}
