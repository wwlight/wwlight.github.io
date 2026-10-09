export type FlypyKeyData = {
  key: string
  initial: string
  finals: string
}

export const FLYPY_ROWS: FlypyKeyData[][] = [
  [
    { key: 'Q', initial: 'q', finals: 'iu' },
    { key: 'W', initial: 'w', finals: 'ei' },
    { key: 'E', initial: 'e', finals: 'e' },
    { key: 'R', initial: 'r', finals: 'uan' },
    { key: 'T', initial: 't', finals: 'ue / üe' },
    { key: 'Y', initial: 'y', finals: 'un' },
    { key: 'U', initial: 'sh', finals: 'u' },
    { key: 'I', initial: 'ch', finals: 'i' },
    { key: 'O', initial: 'o', finals: 'uo / o' },
    { key: 'P', initial: 'p', finals: 'ie' },
  ],
  [
    { key: 'A', initial: 'a', finals: 'a' },
    { key: 'S', initial: 's', finals: 'iong / ong' },
    { key: 'D', initial: 'd', finals: 'ai' },
    { key: 'F', initial: 'f', finals: 'en' },
    { key: 'G', initial: 'g', finals: 'eng' },
    { key: 'H', initial: 'h', finals: 'ang' },
    { key: 'J', initial: 'j', finals: 'an' },
    { key: 'K', initial: 'k', finals: 'ing / uai' },
    { key: 'L', initial: 'l', finals: 'iang / uang' },
  ],
  [
    { key: 'Z', initial: 'z', finals: 'ou' },
    { key: 'X', initial: 'x', finals: 'ia / ua' },
    { key: 'C', initial: 'c', finals: 'ao' },
    { key: 'V', initial: 'zh', finals: 'ü / ui' },
    { key: 'B', initial: 'b', finals: 'in' },
    { key: 'N', initial: 'n', finals: 'iao' },
    { key: 'M', initial: 'm', finals: 'ian' },
  ],
]

export type MnemonicCharTone = 'orange' | 'green'
export type MnemonicFinalTone = 'blue' | 'green'

export type FlypyMnemonicKeyData = {
  key: string
  altInitial?: string
  mnemonicChars?: { char: string; tone?: MnemonicCharTone }[]
  finals: { text: string; tone?: MnemonicFinalTone }[]
}

export const FLYPY_MNEMONIC_ROWS: FlypyMnemonicKeyData[][] = [
  [
    { key: 'Q', mnemonicChars: [{ char: '秋' }], finals: [{ text: 'iu' }] },
    { key: 'W', mnemonicChars: [{ char: '闱' }], finals: [{ text: 'ei' }] },
    { key: 'E', finals: [{ text: 'e' }] },
    { key: 'R', mnemonicChars: [{ char: '软' }], finals: [{ text: 'uan' }] },
    {
      key: 'T',
      mnemonicChars: [{ char: '月', tone: 'green' }],
      finals: [
        { text: 'ue', tone: 'green' },
        { text: 'üe', tone: 'green' },
      ],
    },
    { key: 'Y', mnemonicChars: [{ char: '云' }], finals: [{ text: 'un' }] },
    { key: 'U', altInitial: 'sh', mnemonicChars: [{ char: '梳' }], finals: [{ text: 'u' }] },
    { key: 'I', altInitial: 'ch', mnemonicChars: [{ char: '翅' }], finals: [{ text: 'i' }] },
    { key: 'O', finals: [{ text: 'uo' }, { text: 'o' }] },
    { key: 'P', mnemonicChars: [{ char: '撇' }], finals: [{ text: 'ie' }] },
  ],
  [
    { key: 'A', finals: [{ text: 'a' }] },
    {
      key: 'S',
      mnemonicChars: [{ char: '怂' }, { char: '恿', tone: 'green' }],
      finals: [{ text: 'ong' }, { text: 'iong', tone: 'green' }],
    },
    { key: 'D', mnemonicChars: [{ char: '带' }], finals: [{ text: 'ai' }] },
    { key: 'F', mnemonicChars: [{ char: '粉' }], finals: [{ text: 'en' }] },
    { key: 'G', mnemonicChars: [{ char: '更' }], finals: [{ text: 'eng' }] },
    { key: 'H', mnemonicChars: [{ char: '航' }], finals: [{ text: 'ang' }] },
    {
      key: 'J',
      mnemonicChars: [{ char: '安', tone: 'green' }],
      finals: [{ text: 'an' }],
    },
    {
      key: 'K',
      mnemonicChars: [{ char: '快' }, { char: '迎', tone: 'green' }],
      finals: [{ text: 'uai' }, { text: 'ing', tone: 'green' }],
    },
    {
      key: 'L',
      mnemonicChars: [{ char: '两' }, { char: '王', tone: 'green' }],
      finals: [{ text: 'iang' }, { text: 'uang', tone: 'green' }],
    },
  ],
  [
    { key: 'Z', mnemonicChars: [{ char: '揍' }], finals: [{ text: 'ou' }] },
    {
      key: 'X',
      mnemonicChars: [{ char: '夏' }, { char: '蛙', tone: 'green' }],
      finals: [{ text: 'ia' }, { text: 'ua', tone: 'green' }],
    },
    { key: 'C', mnemonicChars: [{ char: '草' }], finals: [{ text: 'ao' }] },
    {
      key: 'V',
      altInitial: 'zh',
      mnemonicChars: [{ char: '追' }, { char: '鱼', tone: 'green' }],
      finals: [{ text: 'ui' }, { text: 'ü', tone: 'green' }],
    },
    { key: 'B', mnemonicChars: [{ char: '滨' }], finals: [{ text: 'in' }] },
    { key: 'N', mnemonicChars: [{ char: '鸟' }], finals: [{ text: 'iao' }] },
    { key: 'M', mnemonicChars: [{ char: '眠' }], finals: [{ text: 'ian' }] },
  ],
]

export type RadicalKind = 'phonetic' | 'non-phonetic' | 'special' | 'stroke'

export type GlyphCropId =
  | 'qi_top'
  | 'jian_xia'
  | 'shou_top'
  | 'dai_top'
  | 'yu_xia'
  | 'bi_left'
  | 'ji_left'

export type RadicalComponent = { type: 'text'; char: string } | { type: 'symbol'; id: GlyphCropId }

export type RadicalSegment = {
  components: RadicalComponent[]
  kind: RadicalKind
}

export type RadicalKeyData = {
  key: string
  corner?: RadicalSegment
  lines: RadicalSegment[][]
}

const t = (char: string): RadicalComponent => ({ type: 'text', char })
const sym = (id: GlyphCropId): RadicalComponent => ({ type: 'symbol', id })
const seg = (components: RadicalComponent[], kind: RadicalKind): RadicalSegment => ({
  components,
  kind,
})

export type GlyphCropDef = {
  id: GlyphCropId
  viewBox: string
  path?: string
  strokes?: string[]
}

export const GLYPH_CROPS: GlyphCropDef[] = [
  {
    id: 'qi_top',
    viewBox: '-25.78 -769.73 1049.55 777.44',
    path: 'M 143 -638 Q 173 -633 185 -633 L 185 -633 L 308 -641 L 306 -738 Q 306 -766 294 -781 L 294 -781 Q 290 -787 290 -789 L 290 -789 Q 290 -796 302.5 -796 Q 315 -796 336 -790 Q 357 -784 364 -777 Q 371 -770 371 -754 L 371 -754 L 373 -645 L 619 -657 L 621 -759 Q 621 -789 610 -803 L 610 -803 Q 606 -809 606 -811 L 606 -811 Q 606 -817 619 -817 Q 632 -817 653.5 -811 Q 675 -805 681.5 -797.5 Q 688 -790 688 -776 L 688 -776 L 688 -772 L 685 -661 L 734 -665 Q 767 -667 778.5 -670.5 Q 790 -674 800.5 -674 Q 811 -674 823.5 -665.5 Q 836 -657 843.5 -647 Q 851 -637 851 -631 L 851 -631 Q 851 -617 833 -615 L 833 -615 L 684 -605 L 675 -224 L 834 -231 Q 863 -233 876.5 -237 Q 890 -241 897.5 -241 Q 905 -241 918 -233 Q 931 -225 940.5 -214 Q 950 -203 950 -194 L 950 -194 Q 950 -179 934 -177 L 934 -177 L 145 -146 L 110 -145 Q 95 -145 79 -152 Q 63 -159 50 -196 L 50 -196 Q 48 -202 48 -205.5 Q 48 -209 53.5 -209 Q 59 -209 71.5 -206 Q 84 -203 107 -203 L 107 -203 L 118 -203 L 318 -211 L 310 -585 L 233 -580 Q 213 -578 193 -578 Q 173 -578 163.5 -586 Q 154 -594 145 -608.5 Q 136 -623 136 -630.5 Q 136 -638 143 -638 M 618 -602 L 374 -589 L 375 -502 L 617 -515 M 616 -461 L 376 -449 L 378 -362 L 615 -372 M 614 -319 L 379 -308 L 381 -214 L 612 -222',
  },
  {
    id: 'jian_xia',
    viewBox: '-48.70 -649.61 1061.39 786.22',
    path: 'M 502 -350 L 483 -276 Q 442 -149 332 -58 L 332 -58 Q 248 10 144 52 L 144 52 Q 102 69 75 76.5 Q 48 84 45 84 L 45 84 Q 33 84 33 74 L 33 74 Q 33 62 56 52 L 56 52 Q 237 -30 328 -139 L 328 -139 Q 391 -214 418 -303 L 418 -303 L 430 -351 Q 443 -406 445 -454.5 Q 447 -503 447 -532 L 447 -532 Q 447 -557 432 -580 L 432 -580 Q 428 -586 428 -591.5 Q 428 -597 440.5 -597 Q 453 -597 475 -590 Q 497 -583 509 -574 Q 521 -565 521 -550 L 521 -550 L 521 -546 Q 520 -510 516 -457.5 Q 512 -405 502 -350 M 583 -61 Q 583 -24 614.5 -15 Q 646 -6 714 -6 Q 782 -6 807 -11 Q 832 -16 843.5 -24 Q 855 -32 865.5 -57.5 Q 876 -83 896 -210 L 896 -210 Q 902 -253 913 -253 L 913 -253 Q 931 -253 931 -126 L 931 -126 Q 931 -66 923.5 -29.5 Q 916 7 893 26 Q 870 45 825.5 52 Q 781 59 724.5 59 Q 668 59 638 57 Q 608 55 580 46 L 580 46 Q 519 25 519 -47 L 519 -47 L 519 -52 L 527 -274 Q 527 -302 519 -312 Q 511 -322 511 -327 L 511 -327 Q 511 -335 523.5 -335 Q 536 -335 558 -329 Q 580 -323 585.5 -317 Q 591 -311 591 -298 L 591 -298 L 583 -64',
  },
  {
    id: 'shou_top',
    viewBox: '-15.88 68.81 852.84 631.74',
    path: 'M 258.37 533.04 L 258.37 533.04  L 258.37 533.04 Q 198.26 611.41 127.5 666.2  L 127.5 666.2 L 127.5 666.2  L 127.5 666.2 Q 90.22 694.35 82.99 694.35  L 82.99 694.35 Q 75.76 694.35 75.38 687.12  L 75.38 687.12 Q 75 679.89 103.15 654.02  L 103.15 654.02 L 103.15 654.02  L 103.15 654.02 Q 157.17 606.09 225.65 505.65  L 225.65 505.65 L 225.65 505.65  L 236.3 490.43 Q 263.7 449.35 279.67 415.11  L 279.67 415.11 L 279.67 415.11  L 279.67 415.11 L 113.8 423.48 Q 97.07 423.48 92.12 418.15  L 92.12 418.15 Q 87.17 412.83 81.47 401.41 Q 75.76 390 75.76 384.67  L 75.76 384.67 Q 75.76 379.35 78.8 379.35  L 78.8 379.35 L 78.8 379.35 Q 97.07 383.91 113.8 383.91 L 113.8 383.91 L 124.46 383.91 L 297.93 375.54  L 297.93 375.54 Q 309.35 347.39 318.48 318.48  L 318.48 318.48 L 318.48 318.48  L 318.48 318.48 L 257.61 321.52 Q 252.28 322.28 247.72 322.28  L 247.72 322.28 L 247.72 322.28  L 247.72 322.28 L 239.35 322.28  L 239.35 322.28 Q 222.61 322.28 211.96 308.97  L 211.96 308.97 Q 201.3 295.65 201.3 284.24  L 201.3 284.24 L 201.3 284.24  L 201.3 284.24 Q 201.3 281.2 205.11 281.2  L 205.11 281.2 L 205.11 281.2 L 207.39 281.2 Q 220.33 283.48 235.54 283.48 L 235.54 283.48 L 246.96 283.48 L 330.65 278.91  L 330.65 278.91 L 341.3 238.59 Q 343.59 230.22 345.11 221.85  L 345.11 221.85 L 345.11 221.85  L 345.11 221.85 L 218.04 230.22 Q 213.48 230.98 209.67 230.98  L 209.67 230.98 L 209.67 230.98  L 209.67 230.98 L 195.98 230.98 Q 186.09 230.98 181.14 225.65 Q 176.2 220.33 173.15 216.52  L 173.15 216.52 L 173.15 216.52  L 173.15 216.52 Q 162.5 199.02 162.5 193.7  L 162.5 193.7 Q 162.5 188.37 166.3 188.37  L 166.3 188.37 L 166.3 188.37 L 168.59 188.37 Q 183.8 191.41 199.78 191.41 L 199.78 191.41 L 209.67 191.41 L 353.48 181.52  L 353.48 181.52 Q 361.09 142.72 360.33 126.36 Q 359.57 110 354.62 97.83 Q 349.67 85.65 349.67 82.61  L 349.67 82.61 L 349.67 82.61  L 349.67 82.61 Q 349.67 75 358.04 75  L 358.04 75 Q 366.41 75 381.63 79.57 L 381.63 79.57  L 381.63 79.57 Q 421.2 90.22 421.96 107.72  L 421.96 107.72 L 421.96 107.72  L 421.96 107.72 L 422.72 110 Q 417.39 145 411.3 177.72  L 411.3 177.72 L 411.3 177.72 L 576.41 167.07  L 576.41 167.07 Q 596.2 166.3 604.95 163.26 Q 613.7 160.22 617.88 160.22  L 617.88 160.22 Q 622.07 160.22 631.2 166.3 L 631.2 166.3  L 631.2 166.3 Q 653.26 182.28 653.26 194.46  L 653.26 194.46 L 653.26 194.46  L 653.26 194.46 Q 653.26 201.3 638.8 202.83  L 638.8 202.83 L 638.8 202.83  L 638.8 202.83 L 402.17 218.04  L 402.17 218.04 Q 399.89 227.93 397.61 237.07  L 397.61 237.07 L 397.61 237.07  L 397.61 237.07 L 386.96 275.11  L 386.96 275.11 L 539.13 266.74 Q 562.72 265.22 569.95 262.55 Q 577.17 259.89 583.26 259.89  L 583.26 259.89 Q 589.35 259.89 597.72 266.74 Q 606.09 273.59 612.17 281.96 Q 618.26 290.33 618.26 294.13  L 618.26 294.13 L 618.26 294.13  L 618.26 294.13 Q 618.26 300.98 601.52 302.5  L 601.52 302.5 L 601.52 302.5  L 601.52 302.5 L 374.78 314.67  L 374.78 314.67 Q 364.13 345.11 352.72 372.5  L 352.72 372.5 L 352.72 372.5  L 352.72 372.5 L 665.43 357.28  L 665.43 357.28 Q 681.41 356.52 694.35 352.72 Q 707.28 348.91 710.71 348.91  L 710.71 348.91 Q 714.13 348.91 722.5 355 L 722.5 355  L 722.5 355 Q 746.09 370.98 746.09 383.15  L 746.09 383.15 L 746.09 383.15  L 746.09 383.15 Q 746.09 392.28 729.35 393.8  L 729.35 393.8 L 729.35 393.8  L 729.35 393.8 L 332.17 412.83  L 332.17 412.83 L 302.5 469.13 Q 294.89 481.3 287.28 492.72  L 287.28 492.72 L 287.28 492.72  L 258.37 533.04 Z',
  },
  {
    id: 'dai_top',
    viewBox: '67.62 -964.96 858.94 636.24',
    path: 'M 472.98 -479.67 L 466.17 -482.39 L 463 -489 L 463 -619 L 329 -611 L 343.93 -502.74 L 337.75 -489.53 L 321.19 -487.37 L 291.74 -496.64 L 277.84 -510.53 L 277.68 -559 L 270 -608 L 176.37 -602.02 L 144.84 -604.69 L 119.13 -625.01 L 107.23 -657.56 L 162.88 -651 L 261 -657 L 246.21 -730.82 L 221.21 -771.09 L 223.73 -778.97 L 234.84 -781.97 L 280.1 -776.51 L 301.63 -764.65 L 321 -661 L 463 -670 L 462.37 -767.84 L 448.01 -805.76 L 454.7 -811.98 L 500.82 -803.22 L 523.25 -787.38 L 524 -673 L 679 -683 L 690 -756 L 688.46 -783.61 L 679.01 -809.77 L 686.76 -814 L 734.5 -798.57 L 761.38 -775.5 L 760 -753.12 L 742 -687 L 841.79 -700.89 L 867.58 -684.48 L 885.39 -663.96 L 886.94 -649.82 L 873.55 -642.78 L 726 -634 L 680.86 -523.72 L 668.26 -503.72 L 656.66 -496.07 L 645.53 -501.85 L 644.54 -522.55 L 669 -630 L 524 -622 L 523.05 -491.83 L 520.34 -485.5 L 513.02 -482.33 Z',
  },
  {
    id: 'yu_xia',
    viewBox: '8.47 -556.63 948.07 702.27',
    path: 'M 842 -307 Q 842 -294 822 -292 L 822 -292 L 819 -292 L 531 -278 L 529 9 L 531 49 Q 531 81 513.5 91 Q 496 101 483 101 Q 470 101 434.5 85 Q 399 69 348.5 32.5 Q 298 -4 298 -15 L 298 -15 Q 298 -23 308.5 -23 Q 319 -23 358.5 -7 Q 398 9 466 27 L 466 27 L 468 -275 L 235 -263 L 214 -262 Q 201 -262 188 -268.5 Q 175 -275 162 -309 L 162 -309 Q 160 -315 160 -319.5 Q 160 -324 165 -324 Q 170 -324 178.5 -321.5 Q 187 -319 205 -319 L 205 -319 L 217 -319 L 468 -330 L 469 -442 L 389 -437 L 368 -436 Q 358 -436 343 -442 Q 328 -448 316 -479 L 316 -479 Q 314 -485 314 -489.5 Q 314 -494 319 -494 Q 324 -494 332.5 -491.5 Q 341 -489 359 -489 L 359 -489 L 371 -489 L 591 -503 Q 611 -504 621.5 -508 Q 632 -512 638.5 -512 Q 645 -512 657 -505 Q 669 -498 678.5 -487.5 Q 688 -477 688 -469 L 688 -469 Q 688 -455 665 -453 L 665 -453 L 532 -445 L 531 -333 L 744 -343 Q 765 -344 775.5 -348 Q 786 -352 793 -352 Q 800 -352 821 -337 Q 842 -322 842 -307 M 236 -108 Q 291 -173 299 -210 L 299 -210 Q 302 -225 311 -225 L 311 -225 Q 314 -225 328 -217 L 328 -217 Q 367 -195 367 -172 L 367 -172 Q 367 -166 363 -162 L 363 -162 Q 308 -94 253 -50 Q 198 -6 159 14.5 Q 120 35 112.5 35 Q 105 35 105 27 Q 105 19 145 -16 Q 185 -51 236 -108 M 802 6 Q 726 -82 628 -167 L 628 -167 Q 615 -177 615 -188 Q 615 -199 626.5 -209.5 Q 638 -220 644.5 -220 Q 651 -220 677 -201 Q 703 -182 764 -127 Q 825 -72 842.5 -53.5 Q 860 -35 860 -23.5 Q 860 -12 845.5 3.5 Q 831 19 823 19 Q 815 19 802 6',
  },
  {
    id: 'bi_left',
    viewBox: '-321.92 -795.17 1220.84 904.33',
    path: 'M 204 -677 Q 204 -705 187 -728 L 187 -728 Q 182 -736 182 -741 Q 182 -746 195 -746 Q 208 -746 232 -738 L 232 -738 Q 268 -727 268 -707 L 268 -707 L 267 -442 L 376 -447 Q 406 -450 417 -454 Q 428 -458 437.5 -458 Q 447 -458 459 -448 Q 471 -438 479.5 -426 Q 488 -414 488 -408 L 488 -408 Q 488 -395 461 -393 L 461 -393 L 267 -383 L 266 -67 Q 386 -124 457 -168 L 457 -168 Q 476 -180 487 -180 Q 498 -180 498 -173 L 498 -173 Q 498 -155 440 -114 L 440 -114 Q 347 -47 276.5 -6 Q 206 35 180 47.5 Q 154 60 144 60 Q 134 60 121.5 53.5 Q 109 47 94 30.5 Q 79 14 79 7 Q 79 0 107 -3.5 Q 135 -7 203 -39 L 203 -39',
  },
  {
    id: 'ji_left',
    viewBox: '-277.71 -794.32 1125.43 833.65',
    path: 'M 126 -743 Q 126 -749 136.5 -749 Q 147 -749 200 -720 L 200 -720 L 430 -738 Q 435 -739 440 -739 L 440 -739 L 448 -739 Q 467 -739 480 -727.5 Q 493 -716 493 -707.5 Q 493 -699 488 -692 Q 483 -685 482 -677 L 482 -677 L 453 -408 Q 481 -376 481 -367.5 Q 481 -359 473.5 -358 Q 466 -357 455 -356 L 455 -356 L 201 -346 L 202 -107 Q 272 -136 369 -188 L 369 -188 Q 345 -225 326.5 -249 Q 308 -273 308 -280 Q 308 -287 320 -298 Q 332 -309 341.5 -309 Q 351 -309 361 -296 L 361 -296 Q 404 -243 461 -158.5 Q 518 -74 518 -62.5 Q 518 -51 502.5 -38.5 Q 487 -26 475 -26 Q 463 -26 456 -40 L 456 -40 Q 427 -97 395 -147 L 395 -147 Q 265 -66 189 -36 Q 113 -6 105 -6 Q 97 -6 84.5 -14.5 Q 72 -23 62 -36 Q 52 -49 52 -60 L 52 -60 Q 52 -64 66 -65.5 Q 80 -67 96 -71.5 Q 112 -76 127 -80 L 127 -80 L 142 -85 L 140 -646 Q 140 -698 127 -737 L 127 -737 Q 126 -740 126 -743 M 421 -684 L 199 -670 L 200 -564 L 412 -576 M 408 -525 L 200 -513 L 200 -397 L 398 -405',
  },
]

export const FLYPY_RADICAL_ROWS: RadicalKeyData[][] = [
  [
    {
      key: 'Q',
      lines: [
        [seg([t('犭'), t('求')], 'phonetic')],
        [seg([t('且')], 'non-phonetic'), seg([sym('qi_top')], 'non-phonetic')],
      ],
    },
    {
      key: 'W',
      lines: [[seg([t('亠'), t('文')], 'phonetic')], [seg([t('夂'), t('攵')], 'phonetic')]],
    },
    {
      key: 'E',
      lines: [
        [seg([t('阝'), t('卩')], 'phonetic')],
        [seg([sym('jian_xia')], 'phonetic'), seg([t('彐'), t('山')], 'non-phonetic')],
      ],
    },
    { key: 'R', lines: [[seg([t('亻')], 'phonetic')]] },
    { key: 'T', lines: [[seg([t('田')], 'phonetic')]] },
    {
      key: 'Y',
      lines: [
        [seg([t('讠'), t('𧘇')], 'phonetic')],
        [seg([t('⺷'), t('⺶'), t('羊')], 'phonetic')],
      ],
    },
    {
      key: 'U',
      lines: [
        [seg([t('饣'), t('龵'), t('𠂇')], 'phonetic')],
        [seg([t('氺'), t('石')], 'phonetic')],
      ],
    },
    {
      key: 'I',
      lines: [[seg([t('彳'), t('亍')], 'phonetic')], [seg([t('虫')], 'phonetic')]],
    },
    {
      key: 'O',
      lines: [[seg([t('日')], 'special')], [seg([t('月'), t('目')], 'phonetic')]],
    },
    {
      key: 'P',
      corner: seg([t('撇'), t('丿')], 'stroke'),
      lines: [[seg([t('礻'), t('衤')], 'non-phonetic')]],
    },
  ],
  [
    {
      key: 'A',
      corner: seg([t('横'), t('一')], 'stroke'),
      lines: [[seg([t('鱼')], 'non-phonetic')]],
    },
    {
      key: 'S',
      lines: [[seg([t('纟'), t('厶')], 'phonetic')], [seg([t('龴'), t('罒')], 'phonetic')]],
    },
    {
      key: 'D',
      corner: seg([t('点'), t('丶')], 'stroke'),
      lines: [[seg([t('冫'), t('氵')], 'phonetic')], [seg([t('⺈'), t('刂')], 'phonetic')]],
    },
    {
      key: 'F',
      lines: [
        [seg([sym('shou_top'), sym('dai_top'), t('龶')], 'phonetic')],
        [seg([t('扌'), t('缶')], 'phonetic')],
      ],
    },
    {
      key: 'G',
      lines: [
        [seg([sym('ji_left'), t('艮')], 'phonetic')],
        [seg([t('鬼'), t('革'), t('骨')], 'phonetic')],
      ],
    },
    {
      key: 'H',
      lines: [[seg([t('灬'), t('虍')], 'phonetic')], [seg([sym('yu_xia'), t('黑')], 'phonetic')]],
    },
    {
      key: 'J',
      lines: [[seg([t('钅'), t('龹')], 'phonetic')], [seg([t('金')], 'phonetic')]],
    },
    {
      key: 'K',
      lines: [
        [seg([t('匚'), t('冂'), t('凵')], 'special')],
        [seg([t('口')], 'special'), seg([t('㠯')], 'phonetic')],
      ],
    },
    {
      key: 'L',
      corner: seg([t('竖'), t('丨')], 'stroke'),
      lines: [[seg([t('耂'), t('立'), t('龙')], 'phonetic')]],
    },
  ],
  [
    {
      key: 'Z',
      lines: [[seg([t('辶'), t('廴')], 'special')], [seg([t('⻊')], 'phonetic')]],
    },
    {
      key: 'X',
      lines: [
        [seg([t('⺍'), t('⺌'), t('⺗')], 'phonetic')],
        [seg([t('忄')], 'phonetic'), seg([t('乂')], 'non-phonetic')],
      ],
    },
    { key: 'C', lines: [[seg([t('艹'), t('廾')], 'phonetic')]] },
    {
      key: 'V',
      corner: seg([t('折'), t('乛')], 'stroke'),
      lines: [[seg([t('⺮'), t('豸')], 'phonetic')]],
    },
    {
      key: 'B',
      lines: [
        [seg([t('冖'), t('宀'), t('丷')], 'phonetic')],
        [seg([sym('bi_left'), t('疒')], 'phonetic'), seg([t('勹')], 'special')],
      ],
    },
    {
      key: 'N',
      corner: seg([t('捺'), t('乀')], 'stroke'),
      lines: [[seg([t('⺧'), t('牜')], 'phonetic')]],
    },
    { key: 'M', lines: [[seg([t('朩')], 'phonetic')]] },
  ],
]

export const FLYPY_SMALL_CHARS: { key: string; chars: string }[] = [
  { key: 'a', chars: '凹' },
  { key: 'b', chars: '百白八卜匕卞不巴本必丙半办' },
  { key: 'c', chars: '寸才匆册' },
  { key: 'd', chars: '大丁刀歹习东丹电氏' },
  { key: 'e', chars: '二耳儿而' },
  { key: 'f', chars: '非方飞夫凡甫弗乏丰' },
  { key: 'g', chars: '广弓戈工瓜干个甘丐果更夬' },
  { key: 'h', chars: '禾户互乎火' },
  { key: 'i', chars: '川厂车长叉尺丑臣成垂斥串产出' },
  { key: 'j', chars: '巾几九斤久巨己井及夹甲臼韭戋柬击' },
  { key: 'k', chars: '口开亏' },
  { key: 'l', chars: '了力乐来良两里吏耒卵丽' },
  { key: 'm', chars: '木毛米门马皿末灭母民么面' },
  { key: 'n', chars: '廿女牛鸟乃内农年' },
  { key: 'p', chars: '片平爿' },
  { key: 'q', chars: '七千犬丘曲且气乞' },
  { key: 'r', chars: '人入冉壬刃' },
  { key: 's', chars: '三巳肃' },
  { key: 't', chars: '土天太屯' },
  { key: 'u', chars: '十尸士手身水上少术失生世申史升事书束勺戊豕氏矢' },
  { key: 'v', chars: '止爪主舟之正丈中专朱州重乍' },
  { key: 'w', chars: '王瓦五无万午卫亡未乌韦勿为戊戌我丸兀' },
  { key: 'x', chars: '小西心血下夕乡成习' },
  { key: 'y', chars: '又酉已于义与天玉牙丫永尤也业由央亚严用幺禺臾尹禹吏弋聿雨曳' },
  { key: 'z', chars: '再自子' },
]

/** 小字字根拼音标注：易混读音 + 生僻字 */
export const FLYPY_SMALL_CHAR_PINYIN: Record<string, string> = {
  卞: 'biàn',
  甫: 'fǔ',
  弗: 'fú',
  丐: 'gài',
  夬: 'guài',
  臼: 'jiù',
  戋: 'jiān',
  耒: 'lěi',
  皿: 'mǐn',
  廿: 'niàn',
  爿: 'pán',
  冉: 'rǎn',
  巳: 'sì',
  矢: 'shǐ',
  豕: 'shǐ',
  戊: 'wù',
  戌: 'xū',
  乍: 'zhà',
  兀: 'wù',
  禺: 'yú',
  臾: 'yú',
  弋: 'yì',
  聿: 'yù',
  曳: 'yè',
}
