const highlightedTerms = [
  '눈-손 협응영역',
  '소근육 운동영역',
  '대근육 운동영역',
  '동작성 인지영역',
  '언어성 인지영역',
  '모방영역',
  '지각영역',
  '언어모방',
  '운동모방',
]

export function ReportPreview({ report }) {
  const paragraphs = report.split('\n')

  async function copyReport() {
    const plainText = paragraphs.map((paragraph) => ` ${paragraph}`).join('\n')
    const html = `
      <div style="font-family: Arial, sans-serif; color: #222; line-height: 1.85;">
        ${paragraphs
          .map(
            (paragraph) =>
              `<p style="margin: 0 0 8px; text-indent: 1em;">${renderParagraphHtml(paragraph)}</p>`,
          )
          .join('')}
      </div>
    `

    if (navigator.clipboard && window.ClipboardItem) {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([plainText], { type: 'text/plain' }),
        }),
      ])
      return
    }

    await navigator.clipboard.writeText(plainText)
  }

  return (
    <section className="panel report-panel">
      <div className="panel-header">
        <h2>보고서 초안</h2>
        <div className="panel-actions">
          <button type="button" onClick={copyReport}>
            복사하기
          </button>
        </div>
      </div>
      <div className="report-draft">
        {paragraphs.map((paragraph, index) => (
          <p className="report-paragraph" key={`${index}-${paragraph.slice(0, 20)}`}>
            <span aria-hidden="true">&nbsp;</span>
            {renderParagraph(paragraph)}
          </p>
        ))}
      </div>
    </section>
  )
}

function renderParagraph(paragraph) {
  const pattern = new RegExp(`(${highlightedTerms.map(escapeRegExp).join('|')})`, 'g')

  return paragraph.split(pattern).map((part, index) => {
    if (highlightedTerms.includes(part)) {
      return (
        <strong className="report-domain-term" key={`${part}-${index}`}>
          {part}
        </strong>
      )
    }

    return part
  })
}

function renderParagraphHtml(paragraph) {
  const pattern = new RegExp(`(${highlightedTerms.map(escapeRegExp).join('|')})`, 'g')

  return paragraph
    .split(pattern)
    .map((part) => {
      const escaped = escapeHtml(part)

      if (highlightedTerms.includes(part)) {
        return `<strong style="font-weight: 700; text-decoration: underline;">${escaped}</strong>`
      }

      return escaped
    })
    .join('')
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
