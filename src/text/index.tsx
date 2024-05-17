import { PropsWithChildren, useEffect, useState } from 'react'
import { useAMapContext } from '../map/context'

interface Props extends PropsWithChildren {
  [propName: string]: any
}

export default function Text({ children, ...opts }: Props) {
  const { map, AMap } = useAMapContext()
  const [text, setText] = useState<any>(null)

  useEffect(() => {
    if (!map || !AMap) {
      return
    }
    const nextText = new AMap.Text({
      map,
      ...opts,
    })
    map?.add?.(nextText)
    setText(nextText)

    return () => {
      try {
        nextText && map?.remove?.(nextText)
      } catch (error) {}
    }
  }, [map, AMap])

  useEffect(() => {
    if (!text) {
      return
    }
    text?.setOptions(opts)
  }, [text, opts])

  return null
}
