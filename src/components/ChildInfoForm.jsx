export function ChildInfoForm({ childInfo, ageText, onChange }) {
  const fields = [
    { id: 'name', label: '이름', type: 'text' },
    { id: 'birthDate', label: '생년월일', type: 'date' },
    { id: 'testDate', label: '검사일', type: 'date' },
    { id: 'institution', label: '반이름', type: 'text' },
  ]

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>아동 기본 정보</h2>
      </div>
      <div className="form-grid">
        {fields.map((field) => (
          <label className="field" key={field.id}>
            <span>{field.label}</span>
            <input
              type={field.type}
              value={childInfo[field.id]}
              placeholder={field.placeholder || ''}
              onChange={(event) => onChange(field.id, event.target.value)}
            />
          </label>
        ))}
        <div className="field age-display">
          <span>생활연령</span>
          <strong>{ageText || '생년월일과 검사일을 입력하면 자동 계산됨'}</strong>
        </div>
      </div>
    </section>
  )
}
