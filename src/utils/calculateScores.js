import { scoreToAgeRange, scoreToMonth } from '../data/scoreToMonths.js'

export function calculateScores(domains, itemRatings, assessmentItems) {
  const domainScores = domains.map((domain) => {
    const domainItems = assessmentItems.filter((item) => item.domainId === domain.id)
    const mastered = domainItems.filter((item) => itemRatings[item.id] === 'pass').length
    const emerging = domainItems.filter((item) => itemRatings[item.id] === 'emerging').length
    const failed = domainItems.filter((item) => itemRatings[item.id] === 'fail').length
    const notScored = domainItems.length - mastered - emerging - failed

    return {
      ...domain,
      mastered,
      emerging,
      projected: mastered + emerging,
      failed,
      notScored,
      itemCount: domainItems.length,
      masteredMonth: scoreToMonth(domain.id, mastered, assessmentItems),
      projectedMonth: scoreToMonth(domain.id, mastered + emerging, assessmentItems),
    }
  })
  const interpretationDomains = domainScores

  const masteredTotal = interpretationDomains.reduce((sum, domain) => sum + domain.mastered, 0)
  const emergingTotal = interpretationDomains.reduce((sum, domain) => sum + domain.emerging, 0)
  const failedTotal = interpretationDomains.reduce((sum, domain) => sum + domain.failed, 0)
  const notScoredTotal = interpretationDomains.reduce((sum, domain) => sum + domain.notScored, 0)
  const projectedTotal = masteredTotal + emergingTotal
  const totalProfile = {
    id: 'developmentTotal',
    name: '발달 총점',
    mastered: masteredTotal,
    emerging: emergingTotal,
    projected: projectedTotal,
    failed: failedTotal,
    notScored: notScoredTotal,
    itemCount: assessmentItems.length,
    masteredMonth: scoreToMonth(null, masteredTotal, assessmentItems),
    projectedMonth: scoreToMonth(null, projectedTotal, assessmentItems),
    masteredAgeRange: scoreToAgeRange(null, masteredTotal),
    projectedAgeRange: scoreToAgeRange(null, projectedTotal),
  }
  const sorted = [...interpretationDomains].sort((a, b) => b.masteredMonth - a.masteredMonth)
  const strengths = sorted.slice(0, Math.min(2, sorted.length))
  const needs = [...sorted].reverse().slice(0, Math.min(2, sorted.length))

  return {
    domainScores,
    interpretationDomains,
    masteredTotal,
    emergingTotal,
    failedTotal,
    notScoredTotal,
    projectedTotal,
    totalProfile,
    total: masteredTotal,
    strengths,
    needs,
  }
}
