import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  flypyAlphabetCardBodyClass,
  flypyAlphabetCardCategoryClass,
  flypyAlphabetCardClass,
  flypyAlphabetCardFooterClass,
  flypyAlphabetCardHanziClass,
  flypyAlphabetCardHeadClass,
  flypyAlphabetCardPinyinClass,
  flypyAlphabetCardPinyinWrapClass,
  flypyAlphabetGridClass,
  flypyAlphabetSectionClass,
  flypyAlphabetSectionTitleClass,
  flypyAlphabetWrapClass,
  flypyBoardStyle,
} from './flypy-classes'
import type { PinyinAlphabetItem, PinyinAlphabetSection } from './flypy-alphabet-data'
import { FLYPY_PINYIN_ALPHABET } from './flypy-alphabet-data'

type FlypyAlphabetCardProps = {
  section: PinyinAlphabetSection
  item: PinyinAlphabetItem
  isActive: boolean
  isDimmed: boolean
  onHoverGroup: (groupKey: string) => void
}

function FlypyAlphabetCard({
  section,
  item,
  isActive,
  isDimmed,
  onHoverGroup,
}: FlypyAlphabetCardProps) {
  return (
    <article
      className={flypyAlphabetCardClass({
        active: isActive,
        dimmed: isDimmed,
      })}
      onMouseEnter={() => {
        if (item.groupKey) onHoverGroup(item.groupKey)
      }}
      title={item.category ? `${item.category} · ${item.hanzi}` : item.hanzi}
    >
      {item.category ? (
        <div className={flypyAlphabetCardHeadClass}>
          <span className={cn(flypyAlphabetCardCategoryClass, item.groupColor)}>
            {item.category}
          </span>
        </div>
      ) : null}
      <div className={flypyAlphabetCardBodyClass}>
        <div className={flypyAlphabetCardPinyinWrapClass}>
          <span className={flypyAlphabetCardPinyinClass(section.tone, item.groupColor)}>
            {item.pinyin}
          </span>
        </div>
        <div className={flypyAlphabetCardFooterClass}>
          <span className={flypyAlphabetCardHanziClass}>{item.hanzi}</span>
        </div>
      </div>
    </article>
  )
}

export function FlypyPinyinAlphabet() {
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null)

  return (
    <div className={flypyAlphabetWrapClass}>
      {FLYPY_PINYIN_ALPHABET.map(section => {
        const sectionActive = hoveredGroup?.startsWith(`${section.tone}:`) ?? false

        return (
          <section className={flypyAlphabetSectionClass(section.tone)} key={section.title}>
            <h3 className={flypyAlphabetSectionTitleClass(section.tone)}>{section.title}</h3>
            <div
              className={flypyAlphabetGridClass}
              onMouseLeave={() => setHoveredGroup(null)}
              style={flypyBoardStyle}
            >
              {section.items.map(item => (
                <FlypyAlphabetCard
                  isActive={!!item.groupKey && hoveredGroup === item.groupKey}
                  isDimmed={
                    !!item.groupKey && sectionActive && hoveredGroup !== item.groupKey
                  }
                  item={item}
                  key={`${section.tone}-${item.pinyin}`}
                  onHoverGroup={setHoveredGroup}
                  section={section}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

export default FlypyPinyinAlphabet
