import React, { createContext, useContext, useRef } from 'react';

const DataCacheContext = createContext();

export const DataCacheProvider = ({ children }) => {
  const cache = useRef({});

  const getCachedData = async (key, fetchFunction) => {
    if (cache.current[key]) {
      console.log(`[CACHE HIT] for ${key}`);
      return cache.current[key];
    }

    console.log(`[CACHE MISS] for ${key}`);
    const data = await fetchFunction();
    cache.current[key] = data;
    return data;
  };

  return (
    <DataCacheContext.Provider value={{ getCachedData }}>
      {children}
    </DataCacheContext.Provider>
  );
};

export const useDataCache = () => useContext(DataCacheContext);
