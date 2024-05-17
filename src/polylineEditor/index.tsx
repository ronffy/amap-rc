import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { useAMapContext } from '../map/context'
import { usePolylineContext } from '../polyline/context'
import { useAsyncAMapPlugin } from '../map/hooks'

export interface PolylineEditorProps {
  open?: boolean
  onMount?: (polylineEditor: any) => void
  onUnMount?: (polylineEditor: any) => void
  [propName: string]: any
}

export default forwardRef(function PolylineEditor(
  { open, onMount, onUnMount, opts }: PolylineEditorProps,
  ref
) {
  const { map, AMap } = useAMapContext()
  const { polyline } = usePolylineContext()
  const [polylineEditor, setPolylineEditor] = useState<any>(null)

  useEffect(() => {
    if (!map || !AMap) {
      return
    }

    let nextPolylineEditor: any

    AMap.plugin(['AMap.PolylineEditor'], async (e: any) => {
      nextPolylineEditor = new AMap.PolylineEditor(map, polyline, opts)
      map?.add?.(nextPolylineEditor)
      setPolylineEditor(nextPolylineEditor)
    })

    return () => {
      if (nextPolylineEditor) {
        try {
          map?.remove?.(nextPolylineEditor)
        } catch (error) {}
      }
    }
  }, [map, AMap])

  useEffect(() => {
    if (!polylineEditor) {
      return
    }
    if (open) {
      polylineEditor.open()
    } else {
      polylineEditor.close()
    }
  }, [polylineEditor, open])

  useEffect(() => {
    if (!polylineEditor) {
      return
    }
    onMount?.(polylineEditor)
    return () => {
      onUnMount?.(polylineEditor)
    }
  }, [polylineEditor, onMount, onUnMount])

  useImperativeHandle(ref, () => ({ polylineEditor }), [polylineEditor])

  return null
})
