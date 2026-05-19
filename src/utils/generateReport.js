const domainIntroductions = {
  imitation:
    '다른 사람이 말한 것을 반복하는 언어모방 능력과 다른 사람이 흉내 내는 것을 모방하는 운동모방 능력으로 구성되어 있는 모방영역',
  languageImitation: '언어모방',
  motorImitation: '운동모방',
  perception: '소리에 대한 반응, 시각추적, 형태, 색깔, 크기의 지각능력에 대해 측정하는 지각영역',
  fineMotor: '손 협응과 쥐기와 같은 운동기능을 측정하는 소근육 운동영역',
  grossMotor: '팔, 다리의 운동기능을 측정하는 대근육 운동영역',
  eyeHandCoordination:
    '글씨나 그림을 그리는 능력을 발달시키는 데 필수적인 눈과 손을 함께 사용하는 능력을 측정하는 눈-손 협응영역',
  cognitivePerformance: '언어에 의존하지 않는 과제들의 수행능력 및 언어이해 능력을 측정하는 동작성 인지영역',
  cognitiveVerbal: '언어 또는 몸짓을 통해 표현하는 능력을 측정하는 언어성 인지영역',
}

const domainReportNames = {
  imitation: '모방영역',
  languageImitation: '언어모방',
  motorImitation: '운동모방',
  perception: '지각 영역',
  fineMotor: '소근육 운동영역',
  grossMotor: '대근육 운동영역',
  eyeHandCoordination: '눈-손 협응영역',
  cognitivePerformance: '동작성 인지영역',
  cognitiveVerbal: '언어성 인지영역',
}

const imitationSubdomains = {
  language: new Set(['pepR_014', 'pepR_100', 'pepR_102', 'pepR_123', 'pepR_124', 'pepR_130']),
}

const lateralityItems = {
  eye: { id: 'pepR_007', label: '눈', domainId: 'perception' },
  foot: { id: 'pepR_046', label: '발', domainId: 'grossMotor' },
  hand: { id: 'pepR_072', label: '손', domainId: 'grossMotor' },
}
const lateralityItemIds = new Set(Object.values(lateralityItems).map((item) => item.id))

const sideLabels = {
  right: '오른쪽',
  left: '왼쪽',
  undetermined: '아직 정해지지 않은',
}

const taskPhraseRules = [
  ['셀 수 있다', '셀 수 있는'],
  ['더 잘 쓰는 눈이 있다', '더 잘 쓰는 눈이 있는'],
  ['더 잘 쓰는 발이 있다', '더 잘 쓰는 발이 있는'],
  ['더 잘 쓰는 손이 있다', '더 잘 쓰는 손이 있는'],
  ['올렸다 내렸다 한다', '올렸다 내렸다 하는'],
  ['따라한다', '따라하는'],
  ['사용한다', '사용하는'],
  ['이해한다', '이해하는'],
  ['구별한다', '구별하는'],
  ['분류한다', '분류하는'],
  ['조작한다', '조작하는'],
  ['모방한다', '모방하는'],
  ['반응한다', '반응하는'],
  ['표현한다', '표현하는'],
  ['예상한다', '예상하는'],
  ['시행한다', '시행하는'],
  ['집중한다', '집중하는'],
  ['한다', '하는'],
  ['연다', '여는'],
  ['분다', '부는'],
  ['쫓는다', '쫓는'],
  ['울린다', '울리는'],
  ['찌른다', '찌르는'],
  ['잡는다', '잡는'],
  ['만든다', '만드는'],
  ['논다', '노는'],
  ['흉내낸다', '흉내내는'],
  ['가리킨다', '가리키는'],
  ['맞춘다', '맞추는'],
  ['끼운다', '끼우는'],
  ['말한다', '말하는'],
  ['완성시킨다', '완성시키는'],
  ['걷는다', '걷는'],
  ['친다', '치는'],
  ['선다', '서는'],
  ['뛴다', '뛰는'],
  ['붙인다', '붙이는'],
  ['받는다', '받는'],
  ['되던진다', '되던지는'],
  ['찬다', '차는'],
  ['민다', '미는'],
  ['오른다', '오르는'],
  ['앉는다', '앉는'],
  ['찾는다', '찾는'],
  ['기울인다', '기울이는'],
  ['마신다', '마시는'],
  ['흔든다', '흔드는'],
  ['빼낸다', '빼내는'],
  ['바꿔준다', '바꿔주는'],
  ['건네준다', '건네주는'],
  ['그린다', '그리는'],
  ['끄적거린다', '끄적거리는'],
  ['색칠한다', '색칠하는'],
  ['읽는다', '읽는'],
  ['쓴다', '쓰는'],
  ['자른다', '자르는'],
  ['집어낸다', '집어내는'],
  ['안다', '아는'],
  ['쌓는다', '쌓는'],
  ['넣는다', '넣는'],
  ['놓는다', '놓는'],
  ['푼다', '푸는'],
  ['센다', '세는'],
  ['집는다', '집는'],
  ['본다', '보는'],
  ['보여준다', '보여주는'],
  ['보인다', '보이는'],
  ['따른다', '따르는'],
  ['다닌다', '다니는'],
  ['짝짓는다', '짝짓는'],
]

export function generateReport(
  childInfo,
  scoreResult,
  ageText,
  ageMonths,
  assessmentItems,
  itemRatings,
  itemDetails = {},
) {
  const fullName = childInfo.name.trim() || '아동'
  const name = childReportName(fullName)
  const subject = `${name}${hasBatchim(name) ? '은' : '는'}`
  const possessiveName = `${name}${josa(name, '의', '이의')}`
  const totalAgeRange =
    scoreResult.totalProfile?.masteredAgeRange || monthRange(scoreResult.totalProfile?.masteredMonth)
  const lifeAgePhrase = ageMonths ? `생활연령(${ageMonths}개월)` : '생활연령'
  const comparison = developmentalComparison(scoreResult.totalProfile?.masteredMonth, ageMonths)
  const domainParagraphs = reportParagraphs(
    reportDomains(scoreResult, assessmentItems),
    name,
    ageMonths,
    itemRatings,
    itemDetails,
  )
  const lowerDomains = domainsByNeed(scoreResult, ageMonths)
  const strengthDomains = domainsByStrength(scoreResult, ageMonths)
  const lowerDomainNames = joinDomainNames(lowerDomains.map((domain) => domainReportName(domain.id)))
  const strengthSentence = strengthDomains
    ? `${strengthDomains}을 제외한 영역에서 생활연령에 비해 낮게 평가되었고, 특히 ${lowerDomainNames}에서 생활연령에 비해 낮게 평가되었습니다.`
    : `모든 영역에서 생활연령에 비해 낮게 평가되었고, 특히 ${lowerDomainNames}에서 생활연령에 비해 낮게 평가되었습니다.`
  const summaryText = `이와 같은 결과를 종합해 볼 때, ${subject} ${strengthSentence}`

  return [
    `${possessiveName} 검사 결과 전체 발달 수준이 ${totalAgeRange} 정도로 ${lifeAgePhrase}에 비해 ${comparison} 것으로 나타났습니다.`,
    ...domainParagraphs.map((paragraph, index) =>
      index === 0 ? `이를 자세히 살펴보면 ${domainIntroductions.imitation} 중 ${paragraph}` : paragraph,
    ),
    summaryText,
  ].join('\n')
}

function reportParagraphs(domains, name, ageMonths, itemRatings, itemDetails) {
  const paragraphs = []
  const languageImitation = domains.find((domain) => domain.id === 'languageImitation')
  const motorImitation = domains.find((domain) => domain.id === 'motorImitation')

  if (languageImitation && motorImitation) {
    paragraphs.push(
      `${domainParagraph(languageImitation, name, ageMonths, itemRatings, itemDetails)} ${domainParagraph(
        motorImitation,
        name,
        ageMonths,
        itemRatings,
        itemDetails,
      )}`,
    )
  }

  domains
    .filter((domain) => domain.id !== 'languageImitation' && domain.id !== 'motorImitation')
    .forEach((domain) => {
      paragraphs.push(domainParagraph(domain, name, ageMonths, itemRatings, itemDetails))
    })

  return paragraphs
}

function reportDomains(scoreResult, assessmentItems) {
  const imitationItems = assessmentItems.filter((item) => item.domainId === 'imitation')
  const languageItems = imitationItems.filter((item) => imitationSubdomains.language.has(item.id))
  const motorItems = imitationItems.filter((item) => !imitationSubdomains.language.has(item.id))
  const nonImitationDomains = scoreResult.interpretationDomains
    .filter((domain) => domain.id !== 'imitation')
    .map((domain) => ({
      ...domain,
      items: assessmentItems.filter((item) => item.domainId === domain.id),
    }))

  return [
    { id: 'languageImitation', name: '언어모방', items: languageItems },
    { id: 'motorImitation', name: '운동모방', items: motorItems },
    ...nonImitationDomains,
  ]
}

function domainParagraph(domain, name, ageMonths, itemRatings, itemDetails) {
  const subject = `${name}${hasBatchim(name) ? '은' : '는'}`
  const passed = pickItems(domain.items, itemRatings, 'pass', 2)
  const emerging = pickItems(domain.items, itemRatings, 'emerging', 2, ageMonths)
  const failed = pickItems(domain.items, itemRatings, 'fail', 2, ageMonths)
  const nonPassCount = domain.items.filter(
    (item) => !isLateralityItem(item) && itemRatings[item.id] && itemRatings[item.id] !== 'pass',
  ).length
  const laterality = lateralitySentence(domain.id, name, itemRatings, itemDetails)
  const sentences = [`${domainIntroductions[domain.id]}에서는`]

  if (passed.length) {
    sentences.push(passSentence(domain, passed, nonPassCount))
  } else {
    sentences.push(`${subject} 합격 반응으로 확인된 과제가 제한적인 것으로 평가되었습니다.`)
  }

  if (emerging.length) {
    sentences.push(`그러나 ${topicPhrase(itemList(emerging))} 미숙함을 보였습니다.`)
  }

  if (failed.length) {
    if (emerging.length) {
      sentences[sentences.length - 1] = sentences[sentences.length - 1].replace('보였습니다.', '보였으며,')
    }

    const failedSentence = `${topicPhrase(itemList(failed))} 어려움을 보이는 것으로 평가되었습니다.`
    sentences.push(emerging.length ? failedSentence : `그러나 ${failedSentence}`)
  }

  if (laterality) {
    sentences.push(laterality)
  }

  return sentences.join(' ')
}

function passSentence(domain, passed, nonPassCount) {
  const listedTasks = itemList(passed)

  if (nonPassCount === 0) {
    return `${listedTasks} 등 모든 과제의 수행이 가능하였습니다.`
  }

  if (nonPassCount <= 3) {
    return `${listedTasks} 등 대부분의 ${domainReportName(domain.id)} 과제의 수행이 가능하였습니다.`
  }

  return `${possessionPhrase(listedTasks)} 수행이 가능하였습니다.`
}

function lateralitySentence(domainId, name, itemRatings, itemDetails) {
  const subject = `${name}${hasBatchim(name) ? '이가' : '가'}`

  if (domainId === 'perception') {
    return singleLateralitySentence(subject, lateralityItems.eye, itemRatings, itemDetails)
  }

  if (domainId !== 'grossMotor') {
    return ''
  }

  const hand = lateralityResult(lateralityItems.hand, itemRatings, itemDetails)
  const foot = lateralityResult(lateralityItems.foot, itemRatings, itemDetails)
  const results = [hand, foot].filter(Boolean)

  if (!results.length) {
    return ''
  }

  if (
    hand?.isDetermined &&
    foot?.isDetermined &&
    hand.side === foot.side
  ) {
    return `한편 ${subject} 가장 잘 쓰는 손과 발은 ${sidePhrase(hand)} 평가되었습니다.`
  }

  return `한편 ${subject} ${results
    .map((result) => `가장 잘 쓰는 ${result.label}은 ${sidePhrase(result)}`)
    .join(', ')} 평가되었습니다.`
}

function singleLateralitySentence(subject, item, itemRatings, itemDetails) {
  const result = lateralityResult(item, itemRatings, itemDetails)

  if (!result) {
    return ''
  }

  return `한편 ${subject} 가장 잘 쓰는 ${result.label}은 ${sidePhrase(result)} 평가되었습니다.`
}

function lateralityResult(item, itemRatings, itemDetails) {
  const rating = itemRatings[item.id]

  if (!rating) {
    return null
  }

  const detailSide = itemDetails[item.id]?.side
  const isDetermined = rating === 'pass' && (detailSide === 'right' || detailSide === 'left')

  return {
    label: item.label,
    isDetermined,
    side: isDetermined ? sideLabels[detailSide] : sideLabels.undetermined,
  }
}

function sidePhrase(result) {
  return result.isDetermined ? `${result.side}인 것으로` : `${result.side} 것으로`
}

function pickItems(items, itemRatings, rating, limit, ageMonths = null) {
  return items
    .filter((item) => !isLateralityItem(item))
    .filter((item) => itemRatings[item.id] === rating)
    .filter((item) => shouldIncludeInReport(item, rating, ageMonths))
    .sort((a, b) =>
      rating === 'pass'
        ? b.midMonths - a.midMonths || b.number - a.number
        : a.midMonths - b.midMonths || a.number - b.number,
    )
    .slice(0, limit)
}

function isLateralityItem(item) {
  return lateralityItemIds.has(item.id)
}

function shouldIncludeInReport(item, rating, ageMonths) {
  if (!ageMonths || rating === 'pass') {
    return true
  }

  return !item.minMonths || item.minMonths <= ageMonths
}

function itemList(items) {
  if (!items.length) {
    return ''
  }

  if (items.length === 1) {
    return taskName(items[0])
  }

  const last = items[items.length - 1]
  const rest = items.slice(0, -1)

  return `${rest.map(taskName).join(', ')}${josa(taskName(last), '와', '과')} ${taskName(last)}`
}

function taskName(item) {
  return `${taskPhrase(item.label)} 과제`
}

function possessionPhrase(text) {
  return `${text}${josa(text, '의', '의')}`
}

function topicPhrase(text) {
  return `${text}${josa(text, '에서는', '에서는')}`
}

function taskPhrase(label) {
  const normalized = label.trim().replace(/\.$/, '')
  const rule = taskPhraseRules.find(([ending]) => normalized.endsWith(ending))

  if (!rule) {
    return normalized
  }

  const [ending, replacement] = rule

  return `${normalized.slice(0, -ending.length)}${replacement}`
}

function josa(text, vowelJosa, consonantJosa) {
  return hasBatchim(text) ? consonantJosa : vowelJosa
}

function monthRange(month) {
  if (!month) {
    return '추후 확인이 필요한 발달연령'
  }

  const rounded = Math.round(month)
  const start = Math.max(0, rounded - 1)
  const end = rounded + 1

  return `${start}~${end}개월`
}

function developmentalComparison(developmentMonth, ageMonths) {
  if (!developmentMonth || !ageMonths) {
    return '추후 비교가 필요한'
  }

  const gap = ageMonths - developmentMonth

  if (gap >= 12) {
    return '발달이 지연된'
  }

  if (gap >= 6) {
    return '발달이 다소 지연된'
  }

  return '생활연령과 유사한'
}

function domainsByNeed(scoreResult, ageMonths) {
  const sorted = [...scoreResult.interpretationDomains].sort((a, b) => {
    if (ageMonths) {
      return ageMonths - b.masteredMonth - (ageMonths - a.masteredMonth)
    }

    return a.masteredMonth - b.masteredMonth
  })

  return sorted.slice(0, 2)
}

function domainsByStrength(scoreResult, ageMonths) {
  const strengths = scoreResult.interpretationDomains.filter((domain) => {
    if (!ageMonths) {
      return scoreResult.strengths.some((strength) => strength.id === domain.id)
    }

    return ageMonths - domain.masteredMonth <= 6
  })

  const domains = strengths.length ? strengths : scoreResult.strengths

  return joinDomainNames(domains.map((domain) => domainReportName(domain.id)))
}

function domainReportName(domainId) {
  return domainReportNames[domainId] || domainId
}

function joinDomainNames(names) {
  if (!names.length) {
    return ''
  }

  if (names.length === 1) {
    return names[0]
  }

  return `${names.slice(0, -1).join(', ')}과 ${names[names.length - 1]}`
}

function childReportName(fullName) {
  const trimmed = fullName.trim()

  if (!trimmed || trimmed === '아동') {
    return '아동'
  }

  const givenName = [...trimmed].length >= 3 ? [...trimmed].slice(1).join('') : trimmed

  return hasBatchim(givenName) ? `${givenName}이` : givenName
}

function hasBatchim(text) {
  const lastChar = text.trim().at(-1)

  if (!lastChar) {
    return true
  }

  const code = lastChar.charCodeAt(0)

  if (code < 0xac00 || code > 0xd7a3) {
    return true
  }

  return (code - 0xac00) % 28 !== 0
}
