import { useSyncExternalStore } from 'react'

function subscribe(onStoreChange: () => void) {
  window.addEventListener('popstate', onStoreChange)
  return () => window.removeEventListener('popstate', onStoreChange)
}

function getLocationSnapshot() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`
}

export function useCurrentLocation() {
  return useSyncExternalStore(subscribe, getLocationSnapshot, () => '/')
}

export function navigate(to: string) {
  const destination = new URL(to, window.location.href)
  if (destination.origin !== window.location.origin) {
    window.location.assign(destination.href)
    return
  }

  const nextLocation = `${destination.pathname}${destination.search}${destination.hash}`
  if (nextLocation === getLocationSnapshot()) return

  window.history.pushState(null, '', nextLocation)
  window.dispatchEvent(new PopStateEvent('popstate'))
}
