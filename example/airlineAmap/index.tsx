import styles from './index.less'
import { useAirlineStore } from '@/store/airline'
import classNames from 'classnames'
import {
  APILoader,
  Map,
  useAMapContext,
  useScale,
  useToolBar,
  useControlBar,
  Polyline,
  Marker,
} from 'amap-rc'
import FsyPolylineEditor from './fsyPolylineEditor'
import { useMouseTool } from './hooks/useMouseTool'
import { useEffect, useRef } from 'react'
import {
  getBoundsForAmap,
  getSouthWestNorthEastLatLng,
} from '@/components/leaflet'
import FsyText from './fsyText'
import { DefaultLatLngCenter } from '@/constants/gis'
import { Checkbox } from 'antd'

/**
 * 支持的缩放级别范围
 */
const zooms: [number, number] = [2, 19]

const AMapMountEdit = () => {
  const { waypointLatLonList, drawed } = useAirlineStore()

  useMouseTool()

  if (drawed) {
    return (
      <>
        <Polyline
          key="edit"
          path={waypointLatLonList}
          strokeColor="#1677ff"
          strokeOpacity={1} //轮廓线透明度
          strokeWeight={3} //轮廓线宽度
          strokeStyle="solid" //线样式还支持 'dashed'
          lineJoin="round" //折线拐点连接处样式
        >
          <FsyPolylineEditor open={drawed} />
        </Polyline>
        <FsyText />
      </>
    )
  }

  return null
}

const AMapMountPreview = () => {
  const { AMap } = useAMapContext()
  const { waypointLatLonList } = useAirlineStore()

  return (
    <>
      {waypointLatLonList.map((lnglat, i) => (
        <Marker
          key={i + lnglat.join('-')}
          position={lnglat}
          offset={new AMap.Pixel(-13, -30)} //以 icon 的 [center bottom] 为原点
          content={`<div class="${styles.markerIcon}">${i + 1}</div>`}
        />
      ))}
      <Polyline
        key="preview"
        path={waypointLatLonList}
        strokeColor="#1677ff"
        strokeOpacity={1} //轮廓线透明度
        strokeWeight={3} //轮廓线宽度
        strokeStyle="solid" //线样式还支持 'dashed'
        lineJoin="round" //折线拐点连接处样式
      />

      <FsyText />
    </>
  )
}

const AMapMount = () => {
  const { map, AMap } = useAMapContext()
  const { waypointActStatus, waypointLatLonList, hangarList, updateState } =
    useAirlineStore()
  const firstHangar = hangarList?.[0]

  useToolBar()
  useScale()
  useControlBar()

  // 初始化时，设置地图展示范围
  useEffect(() => {
    if (!map) {
      return
    }
    const currLatLon: [number, number] = [
      firstHangar?.lat ? Number(firstHangar?.lat) : DefaultLatLngCenter.lat,
      firstHangar?.lon ? Number(firstHangar?.lon) : DefaultLatLngCenter.lon,
    ]

    const timer = setTimeout(() => {
      const currBounds = getBoundsForAmap(currLatLon, currLatLon)
      map?.setBounds(currBounds)
    }, 400)
    return () => {
      clearTimeout(timer)
    }
  }, [map, firstHangar])

  // 根据航点列表，设置地图展示范围
  useEffect(() => {
    if (
      !map ||
      waypointActStatus !== 'preview' ||
      !waypointLatLonList?.length
    ) {
      return
    }
    // 根据桩坐标，计算经纬度的西南角和东北角坐标
    const [southWest, northEast] = getSouthWestNorthEastLatLng(
      waypointLatLonList.map(([lon, lat]) => ({
        lat,
        lng: lon,
      }))
    )

    if (!southWest || !northEast) {
      return
    }

    const currBounds = getBoundsForAmap(southWest, northEast)
    // 设置地图的视图范围
    const timer = setTimeout(() => {
      map?.setBounds(currBounds)
    }, 300)
    return () => {
      clearTimeout(timer)
    }
  }, [map, waypointActStatus, waypointLatLonList])

  useEffect(() => {
    if (waypointActStatus !== 'add' && waypointActStatus !== 'edit') {
      updateState({
        drawed: false,
      })
    }
  }, [waypointActStatus])

  return (
    <>
      {(waypointActStatus === 'add' || waypointActStatus === 'edit') && (
        <AMapMountEdit />
      )}
      {waypointActStatus === 'preview' && waypointLatLonList?.length && (
        <AMapMountPreview />
      )}
    </>
  )
}

export default function AirlineAmap() {
  const { waypointActStatus } = useAirlineStore()
  const mapRef = useRef<{
    map: any
  }>()

  const handleChangeLayers = (value: boolean) => {
    const satellite = mapRef.current?.map
      ?.getLayers()
      .find((layer: any) => layer.CLASS_NAME === 'AMap.TileLayer.Satellite')
    if (!value) {
      satellite?.hide()
    } else {
      satellite?.show()
    }
  }

  return (
    <div
      className={classNames(styles.amap, {
        [styles.pr]: !!waypointActStatus,
      })}
    >
      <APILoader akey="a525b3549c007d3820892b2bd27b2719" version="2.0">
        <Map
          ref={mapRef}
          viewMode="3D"
          zoom={4}
          zooms={zooms}
          resizeEnable
          rotateEnable
          pitchEnable
          // 如果不使用 completed 控制，每次事件增加 mark 后，地图会平移到 center 位置
          center={[DefaultLatLngCenter.lat, DefaultLatLngCenter.lon]}
          layers={(AMap) => [
            new AMap.TileLayer({
              zooms,
            }),
            new AMap.TileLayer.Satellite({
              zooms,
            }),
            new AMap.TileLayer.RoadNet({
              zooms,
              opacity: 0.5,
              zIndex: 1,
            }),
          ]}
        >
          <AMapMount />
        </Map>
      </APILoader>
      <div className={styles.toolbar}>
        开启卫星
        <Checkbox
          defaultChecked
          onChange={(e) => handleChangeLayers(e.target.checked)}
        />
      </div>
    </div>
  )
}
