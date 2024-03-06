import { useEffect } from 'react'

export const AreaContribute = () => {
  useEffect(() => {
    window.document.documentElement.dataset.area = 'contribute'
    return () => {
      delete window.document.documentElement.dataset.area
    }
  })

  return <></>
}
