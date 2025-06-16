import { stringify } from "csv-stringify/sync"

export interface devLogData {
  userName: string
  month: number
  year: number
  days: number[]
  tasks: {
    taskId: string,
    taskName: string
    projectId: string,
    hoursByDay: number[]
    totalHoursByTask: number
  }[]
  totalByDay: number[]
  grandTotal: number
}

export const generateDevLogCsv = (data: devLogData) => {
  const { userName, month, year, days, tasks, totalByDay, grandTotal } = data

  const csvData: (string | number)[][] = []

  // Header
  const headerRow = [
    `${userName}`,
    ...days.map(day => `${day}/${month.toString().length === 1 ? `0${month}` : month}`),
    'Tổng'
  ]
  csvData.push(headerRow)

  // Tasks
  for(const task of tasks) {
    const taskRow = [
      task.taskName,
      ...task.hoursByDay,
      task.totalHoursByTask
    ]
    csvData.push(taskRow)
  }

  // Total row
  const totalRow = [
    '',
    ...totalByDay,
    grandTotal
  ]
  csvData.push(totalRow)

  return stringify(csvData, {
    delimiter: ',',
    quote: '"',
    quoted_empty: false,
    escape: '"'
  });
}