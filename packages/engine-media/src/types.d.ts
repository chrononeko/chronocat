declare const zipData: Uint8Array

declare module '*.zip' {
  // eslint-disable-next-line import/no-default-export
  export default zipData
}
