const store: Record<string, {
  time: number;
  item: object;
}> = {}

const DEFAULT_CACHE_DURATION = 1000

const cache = {
  has (key: string) {
    if (key in store) {
      if (Date.now() - store[key].time < DEFAULT_CACHE_DURATION) {
        return true
      } else {
        delete store[key]
      }
    }
    return false
  },
  get (key: string) {
    if (!cache.has(key)) return null
    return store[key]
  },
  set (key: string, item: object) {
    store[key] = {
      time: Date.now(),
      item
    }
  }
}

export default cache
