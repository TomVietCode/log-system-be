export const getDateRange = (month: number, year: number) => {
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0)

  return {
    startDate,
    endDate
  }
}

export const getDayRange = (date: string) => {
  const targetDate = new Date(date)
  const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0))
  const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999))

  return {
    startOfDay,
    endOfDay
  }
}