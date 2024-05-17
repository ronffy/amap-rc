import { useEffect, useMemo, useState } from 'react'
import { useAMapContext } from './context'

// 工具条
export const useToolBar = (opts?: Record<string, any>) => {
  const [toolBar, setToolBar] = useState(null)
  const { map, AMap } = useAMapContext()

  const { loadStatus } = useAsyncAMapPlugin(['AMap.ToolBar'])

  useEffect(() => {
    if (!map || !AMap || toolBar || loadStatus !== 'loaded') {
      return
    }
    const nextToolBar = new AMap.ToolBar(opts)
    map.addControl(nextToolBar)
    setToolBar(nextToolBar)

    return () => {
      try {
        if (toolBar) {
          map.removeControl(toolBar)
          setToolBar(null)
        }
      } catch (error) {}
    }
  }, [AMap, map, opts, toolBar, loadStatus])

  return toolBar
}

export const useScale = (opts?: Record<string, any>) => {
  const [scale, setScale] = useState(null)
  const { map, AMap } = useAMapContext()

  const { loadStatus } = useAsyncAMapPlugin(['AMap.Scale'])

  useEffect(() => {
    if (!map || !AMap || scale || loadStatus !== 'loaded') {
      return
    }

    const nextScale = new AMap.Scale(opts)
    map.addControl(nextScale)
    setScale(nextScale)

    return () => {
      try {
        if (scale) {
          map.removeControl(scale)
          setScale(null)
        }
      } catch (error) {}
    }
  }, [AMap, map, opts, scale, loadStatus])

  return scale
}

export const useControlBar = (opts?: Record<string, any>) => {
  const [controlBar, setControlBar] = useState(null)
  const { map, AMap } = useAMapContext()

  const { loadStatus } = useAsyncAMapPlugin(['AMap.ControlBar'])

  useEffect(() => {
    if (!map || !AMap || controlBar || loadStatus !== 'loaded') {
      return
    }

    const nextControlBar = new AMap.ControlBar(opts)
    map.addControl(nextControlBar)
    setControlBar(nextControlBar)

    return () => {
      try {
        if (controlBar) {
          map.removeControl(controlBar)
          setControlBar(null)
        }
      } catch (error) {}
    }
  }, [AMap, map, opts, controlBar, loadStatus])

  return controlBar
}

export const useAsyncAMapPlugin = (pluginNames: string[], callback?: any) => {
  const { map, AMap } = useAMapContext()
  const [loadStatus, setLoadStatus] = useState<'loading' | 'loaded' | ''>('')

  const promise = useMemo(() => {
    if (!AMap || !map || !pluginNames?.length || loadStatus !== '') {
      return
    }
    setLoadStatus('loading')
    return new Promise(async (resolve) => {
      AMap.plugin(pluginNames, async (e: any) => {
        await callback?.(map, e)
        resolve(e)
        setLoadStatus('loaded')
      })
    })
  }, [AMap, map, ...pluginNames, callback, loadStatus])

  return { promise, loadStatus }
}
