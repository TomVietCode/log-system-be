import { stringify } from "csv-stringify/sync"

export interface FlatDevRow {
  employeeCode: string,
  fullName: string,
  role: string,
  email: string,
  project: string,
  task: string,
  totalHour: string,
  content: string,
  logDate: string,
  idOvertime: string | boolean
}

export const generateDevLogCsv = (rows: FlatDevRow[], addBom = true) => {
  const header = [
    'Employee Code',
    'Full Name',
    'Role',
    'Email',
    'Project',
    'Task',
    'Hour',
    'Note',
    'Date',
    'Overtime'
  ]

  const data: (string | number | boolean)[][] = [
    header,
    ...rows.map(r => ([
      String(r.employeeCode).trim(),
      String(r.fullName).trim(),
      String(r.role).trim(),
      String(r.email).trim(),
      String(r.project).trim(),
      String(r.task).trim(),
      String(r.totalHour).trim(),
      String(r.content).trim(),
      String(r.logDate).trim(),
      String(r.idOvertime).trim()
    ]))
  ]

  const csv = stringify(data, { 
    delimiter: ',',
    quote: '"',
    quoted_empty: false,
    escape: '"',
    record_delimiter: '\n',
    quoted_string: true,
    quoted: true
  })

  return addBom ? '\ufeff' + csv : csv
}