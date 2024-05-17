import React, { useContext } from 'react'

export const AMapContext = React.createContext<{
  AMap: any
  map: any
}>({
  AMap: null,
  map: null,
})

export function useAMapContext() {
  return useContext(AMapContext)
}
