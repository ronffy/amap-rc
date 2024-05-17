import {
  PropsWithChildren,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import { useAMapContext } from '../map/context'

interface Props extends PropsWithChildren {
  [propName: string]: any
}

export default forwardRef(function Marker({ children, ...opts }: Props, ref) {
  const { map, AMap } = useAMapContext()
  const [marker, setMarker] = useState<any>(null)

  useEffect(() => {
    if (!map || !AMap) {
      return
    }
    const nextMarker = new AMap.Marker(opts)
    map?.add?.(nextMarker)
    setMarker(nextMarker)

    return () => {
      try {
        nextMarker && map?.remove?.(nextMarker)
      } catch (error) {}
    }
  }, [map, AMap])

  useEffect(() => {
    if (!marker) {
      return
    }
    try {
      marker?.setOptions(opts)
    } catch (error) {}
  }, [marker, opts])

  useImperativeHandle(ref, () => ({ marker }), [marker])

  return null
})
