import React, {
  PropsWithChildren,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { AMapContext } from './context'

export type MapProps = PropsWithChildren &
  Partial<{
    zooms: [number, number]
    layers: (AMap: any, map: any) => any[]
    center: [number, number]
    viewMode: '2D' | '3D'
    resizeEnable: boolean
    zoom: number
    mapStyle: string
    features: string[]
    showLabel: boolean
    expandZoomRange: boolean
    showBuildingBlock: boolean
    showIndoorMap: boolean
    indoorMapID: string
    indoorMapVersion: string
    pitch: number
    rotation: number
    className: string
    rotateEnable: boolean
    pitchEnable: boolean
  }>

const ContainerStyle = {
  position: 'relative',
  width: '100%',
  height: '100%',
  minHeight: '300px',
}

export default forwardRef(function Map(
  { children, className, ...mapOpts }: MapProps,
  ref
) {
  const [map, setMap] = useState<any>(null)
  const AMap = window.AMap
  const elmRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!map && AMap) {
      const _map = new AMap.Map(elmRef.current, {
        ...mapOpts,
        layers: mapOpts?.layers?.(AMap, map),
      })
      setMap(_map)
    }

    return () => {
      if (map) {
        map.clearInfoWindow()
        map.clearLimitBounds()
        map.clearMap()
        map.destroy()
        setMap(undefined)
      }
    }
  }, [AMap, map])

  useImperativeHandle(ref, () => ({
    map,
    AMap,
  }))

  return (
    <AMapContext.Provider value={{ map, AMap }}>
      <div ref={elmRef} style={ContainerStyle} className={className}>
        {map && children}
      </div>
    </AMapContext.Provider>
  )
})
