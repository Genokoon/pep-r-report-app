import { useMemo, useState } from 'react'
import { ChildInfoForm } from './components/ChildInfoForm.jsx'
import { DevelopmentAgeTable } from './components/DevelopmentAgeTable.jsx'
import { ReportPreview } from './components/ReportPreview.jsx'
import { ResultSummary } from './components/ResultSummary.jsx'
import { ScoreChart } from './components/ScoreChart.jsx'
import { ScoreInputPanel } from './components/ScoreInputPanel.jsx'
import { assessmentItems } from './data/assessmentItems.js'
import { domains } from './data/domains.js'
import { calculateAge, calculateAgeMonths } from './utils/calculateAge.js'
import { calculateScores } from './utils/calculateScores.js'
import { generateReport } from './utils/generateReport.js'

const initialChildInfo = {
  name: '',
  birthDate: '',
  testDate: '',
  institution: '',
}

const initialItemRatings = Object.fromEntries(assessmentItems.map((item) => [item.id, '']))
const initialItemDetails = {}
const lateralityItemIds = new Set(['pepR_007', 'pepR_046', 'pepR_072'])

const sampleChildInfo = {
  name: '김하준',
  birthDate: '2021-03-15',
  testDate: '2026-05-08',
  institution: '기쁨반',
}

const sampleItemRatings = createMixedSampleRatings()

const sampleItemDetails = {
  pepR_007: { side: 'right' },
  pepR_046: { side: 'undetermined' },
  pepR_072: { side: 'left' },
}

function createMixedSampleRatings() {
  const sortedItems = [...assessmentItems].sort((a, b) => a.midMonths - b.midMonths || a.number - b.number)
  const passedItems = new Set(sortedItems.slice(0, 105).map((item) => item.id))
  const emergingItems = new Set(sortedItems.slice(105, 120).map((item) => item.id))
  const highLevelPassNumbers = [12, 21, 55, 61, 88, 102, 116, 130]
  const unevenEmergingNumbers = [1, 18, 27, 42, 63, 84, 100, 121]
  const unevenFailNumbers = [3, 9, 16, 24, 41, 46, 52, 67, 75, 92, 109]

  applySampleOverrides(highLevelPassNumbers, 'pass', passedItems, emergingItems)
  applySampleOverrides(unevenEmergingNumbers, 'emerging', passedItems, emergingItems)
  applySampleOverrides(unevenFailNumbers, 'fail', passedItems, emergingItems)

  return Object.fromEntries(
    assessmentItems.map((item) => {
      if (passedItems.has(item.id)) {
        return [item.id, 'pass']
      }

      if (emergingItems.has(item.id)) {
        return [item.id, 'emerging']
      }

      return [item.id, 'fail']
    }),
  )
}

function applySampleOverrides(itemNumbers, rating, passedItems, emergingItems) {
  itemNumbers.forEach((itemNumber) => {
    const item = assessmentItems.find((assessmentItem) => assessmentItem.number === itemNumber)

    if (!item) {
      return
    }

    if (rating === 'pass') {
      passedItems.add(item.id)
      emergingItems.delete(item.id)
      return
    }

    passedItems.delete(item.id)

    if (rating === 'emerging') {
      emergingItems.add(item.id)
      return
    }

    emergingItems.delete(item.id)
  })
}

const pages = [
  { id: 'childInfo', label: '1. 인적사항' },
  { id: 'scores', label: '2. 검사입력' },
  { id: 'ageTable', label: '3. 발달연령표' },
  { id: 'results', label: '4. 결과확인' },
  { id: 'report', label: '5. 보고서' },
]

function App() {
  const [childInfo, setChildInfo] = useState(initialChildInfo)
  const [itemRatings, setItemRatings] = useState(initialItemRatings)
  const [itemDetails, setItemDetails] = useState(initialItemDetails)
  const [activePage, setActivePage] = useState(pages[0].id)

  const scoreResult = useMemo(
    () => calculateScores(domains, itemRatings, assessmentItems),
    [itemRatings],
  )
  const ageText = useMemo(
    () => calculateAge(childInfo.birthDate, childInfo.testDate),
    [childInfo.birthDate, childInfo.testDate],
  )
  const ageMonths = useMemo(
    () => calculateAgeMonths(childInfo.birthDate, childInfo.testDate),
    [childInfo.birthDate, childInfo.testDate],
  )
  const report = useMemo(
    () => generateReport(childInfo, scoreResult, ageText, ageMonths, assessmentItems, itemRatings, itemDetails),
    [childInfo, scoreResult, ageText, ageMonths, itemRatings, itemDetails],
  )

  function updateChildInfo(field, value) {
    setChildInfo((current) => ({ ...current, [field]: value }))
  }

  function updateItemRating(itemId, value) {
    setItemRatings((current) => ({
      ...current,
      [itemId]: value,
    }))

    if (value === 'fail' && lateralityItemIds.has(itemId)) {
      setItemDetails((current) => ({
        ...current,
        [itemId]: {
          ...current[itemId],
          side: 'undetermined',
        },
      }))
    }
  }

  function updateItemDetail(itemId, field, value) {
    setItemDetails((current) => ({
      ...current,
      [itemId]: {
        ...current[itemId],
        [field]: value,
      },
    }))
  }

  function fillSampleData() {
    setChildInfo(sampleChildInfo)
    setItemRatings(sampleItemRatings)
    setItemDetails(sampleItemDetails)
  }

  function resetInputs() {
    setChildInfo(initialChildInfo)
    setItemRatings(initialItemRatings)
    setItemDetails(initialItemDetails)
  }

  const activePageIndex = pages.findIndex((page) => page.id === activePage)
  const checkedItemCount = assessmentItems.filter((item) => itemRatings[item.id]).length

  function goToPreviousPage() {
    setActivePage(pages[Math.max(activePageIndex - 1, 0)].id)
  }

  function goToNextPage() {
    setActivePage(pages[Math.min(activePageIndex + 1, pages.length - 1)].id)
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">PEP-R 자동 보고서 웹앱</p>
          <h1>PEP-R 자동 계산 및 보고서 초안 출력</h1>
          <p>보고서 초안의 경우 다시 한번 읽어보시고 문장 구조, 오탈자 및 이상한 부분을 체크해보시길 권장합니다.</p>
        </div>
        <div className="header-side">
          <aside className="privacy-note">
            입력 내용은 서버에 저장하지 않고 현재 브라우저 화면에서만 계산됩니다.
          </aside>
          <div className="header-actions">
            <button type="button" onClick={fillSampleData}>
              테스트 데이터 입력
            </button>
            <button className="secondary-button" type="button" onClick={resetInputs}>
              초기화
            </button>
          </div>
        </div>
      </header>

      <nav className="page-tabs" aria-label="작성 단계">
        {pages.map((page) => (
          <button
            className={page.id === activePage ? 'page-tab active' : 'page-tab'}
            type="button"
            key={page.id}
            onClick={() => setActivePage(page.id)}
          >
            {page.label}
          </button>
        ))}
      </nav>

      <div className="page-status">
        <span>입력된 검사 항목 {checkedItemCount} / {assessmentItems.length}</span>
        <span>{ageText ? `생활연령 ${ageText}` : '생활연령 미입력'}</span>
      </div>

      {activePage === 'childInfo' && (
        <div className="page-layout">
          <ChildInfoForm childInfo={childInfo} ageText={ageText} onChange={updateChildInfo} />
        </div>
      )}

      {activePage === 'scores' && (
        <div className="page-layout">
          <ScoreInputPanel
            assessmentItems={assessmentItems}
            itemDetails={itemDetails}
            itemRatings={itemRatings}
            onDetailChange={updateItemDetail}
            onChange={updateItemRating}
          />
        </div>
      )}

      {activePage === 'ageTable' && (
        <div className="page-layout">
          <DevelopmentAgeTable
            assessmentItems={assessmentItems}
            itemDetails={itemDetails}
            itemRatings={itemRatings}
          />
        </div>
      )}

      {activePage === 'results' && (
        <div className="page-layout result-page">
          <ResultSummary result={scoreResult} />
          <ScoreChart
            childInfo={childInfo}
            domainScores={scoreResult.domainScores}
            totalProfile={scoreResult.totalProfile}
            lifeAgeMonths={ageMonths}
          />
        </div>
      )}

      {activePage === 'report' && (
        <div className="page-layout">
          <ReportPreview report={report} />
        </div>
      )}

      <div className="page-actions">
        <button
          className="secondary-button"
          type="button"
          onClick={goToPreviousPage}
          disabled={activePageIndex === 0}
        >
          이전
        </button>
        <button type="button" onClick={goToNextPage} disabled={activePageIndex === pages.length - 1}>
          다음
        </button>
      </div>
    </main>
  )
}

export default App
