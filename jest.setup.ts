// Silence console noise during tests; opt-in per test when needed
const originalError = console.error
const originalWarn = console.warn

beforeAll(() => {
  console.error = (...args: Parameters<typeof console.error>) => {
    const message = args.map((v) => String(v)).join(' ')
    if (message.includes('Route for path') || message.includes('Router.go')) return
    originalError.apply(console, args as unknown[])
  }
  console.warn = (...args: Parameters<typeof console.warn>) => {
    const message = args.map((v) => String(v)).join(' ')
    if (message.includes('Route for path') || message.includes('Router.go')) return
    originalWarn.apply(console, args as unknown[])
  }
})

afterAll(() => {
  console.error = originalError
  console.warn = originalWarn
})
