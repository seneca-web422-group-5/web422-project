import React, { createContext, useContext, useRef } from 'react'

const DataCacheContext = createContext()

export const DataCacheProvider = ({ children }) => {
  const cache = useRef({})

  const getCachedData = async (key, fetchFunction) => {
    if (cache.current[key]) {
      return cache.current[key]
    }

    const data = await fetchFunction()
    cache.current[key] = data
    return data
  }

  return <DataCacheContext.Provider value={{ getCachedData }}>{children}</DataCacheContext.Provider>
}

export const useDataCache = () => useContext(DataCacheContext)
