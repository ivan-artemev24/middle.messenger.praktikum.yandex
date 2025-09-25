// Silence console noise during tests; opt-in per test when needed
const originalError = console.error
const originalWarn = console.warn

beforeAll(() => {
  console.error = (...args) => {
    if (args.join(' ').includes('Route for path') || args.join(' ').includes('Router.go')) return
    originalError.call(console, ...args)
  }
  console.warn = (...args) => {
    if (args.join(' ').includes('Route for path') || args.join(' ').includes('Router.go')) return
    originalWarn.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
  console.warn = originalWarn
})


