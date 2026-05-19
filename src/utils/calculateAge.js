export function calculateAge(birthDate, testDate) {
  const totalMonths = calculateAgeMonths(birthDate, testDate)

  if (totalMonths === null) {
    return ''
  }

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  return `${years}세 ${months}개월`
}

export function calculateAgeMonths(birthDate, testDate) {
  if (!birthDate || !testDate) {
    return null
  }

  const birth = new Date(birthDate)
  const test = new Date(testDate)

  if (Number.isNaN(birth.getTime()) || Number.isNaN(test.getTime()) || test < birth) {
    return null
  }

  let years = test.getFullYear() - birth.getFullYear()
  let months = test.getMonth() - birth.getMonth()
  let days = test.getDate() - birth.getDate()

  if (days < 0) {
    months -= 1
    const previousMonthLastDate = new Date(test.getFullYear(), test.getMonth(), 0).getDate()
    days += previousMonthLastDate
  }

  if (months < 0) {
    years -= 1
    months += 12
  }

  return years * 12 + months + (days > 25 ? 1 : 0)
}
