import {
  PropsWithChildren,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import { useAMapContext } from '../map/context'
import { PolylineContext } from './context'

interface Props extends PropsWithChildren {
  [propName: string]: any
}

export default forwardRef(function Polyline({ children, ...opts }: Props, ref) {
  const { map, AMap } = useAMapContext()
  const [polyline, setPolyline] = useState<any>(null)

  useEffect(() => {
    if (!map || !AMap) {
      return
    }
    const nextPolyline = new AMap.Polyline(opts)
    map?.add?.(nextPolyline)
    setPolyline(nextPolyline)

    return () => {
      if (nextPolyline) {
        try {
          map?.remove?.(nextPolyline)
        } catch (error) {}
      }
    }
  }, [map, AMap])

  useEffect(() => {
    if (!polyline) {
      return
    }
    polyline?.setOptions(opts)
  }, [polyline, opts])

  useImperativeHandle(ref, () => ({ polyline }), [polyline])

  return (
    <PolylineContext.Provider
      value={{
        polyline,
      }}
    >
      {polyline && children}
    </PolylineContext.Provider>
  )
})
