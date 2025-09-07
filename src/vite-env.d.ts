import 'vite/client'

export {}

declare global {
  interface Window {
    router: any
    setAuthState?: (value: boolean) => void
  }
}
