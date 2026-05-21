import { compareDevelopmentAgeOrder } from '../data/developmentAgeOrder.js'

const languageImitationItemIds = new Set([
  'pepR_014',
  'pepR_100',
  'pepR_102',
  'pepR_123',
  'pepR_124',
  'pepR_130',
])

const tableDomains = [
  {
    id: 'imitation',
    title: '1. 모방(언어모방+운동(행동)모방)',
  },
  {
    id: 'perception',
    title: '2. 지각',
  },
  {
    id: 'fineMotor',
    title: '3. 소근육 운동',
  },
  {
    id: 'grossMotor',
    title: '4. 대근육 운동',
  },
  {
    id: 'eyeHandCoordination',
    title: '5. 눈-손 협응',
  },
  {
    id: 'cognitivePerformance',
    title: '6. 동작성 인지',
  },
  {
    id: 'cognitiveVerbal',
    title: '7. 언어성 인지',
  },
]

const markerLabels = {
  pass: '○',
  emerging: '△',
  fail: 'X',
}

const lateralityItems = {
  pepR_007: '눈',
  pepR_046: '발',
  pepR_072: '손',
}

const sideLabels = {
  right: '오른쪽',
  left: '왼쪽',
  undetermined: '미정',
}

export function DevelopmentAgeTable({ assessmentItems, itemDetails, itemRatings }) {
  function printTableOnly() {
    const pageStyle = document.createElement('style')
    pageStyle.dataset.printAgeTablePage = 'true'
    pageStyle.textContent = '@page { size: A4 landscape; margin: 10mm; }'
    document.head.appendChild(pageStyle)
    document.body.classList.add('print-age-table-only')
    window.print()
    window.setTimeout(() => {
      document.body.classList.remove('print-age-table-only')
      pageStyle.remove()
    }, 0)
  }

  return (
    <section className="panel age-table-panel">
      <div className="panel-header">
        <h2>발달척도의 영역별 발달연령 순서표</h2>
        <button type="button" onClick={printTableOnly}>
          인쇄 / PDF 저장
        </button>
      </div>
      <div className="age-table-legend" aria-hidden="true">
        <span><i className="age-marker pass">○</i>합격</span>
        <span><i className="age-marker emerging">△</i>싹트기</span>
        <span><i className="age-marker fail">X</i>불합격</span>
      </div>
      <div className="age-domain-list">
        {tableDomains.map((domain) => (
          <AgeDomainTable
            assessmentItems={assessmentItems}
            domain={domain}
            itemDetails={itemDetails}
            itemRatings={itemRatings}
            key={domain.id}
          />
        ))}
      </div>
      <div className="age-print-pages" aria-hidden="true">
        {tableDomains.map((domain) => (
          <AgeDomainSvgPage
            assessmentItems={assessmentItems}
            domain={domain}
            itemDetails={itemDetails}
            itemRatings={itemRatings}
            key={domain.id}
          />
        ))}
      </div>
    </section>
  )
}

function AgeDomainTable({ assessmentItems, domain, itemDetails, itemRatings }) {
  const rows = assessmentItems
    .filter((item) => item.domainId === domain.id)
    .sort(compareDevelopmentAgeOrder)

  return (
    <section className="age-domain-table">
      <h3>{domain.title}</h3>
      <table>
        <thead>
          <tr>
            <th className="marker-column" aria-label="검사 결과"></th>
            <th>문항번호</th>
            <th>과제</th>
            <th>발달연령(개월)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => {
            const rating = itemRatings[item.id]

            return (
              <tr key={item.id} className={rating ? `age-row ${rating}` : 'age-row'}>
                <td className="marker-cell">
                  {rating && <span className={`age-marker ${rating}`}>{markerLabels[rating]}</span>}
                </td>
                <td className="number-cell">
                  {item.number}
                  {languageImitationItemIds.has(item.id) ? '(언어)' : ''}
                </td>
                <td>
                  {sentenceLabel(item.label)}
                  {lateralityItems[item.id] && (
                    <span className="age-side-note">
                      {lateralityItems[item.id]} 방향: {sideLabels[itemDetails[item.id]?.side] || '미입력'}
                    </span>
                  )}
                </td>
                <td className="month-cell">{item.developmentAge}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}

function sentenceLabel(label) {
  const trimmed = label.trim()

  return trimmed.endsWith('.') ? trimmed : `${trimmed}.`
}

function AgeDomainSvgPage({ assessmentItems, domain, itemDetails, itemRatings }) {
  const rows = assessmentItems
    .filter((item) => item.domainId === domain.id)
    .sort(compareDevelopmentAgeOrder)
  const width = 1120
  const height = 780
  const margin = 36
  const tableTop = 86
  const headerHeight = 30
  const rowHeight = (height - tableTop - headerHeight - 30) / rows.length
  const markerWidth = 44
  const numberWidth = 170
  const taskWidth = 620
  const monthWidth = width - margin * 2 - markerWidth - numberWidth - taskWidth
  const x0 = margin
  const x1 = x0 + markerWidth
  const x2 = x1 + numberWidth
  const x3 = x2 + taskWidth
  const x4 = x3 + monthWidth
  const rowFontSize = rows.length > 22 ? 11 : 14
  const taskLineHeight = rowFontSize + 2

  return (
    <svg className="age-print-page" viewBox={`0 0 ${width} ${height}`} role="img">
      <rect width={width} height={height} fill="#fff" />
      <text x={margin} y="42" fill="#111" fontSize="24" fontWeight="800">
        {domain.title}
      </text>
      <g fontSize="17" fontWeight="800">
        <text x={margin} y="70" fill="#111">○ 합격</text>
        <text x={margin + 95} y="70" fill="#115ad8">△ 싹트기</text>
        <text x={margin + 220} y="70" fill="#ed2b24">X 불합격</text>
      </g>

      <line x1={x0} x2={x4} y1={tableTop} y2={tableTop} stroke="#111" strokeWidth="1.4" />
      <line x1={x0} x2={x4} y1={tableTop + headerHeight} y2={tableTop + headerHeight} stroke="#111" strokeWidth="1.2" />
      {[x1, x2, x3].map((x) => (
        <line key={x} x1={x} x2={x} y1={tableTop} y2={height - 30} stroke="#111" strokeWidth="1.1" />
      ))}
      <g fill="#111" fontSize="14" fontWeight="800" textAnchor="middle">
        <text x={(x1 + x2) / 2} y={tableTop + 20}>문항번호</text>
        <text x={(x2 + x3) / 2} y={tableTop + 20}>과제</text>
        <text x={(x3 + x4) / 2} y={tableTop + 20}>발달연령(개월)</text>
      </g>

      {rows.map((item, index) => {
        const rating = itemRatings[item.id]
        const y = tableTop + headerHeight + rowHeight * index
        const centerY = y + rowHeight / 2
        const taskText = `${sentenceLabel(item.label)}${sideText(item, itemDetails)}`
        const lines = wrapText(taskText, rows.length > 22 ? 33 : 42).slice(0, 2)

        return (
          <g key={item.id}>
            <line x1={x0} x2={x4} y1={y + rowHeight} y2={y + rowHeight} stroke="#111" strokeWidth="0.9" />
            {rating && (
              <text
                x={(x0 + x1) / 2}
                y={centerY + rowFontSize / 2}
                fill={markerColor(rating)}
                fontSize={rows.length > 22 ? 23 : 28}
                fontWeight="800"
                textAnchor="middle"
              >
                {markerLabels[rating]}
              </text>
            )}
            <text x={(x1 + x2) / 2} y={centerY + rowFontSize / 2 - 1} fill="#111" fontSize={rowFontSize} textAnchor="middle">
              {item.number}
              {languageImitationItemIds.has(item.id) ? '(언어)' : ''}
            </text>
            <text x={x2 + 8} y={centerY - ((lines.length - 1) * taskLineHeight) / 2 + rowFontSize / 2 - 1} fill="#111" fontSize={rowFontSize}>
              {lines.map((line, lineIndex) => (
                <tspan x={x2 + 8} dy={lineIndex === 0 ? 0 : taskLineHeight} key={line}>
                  {line}
                </tspan>
              ))}
            </text>
            <text x={(x3 + x4) / 2} y={centerY + rowFontSize / 2 - 1} fill="#111" fontSize={rowFontSize} textAnchor="middle">
              {item.developmentAge}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function sideText(item, itemDetails) {
  if (!lateralityItems[item.id]) {
    return ''
  }

  return ` (${lateralityItems[item.id]} 방향: ${sideLabels[itemDetails[item.id]?.side] || '미입력'})`
}

function markerColor(rating) {
  if (rating === 'emerging') {
    return '#115ad8'
  }

  if (rating === 'fail') {
    return '#ed2b24'
  }

  return '#111'
}

function wrapText(text, maxLength) {
  const words = text.split(' ')
  const lines = []
  let current = ''

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word

    if (next.length > maxLength && current) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  })

  if (current) {
    lines.push(current)
  }

  return lines
}
