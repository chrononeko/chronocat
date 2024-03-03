export const p2 = (v: number) => {
  return `0${v}`.slice(-2)
}

export const p4 = (v: number) => {
  return `000${v}`.slice(-4)
}

export const formatTimeforFilename = () => {
  const d = new Date()
  return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}-${p2(
    d.getHours(),
  )}-${p2(d.getMinutes())}-${p2(d.getSeconds())}`
}
