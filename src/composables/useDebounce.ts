import { customRef } from 'vue'

export function useDebouncedRef<T>(initialValue: T, delay = 300) {
  let timeout: ReturnType<typeof setTimeout>
  return customRef<T>((track, trigger) => ({
    get() {
      track()
      return initialValue
    },
    set(value: T) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        initialValue = value
        trigger()
      }, delay)
    },
  }))
}
