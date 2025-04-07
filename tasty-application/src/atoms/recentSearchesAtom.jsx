import { atom } from 'jotai'

// const storedSearches = JSON.parse(localStorage.getItem('recentSearches')) || []
// export const recentSearchesAtom = atom(storedSearches)

export const recentSearchesAtom = atom([])