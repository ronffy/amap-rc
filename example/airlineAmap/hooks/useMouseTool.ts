import { useAMapContext, useAsyncAMapPlugin } from 'amap-rc'
import { useAirlineStore } from '@/store/airline'
import { useEffect, useState } from 'react'

const lineOptions = {
  strokeColor: '#1677ff', //轮廓线颜色
  strokeOpacity: 1, //轮廓线透明度
  strokeWeight: 3, //轮廓线宽度
  strokeStyle: 'solid', //线样式还支持 'dashed'
  lineJoin: 'round', //折线拐点连接处样式
}

const genIcon = (AMap: any, image: string) =>
  new AMap.Icon({
    size: new AMap.Size(19, 31), //图标大小
    imageSize: new AMap.Size(19, 31),
    image,
  })

export const useMouseTool = () => {
  const { map, AMap } = useAMapContext()
  const [mouseTool, setMouseTool] = useState<any>()
  const { updateState } = useAirlineStore()
  const { loadStatus } = useAsyncAMapPlugin(['AMap.MouseTool'])

  useEffect(() => {
    if (!map || !AMap || mouseTool || loadStatus !== 'loaded') {
      return
    }

    // 鼠标工具
    const _mouseTool = new AMap.MouseTool(map)
    _mouseTool.rule({
      polyOption: lineOptions,
      startMarkerOptions: {
        icon: genIcon(AMap, '//webapi.amap.com/theme/v1.3/markers/b/start.png'),
        offset: new AMap.Pixel(-9, -31),
      },
      endMarkerOptions: {
        icon: genIcon(AMap, '//webapi.amap.com/theme/v1.3/markers/b/end.png'),
        offset: new AMap.Pixel(-9, -31),
      },
      midMarkerOptions: {
        icon: genIcon(AMap, '//webapi.amap.com/theme/v1.3/markers/b/mid.png'),
        offset: new AMap.Pixel(-9, -31),
      },
      lineOptions: lineOptions,
      tmpLineOptions: lineOptions,
    })
    //鼠标工具插件加载完毕后，将鼠标工具插件绑定到地图容器中
    _mouseTool.on('draw', function (event: any) {
      // TODO：过滤重复项
      updateState({
        drawed: true,
        waypointLatLonList: event.obj.$x?.[0],
      })
      _mouseTool?.close?.(true)
    })

    setMouseTool(_mouseTool)

    return () => {
      if (mouseTool) {
        mouseTool?.close?.(true)
      }
    }
  }, [map, AMap, mouseTool, loadStatus])

  return mouseTool
}
