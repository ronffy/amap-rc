import { Text, useAMapContext } from 'amap-rc'
import { useAirlineStore } from '@/store/airline'
import { calcDistance } from '@/utils/leaflet'
import { round } from 'lodash'

export default function FsyText() {
  const { AMap } = useAMapContext()
  const { waypointLatLonList } = useAirlineStore()

  return waypointLatLonList
    .map((lnglat, i) => {
      if (i === 0) {
        return null
      }
      const distance = calcDistance(
        [waypointLatLonList[i - 1][1], waypointLatLonList[i - 1][0]],
        [waypointLatLonList[i][1], waypointLatLonList[i][0]]
      )

      const textProps = {
        style: {
          'background-color': '#29b6f6',
          'border-color': '#e1f5fe',
          'font-size': '12px',
        },
        class: 'amap-marker-label',
        className: 'aaa',
        text: round(distance, 2) + 'm',
        position: waypointLatLonList[i],
        offset: new AMap.Pixel(11, -13),
      }
      return <Text {...textProps} key={i + lnglat.join('-')} />
    })
    .filter(Boolean)
}
