import { PolylineEditor, useAMapContext } from 'amap-rc'
import { useAirlineStore } from '@/store/airline'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface Props {
  open: boolean
}

export default function FsyPolylineEditor({ open }: Props) {
  const [polylineEditor, setPolylineEditor] = useState<any>(null)
  const { updateState } = useAirlineStore()

  const opts = useMemo(
    () => ({
      editOptions: {
        isOutline: false,
        strokeColor: '#1677ff', //轮廓线颜色
        strokeOpacity: 1, //轮廓线透明度
        strokeWeight: 3, //轮廓线宽度
        strokeStyle: 'solid', //线样式还支持 'dashed'
        lineJoin: 'round', //折线拐点连接处样式
      },
      controlPoint: {
        radius: 7,
        fillOpacity: 0.7,
        fillColor: '#0958d9',
      },
      midControlPoint: {
        radius: 6,
        fillOpacity: 0.2,
        strokeOpacity: 0.5,
      },
    }),
    []
  )

  const handleMount = useCallback((_polylineEditor: any) => {
    setPolylineEditor(_polylineEditor)
  }, [])

  const handleUnMount = useCallback((_polylineEditor: any) => {
    polylineEditor?.clearEvents('addnode')
    polylineEditor?.clearEvents('adjust')
    polylineEditor?.clearEvents('removenode')
    polylineEditor?.close()
    setPolylineEditor(null)
  }, [])

  useEffect(() => {
    if (!open || !polylineEditor) {
      return
    }
    polylineEditor?.on('addnode', (event: any) => {
      updateState({ waypointLatLonList: event.target?._opts?.path })
    })
    polylineEditor?.on('adjust', (event: any) => {
      updateState({ waypointLatLonList: event.target?._opts?.path })
    })
    polylineEditor?.on('removenode', (event: any) => {
      updateState({ waypointLatLonList: event.target?._opts?.path })
    })

    return () => {
      if (polylineEditor) {
        try {
          polylineEditor?.clearEvents('addnode')
          polylineEditor?.clearEvents('adjust')
          polylineEditor?.clearEvents('removenode')
          polylineEditor?.close()
          setPolylineEditor(null)
        } catch (error) {}
      }
    }
  }, [open, polylineEditor])

  return (
    <PolylineEditor
      opts={opts}
      open={open}
      onMount={handleMount}
      onUnMount={handleUnMount}
    />
  )
}
