export interface StatisticDto {
  //columns chart data
  dailyHoursChart: {
    days: number[]
    hours: number[]
    month?: number
    year?: number
  }

  //pie chart data
  projectChart: {
    projects: {
      id: string,
      name: string,
      hours: number,
    }[]
  }
}