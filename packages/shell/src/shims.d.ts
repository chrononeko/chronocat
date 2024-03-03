declare const yamlData: string
declare const htmlData: string
declare const txtData: string

declare module '*.yml' {
  // eslint-disable-next-line import/no-default-export
  export default yamlData
}

declare module '*.html' {
  // eslint-disable-next-line import/no-default-export
  export default htmlData
}

declare module '*.txt' {
  // eslint-disable-next-line import/no-default-export
  export default txtData
}
