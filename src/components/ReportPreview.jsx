export function ReportPreview({ report }) {
  return (
    <section className="panel report-panel">
      <div className="panel-header">
        <h2>보고서 초안</h2>
      </div>
      <pre>{report}</pre>
    </section>
  )
}
