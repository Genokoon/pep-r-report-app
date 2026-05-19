export function ResultSummary({ result }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>결과 요약</h2>
      </div>
      <div className="summary-total-card">
        <div>
          <span>정상 반응 총점</span>
          <strong>{result.masteredTotal}</strong>
        </div>
      </div>
      <div className="domain-score-grid" aria-label="영역별 검사 결과 점수">
        {result.domainScores.map((domain) => (
          <article className="domain-score-card" key={domain.id}>
            <h3>{domain.name}</h3>
            <div className="domain-score-values">
              <div>
                <span>합격</span>
                <strong>{domain.mastered}</strong>
              </div>
              <div>
                <span>싹트기</span>
                <strong>{domain.emerging}</strong>
              </div>
              <div>
                <span>불합격</span>
                <strong>{domain.failed}</strong>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
