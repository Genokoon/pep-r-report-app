import { useRef } from 'react'
import { assessmentItems } from '../data/assessmentItems.js'
import { graphReferenceScores } from '../data/graphScoreMonths.js'
import { scoreToMonth } from '../data/scoreToMonths.js'

export function ScoreChart({ childInfo, domainScores, totalProfile, lifeAgeMonths }) {
  const chartRef = useRef(null)
  const chartDomains = totalProfile ? [...domainScores, totalProfile] : domainScores
  const width = 1160
  const height = 1380
  const padding = { top: 226, right: 180, bottom: 118, left: 78 }
  const ageAxisLeftX = padding.left
  const ageAxisRightX = width - padding.right
  const ageNoteEndX = width - 24
  const ageNoteLabelX = ageAxisRightX + 30
  const domainLeftX = ageAxisLeftX + 112
  const domainRightX = ageAxisRightX - 112
  const plotWidth = domainRightX - domainLeftX
  const plotHeight = height - padding.top - padding.bottom
  const yMax = 84
  const lifeAgeLineMaxMonth = 84
  const ticks = Array.from({ length: Math.floor(yMax / 12) + 1 }, (_, index) => index * 12)
  const minorTicks = Array.from({ length: yMax + 1 }, (_, index) => index)
  const childName = childInfo?.name?.trim() || ''
  const institution = childInfo?.institution?.trim() || ''
  const lifeAgeYears = lifeAgeMonths === null ? '' : Math.floor(lifeAgeMonths / 12)
  const lifeAgeRemainingMonths = lifeAgeMonths === null ? '' : lifeAgeMonths % 12

  function xForIndex(index) {
    return (
      domainLeftX +
      (chartDomains.length === 1 ? plotWidth / 2 : (plotWidth / (chartDomains.length - 1)) * index)
    )
  }

  function yForMonth(month) {
    return padding.top + plotHeight - (Math.min(month, yMax) / yMax) * plotHeight
  }

  function pointFor(domain, index, monthType) {
    return {
      x: xForIndex(index),
      y: yForMonth(domain[monthType]),
    }
  }

  function linePath(monthType) {
    return chartDomains
      .filter((domain) => monthType !== 'projectedMonth' || domain.id !== 'developmentTotal')
      .map((domain, index) => {
        const point = pointFor(domain, index, monthType)
        return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
      })
      .join(' ')
  }

  function referenceScoresFor(domain) {
    const referenceDomainId = domain.id === 'developmentTotal' ? 'developmentTotal' : domain.id
    const graphScores = graphReferenceScores(referenceDomainId)

    if (graphScores.length) {
      return graphScores
    }

    return Array.from({ length: domain.itemCount }, (_, index) => index + 1)
  }

  function referenceMonthFor(domain, score) {
    return scoreToMonth(
      domain.id === 'developmentTotal' ? null : domain.id,
      score,
      assessmentItems,
    )
  }

  function hasReferenceScore(domain, score) {
    return referenceScoresFor(domain).includes(Number(score))
  }

  function splitDomainName(name) {
    return name
      .replace(' 운동', '\n운동')
      .replace(' 인지', '\n인지')
      .replace('발달 총점', '발달\n총점')
      .split('\n')
  }

  const lifeAgeY = lifeAgeMonths === null ? null : yForMonth(Math.min(lifeAgeMonths, lifeAgeLineMaxMonth))

  function printChartOnly() {
    const pageStyle = document.createElement('style')
    pageStyle.id = 'print-chart-page-style'
    pageStyle.textContent = '@page { size: A4 portrait; margin: 8mm; }'
    document.head.appendChild(pageStyle)
    document.body.classList.add('print-chart-only')
    window.print()
    window.setTimeout(() => {
      document.body.classList.remove('print-chart-only')
      pageStyle.remove()
    }, 0)
  }

  function downloadChartImage() {
    if (!chartRef.current) {
      return
    }

    const svg = chartRef.current.cloneNode(true)
    const style = document.createElement('style')
    style.textContent = `
      .profile-chart { background: #fff; }
      .age-grid-line { stroke: #eef2f3; stroke-width: 1; }
      .age-tick { stroke: #243036; stroke-width: 1.6; }
      .age-minor-tick { stroke: #243036; stroke-width: 0.7; }
      .age-minor-tick.medium { stroke-width: 1; }
      .age-ruler { stroke: #243036; stroke-width: 1.8; }
      .chart-title, .chart-info-label, .chart-info-value, .axis-title, .age-month-label, .age-year-label, .domain-label, .reference-score-label, .point-label, .emerging-count, .emerging-label { fill: #243036; font-family: Arial, sans-serif; font-weight: 800; }
      .chart-title { font-size: 24px; font-weight: 900; }
      .chart-info-label, .chart-info-value { font-size: 16px; }
      .chart-info-line { stroke: #243036; stroke-width: 1.5; }
      .axis-title, .age-month-label, .age-year-label { font-size: 12px; }
      .domain-label { font-size: 11px; font-weight: 900; }
      .top-domain-label { font-size: 12px; }
      .bottom-domain-label, .emerging-label { fill: #66757f; }
      .domain-guide { stroke: #20262a; stroke-width: 1.6; }
      .life-age-line { stroke: #20262a; stroke-width: 2.5; }
      .life-age-label { fill: #20262a; font-size: 13px; font-weight: 800; }
      .score-line { fill: none; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
      .mastered-line { stroke: #2b6f77; }
      .emerging-line { stroke: #b76645; stroke-dasharray: 10 8; }
      .reference-marker, .emerging-box { fill: #fff; stroke: #20262a; stroke-width: 1.3; }
      .score-point { stroke: #fff; stroke-width: 2; }
      .mastered-line, .line-chart .development-age-line { stroke: #b3262e; }
      .line-chart .development-age-line { stroke-width: 3; }
      .emerging-line { stroke: #1f4f9a; stroke-dasharray: 10 8; }
      .mastered-point { fill: #b3262e; }
      .emerging-point { fill: #1f4f9a; }
      .development-age-label { fill: #b3262e; font-size: 13px; font-weight: 900; }
    `
    svg.insertBefore(style, svg.firstChild)

    const serialized = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([serialized], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    const image = new Image()

    image.onload = () => {
      const scale = 2
      const canvas = document.createElement('canvas')
      canvas.width = width * scale
      canvas.height = height * scale
      const context = canvas.getContext('2d')

      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)

      const link = document.createElement('a')
      link.download = 'pep-r-development-chart.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    }

    image.src = url
  }

  return (
    <section className="panel chart-panel">
      <div className="panel-header">
        <h2>심리교육 프로파일 발달척도 결과표</h2>
        <div className="panel-actions">
          <button type="button" onClick={downloadChartImage}>
            이미지 저장
          </button>
          <button type="button" onClick={printChartOnly}>
            인쇄 / PDF 저장
          </button>
        </div>
      </div>
      <div className="chart-legend" aria-hidden="true">
        <span><i className="legend-mastered"></i>정상 반응</span>
        <span><i className="legend-emerging"></i>싹트기 반응</span>
        <span><i className="legend-age"></i>생활연령</span>
      </div>
      <div className="line-chart-wrap">
        <svg
          ref={chartRef}
          className="line-chart profile-chart"
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="PEP-R 발달척도 결과표 형태의 영역별 발달 월령 그래프"
        >
          <text className="chart-title" x={width / 2} y="46" textAnchor="middle">
            심리교육 프로파일 발달척도 결과표
          </text>

          <g className="chart-info">
            <text className="chart-info-label" x="96" y="86">이름 :</text>
            <line className="chart-info-line" x1="150" x2="540" y1="92" y2="92" />
            <text className="chart-info-value" x="166" y="84">{childName}</text>

            <text className="chart-info-label" x="610" y="86">소속 :</text>
            <line className="chart-info-line" x1="664" x2="1030" y1="92" y2="92" />
            <text className="chart-info-value" x="680" y="84">{institution}</text>

            <text className="chart-info-label" x="96" y="124">연령 :</text>
            <line className="chart-info-line" x1="150" x2="260" y1="130" y2="130" />
            <text className="chart-info-value" x="202" y="122" textAnchor="middle">{lifeAgeYears}</text>
            <text className="chart-info-label" x="278" y="124">세</text>
            <line className="chart-info-line" x1="326" x2="466" y1="130" y2="130" />
            <text className="chart-info-value" x="396" y="122" textAnchor="middle">{lifeAgeRemainingMonths}</text>
            <text className="chart-info-label" x="484" y="124">개월</text>
            <text className="chart-info-label" x="540" y="124">(</text>
            <line className="chart-info-line" x1="558" x2="680" y1="130" y2="130" />
            <text className="chart-info-value" x="619" y="122" textAnchor="middle">
              {lifeAgeMonths !== null ? lifeAgeMonths : ''}
            </text>
            <text className="chart-info-label" x="698" y="124">개월)</text>
          </g>

          {ticks.map((tick) => {
            const y = yForMonth(tick)

            return (
              <g key={tick}>
                <line className="age-grid-line" x1={ageAxisLeftX} x2={ageAxisRightX} y1={y} y2={y} />
                <line className="age-tick" x1={ageAxisLeftX - 14} x2={ageAxisLeftX + 14} y1={y} y2={y} />
                <line className="age-tick" x1={ageAxisRightX - 14} x2={ageAxisRightX + 14} y1={y} y2={y} />
                <text className="age-month-label" x={ageAxisLeftX - 20} y={y + 4} textAnchor="end">
                  {tick}
                </text>
                <text className="age-month-label" x={ageAxisRightX + 20} y={y + 4}>
                  {tick}
                </text>
                {tick > 0 && (
                  <>
                    <text className="age-year-label" x={ageAxisLeftX - 54} y={y + 4} textAnchor="middle">
                      {tick / 12}
                    </text>
                    <text className="age-year-label" x={ageAxisRightX + 54} y={y + 4} textAnchor="middle">
                      {tick / 12}
                    </text>
                  </>
                )}
              </g>
            )
          })}

          {minorTicks.map((tick) => {
            if (tick % 12 === 0) {
              return null
            }

            const y = yForMonth(tick)

            return (
              <g key={`minor-${tick}`}>
                <line
                  className={tick % 6 === 0 ? 'age-minor-tick medium' : 'age-minor-tick'}
                  x1={ageAxisLeftX - (tick % 6 === 0 ? 10 : 6)}
                  x2={ageAxisLeftX + (tick % 6 === 0 ? 10 : 6)}
                  y1={y}
                  y2={y}
                />
                <line
                  className={tick % 6 === 0 ? 'age-minor-tick medium' : 'age-minor-tick'}
                  x1={ageAxisRightX - (tick % 6 === 0 ? 10 : 6)}
                  x2={ageAxisRightX + (tick % 6 === 0 ? 10 : 6)}
                  y1={y}
                  y2={y}
                />
              </g>
            )
          })}

          <line className="age-ruler" x1={ageAxisLeftX} x2={ageAxisLeftX} y1={padding.top} y2={padding.top + plotHeight} />
          <line className="age-ruler" x1={ageAxisRightX} x2={ageAxisRightX} y1={padding.top} y2={padding.top + plotHeight} />

          <text className="axis-title" x={ageAxisLeftX - 54} y={padding.top - 20} textAnchor="middle">
            연령
          </text>
          <text className="axis-title" x={ageAxisLeftX - 20} y={padding.top - 20} textAnchor="end">
            개월
          </text>
          <text className="axis-title" x={ageAxisRightX + 20} y={padding.top - 20}>
            개월
          </text>
          <text className="axis-title" x={ageAxisRightX + 54} y={padding.top - 20} textAnchor="middle">
            연령
          </text>

          {chartDomains.map((domain, index) => {
            const x = xForIndex(index)

            return (
              <g key={domain.id}>
                <line
                  className="domain-guide"
                  x1={x}
                  x2={x}
                  y1={padding.top}
                  y2={padding.top + plotHeight}
                />
                <text className="domain-label top-domain-label" x={x} y={padding.top - 36} textAnchor="middle">
                  {splitDomainName(domain.name).map((line, lineIndex) => (
                    <tspan x={x} dy={lineIndex === 0 ? 0 : 14} key={line}>
                      {line}
                    </tspan>
                  ))}
                </text>
                {referenceScoresFor(domain).map((score) => {
                  const y = yForMonth(referenceMonthFor(domain, score))

                  return (
                    <g key={`${domain.id}-${score}`}>
                      <circle className="reference-marker" cx={x} cy={y} r="5" />
                      <text className="reference-score-label" x={x + 9} y={y + 3}>
                        {score}
                      </text>
                    </g>
                  )
                })}
                {(domain.id !== 'developmentTotal' || Number.isFinite(domain.mastered)) && (
                  <>
                    <rect
                      className="emerging-box"
                      x={x - 20}
                      y={height - 88}
                      width="40"
                      height="28"
                      rx="3"
                    />
                    <text className="emerging-count" x={x} y={height - 69} textAnchor="middle">
                      {domain.id === 'developmentTotal' ? domain.mastered : domain.emerging}
                    </text>
                  </>
                )}
                <text className="domain-label bottom-domain-label" x={x} y={height - 38} textAnchor="middle">
                  {domain.name}
                </text>
              </g>
            )
          })}

          <text className="emerging-label" x={domainLeftX - 28} y={height - 69} textAnchor="end">
            싹트기
          </text>
          <text className="emerging-label" x={domainLeftX - 28} y={height - 55} textAnchor="end">
            반응
          </text>

          {lifeAgeY !== null && (
            <g>
              <line
                className="life-age-line"
                x1={ageAxisLeftX}
                x2={ageNoteEndX}
                y1={lifeAgeY}
                y2={lifeAgeY}
              />
              <text className="life-age-label" x={ageNoteLabelX} y={lifeAgeY - 8}>
                생활연령 {lifeAgeMonths}개월
              </text>
            </g>
          )}

          <path className="score-line emerging-line" d={linePath('projectedMonth')} />
          <path className="score-line mastered-line" d={linePath('masteredMonth')} />

          {totalProfile && (
            <g>
              <line
                className="development-age-line"
                x1={xForIndex(chartDomains.length - 1)}
                x2={ageNoteEndX}
                y1={yForMonth(totalProfile.masteredMonth)}
                y2={yForMonth(totalProfile.masteredMonth)}
              />
              <text
                className="development-age-label"
                x={ageNoteLabelX}
                y={yForMonth(totalProfile.masteredMonth) - 8}
              >
                발달연령 {totalProfile.masteredAgeRange || monthRange(totalProfile.masteredMonth)}
              </text>
            </g>
          )}

          {chartDomains.map((domain, index) => {
            const masteredPoint = pointFor(domain, index, 'masteredMonth')
            const projectedPoint = pointFor(domain, index, 'projectedMonth')
            const shouldLabelMasteredPoint =
              domain.id === 'developmentTotal' && !hasReferenceScore(domain, domain.mastered)

            return (
              <g key={`${domain.id}-points`}>
                {domain.id !== 'developmentTotal' && (
                  <circle className="score-point emerging-point" cx={projectedPoint.x} cy={projectedPoint.y} r="6" />
                )}
                <circle className="score-point mastered-point" cx={masteredPoint.x} cy={masteredPoint.y} r="6" />
                {shouldLabelMasteredPoint && (
                  <text className="point-label" x={masteredPoint.x + 10} y={masteredPoint.y + 4}>
                    {domain.mastered}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>
    </section>
  )
}

function monthRange(month) {
  const rounded = Math.round(month || 0)
  const start = Math.max(0, rounded - 1)
  const end = rounded + 1

  return `${start}~${end}개월`
}
