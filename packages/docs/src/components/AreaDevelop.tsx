import { useEffect } from 'react'

export const AreaDevelop = () => {
  useEffect(() => {
    window.document.documentElement.dataset.area = 'develop'
    return () => {
      delete window.document.documentElement.dataset.area
    }
  })

  return <></>
}
