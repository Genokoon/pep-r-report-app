import { developmentTotalAgeRanges, graphScoreMonths } from './graphScoreMonths.js'

export function scoreToMonth(domainId, score, assessmentItems) {
  const numericScore = Math.max(0, Number(score) || 0)
  const lookupDomainId = domainId || 'developmentTotal'
  const graphMonths = interpolateGraphMonth(lookupDomainId, numericScore)

  if (graphMonths !== null) {
    return graphMonths
  }

  if (!numericScore || !assessmentItems?.length) {
    return 0
  }

  const domainItems = assessmentItems
    .filter((item) => !domainId || item.domainId === domainId)
    .filter((item) => Number.isFinite(item.midMonths))
    .sort((a, b) => a.midMonths - b.midMonths || a.maxMonths - b.maxMonths || a.number - b.number)

  if (!domainItems.length) {
    return 0
  }

  const scoreIndex = Math.min(numericScore, domainItems.length) - 1

  return domainItems[scoreIndex].midMonths
}

export function scoreToAgeRange(domainId, score) {
  const numericScore = Math.max(0, Number(score) || 0)

  if (domainId || !developmentTotalAgeRanges[numericScore]) {
    return null
  }

  const [start, end] = developmentTotalAgeRanges[numericScore]

  return `${start}~${end}개월`
}

function interpolateGraphMonth(domainId, score) {
  const table = graphScoreMonths[domainId]

  if (!table) {
    return null
  }

  const scores = Object.keys(table)
    .map(Number)
    .sort((a, b) => a - b)

  if (!scores.length) {
    return null
  }

  if (score <= scores[0]) {
    return table[scores[0]]
  }

  if (score >= scores[scores.length - 1]) {
    return table[scores[scores.length - 1]]
  }

  for (let index = 0; index < scores.length - 1; index += 1) {
    const lowerScore = scores[index]
    const upperScore = scores[index + 1]

    if (score === lowerScore) {
      return table[lowerScore]
    }

    if (score > lowerScore && score < upperScore) {
      const ratio = (score - lowerScore) / (upperScore - lowerScore)

      return table[lowerScore] + (table[upperScore] - table[lowerScore]) * ratio
    }
  }

  return table[scores[scores.length - 1]]
}
