export const generateEmployeeCode = (length: number) => {
  const nums = "0123456789"
  let result = ""
  for(let i = 0; i < length; i++) {
    result += nums[Math.floor(Math.random() * nums.length)]
  }
  return result
}