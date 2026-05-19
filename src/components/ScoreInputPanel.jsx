import { ratingOptions } from '../data/assessmentItems.js'

const sideItems = {
  pepR_007: '눈',
  pepR_046: '발',
  pepR_072: '손',
}

const sideOptions = [
  { value: 'right', label: '오른쪽' },
  { value: 'left', label: '왼쪽' },
  { value: 'undetermined', label: '미정' },
]

export function ScoreInputPanel({
  assessmentItems,
  itemDetails,
  itemRatings,
  onChange,
  onDetailChange,
}) {
  const sortedItems = [...assessmentItems].sort((a, b) => a.number - b.number)
  const checkedCount = sortedItems.filter((item) => itemRatings[item.id]).length
  const shortcutValues = {
    1: 'pass',
    2: 'emerging',
    3: 'fail',
  }
  const sideShortcutValues = {
    4: 'right',
    5: 'left',
    6: 'undetermined',
  }

  function handleItemKeyDown(event, itemId) {
    const ratingValue = shortcutValues[event.key]
    const sideValue = sideShortcutValues[event.key]

    if (ratingValue) {
      event.preventDefault()
      onChange(itemId, ratingValue)
      return
    }

    if (sideValue && sideItems[itemId]) {
      event.preventDefault()
      onDetailChange(itemId, 'side', sideValue)
    }
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>검사 항목 체크</h2>
        <p className="panel-count">
          {checkedCount} / {sortedItems.length}
        </p>
      </div>
      <div className="item-list">
        {sortedItems.map((item) => (
          <div
            className={itemRatings[item.id] ? 'item-row checked' : 'item-row'}
            key={item.id}
            tabIndex="0"
            onKeyDown={(event) => handleItemKeyDown(event, item.id)}
          >
            <div className="item-main">
              <span className="item-number">#{item.number}</span>
              <span className="item-label">{item.label}</span>
              <span className="domain-badge">{item.domain}</span>
            </div>
            <div className="rating-group" role="radiogroup" aria-label={`${item.number}번 ${item.label}`}>
              {ratingOptions.map((option) => (
                <label className="rating-option" key={option.value}>
                  <input
                    type="radio"
                    name={item.id}
                    value={option.value}
                    tabIndex="-1"
                    checked={itemRatings[item.id] === option.value}
                    onChange={(event) => onChange(item.id, event.target.value)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
            {sideItems[item.id] && (
              <div className="side-input">
                <span>{sideItems[item.id]} 방향</span>
                <div className="side-options" role="radiogroup" aria-label={`${sideItems[item.id]} 방향`}>
                  {sideOptions.map((option) => (
                    <label className="side-option" key={option.value}>
                      <input
                        type="radio"
                        name={`${item.id}-side`}
                        value={option.value}
                        tabIndex="-1"
                        checked={itemDetails[item.id]?.side === option.value}
                        onChange={(event) => onDetailChange(item.id, 'side', event.target.value)}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
