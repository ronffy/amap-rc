import React, { useContext } from 'react'

export const PolylineContext = React.createContext<{
  polyline: any
}>({
  polyline: null,
})

export function usePolylineContext() {
  return useContext(PolylineContext)
}
