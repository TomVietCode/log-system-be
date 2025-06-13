export const getDateRange = (month?: number, year?: number) => {
  month = month || new Date().getMonth() + 1;
  year = year || new Date().getFullYear();
  
  // Tạo ngày với UTC
  const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
  const endDate = new Date(Date.UTC(year, month, 0));

  return {
    startDate,
    endDate,
    currentMonth: month,
    currentYear: year
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