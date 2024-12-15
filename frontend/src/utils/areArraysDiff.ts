export const areArraysSame = (arr1: any[], arr2: any[]) => {
  if (arr1.length != arr2.length) return false
  arr1.sort()
  arr2.sort()

  for (let index = 0; index < arr1.length; index++) {
    if (arr1[index] != arr2[index]) return false
  }

  return true
}
