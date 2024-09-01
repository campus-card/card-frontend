/**
 * 根据传入的字数省略字符串
 */
export const ellipsis = (str: string, length: number): string => {
  return str.length > length ? str.slice(0, length) + '...' : str
}

/**
 * 数组splice方法的改版, 可以在index超出数组长度时自动填充undefined
 */
export const spliceWithPlaceholder = <T>(arr: T[], start: number, deleteCount: number, ...elements: T[]): void => {
  if (start > arr.length) {
    arr.push(...new Array(start - arr.length).fill(undefined))
  }
  arr.splice(start, deleteCount, ...elements)
  if (elements.length < deleteCount) {
    arr.splice(start + elements.length, 0, ...new Array(deleteCount - elements.length).fill(undefined))
  }
}
