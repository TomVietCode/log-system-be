import { v7 } from 'uuid';

export const generateEmployeeCode = (length: number) => {
  const id = v7();
  return id.slice(0, length);
}