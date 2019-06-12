

import { useRef, useState, useEffect } from 'react'
import ResizeObserver from 'resize-observer-polyfill'
import { createBrowserHistory, createHashHistory } from 'history';

export function configureHistory() {
    return (typeof window !== 'undefined') && window.matchMedia('(display-mode: standalone)').matches
        ? createHashHistory()
        : createBrowserHistory()
}

export function useMeasure() {
  const ref = useRef()
  const [bounds, set] = useState({ left: 0, top: 0, width: 0, height: 0 })
  const [ro] = useState(() => new ResizeObserver(([entry]) => set(entry.contentRect)))
  useEffect(() => (ro.observe(ref.current), ro.disconnect), [])
  return [{ ref }, bounds]
}