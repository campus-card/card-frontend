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

/**
 * 格式化日期为yyyy-MM-dd HH:mm:ss <br>
 * 两位数补0
 */
export function formatDate(date: Date): string {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
}
