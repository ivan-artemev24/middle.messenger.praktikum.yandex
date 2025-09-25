import { HTTPTransport } from './http'

describe('HTTPTransport', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
    global.fetch = originalFetch as any
  })

  test('get() calls fetch with GET and returns parsed JSON', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: 1 })
    })
    const http = new HTTPTransport()
    const res = await http.get<{ ok: number }>('/test')
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/test'), expect.objectContaining({ method: 'GET', credentials: 'include' }))
    expect(res.ok).toBe(1)
  })

  test('post() sends JSON by default', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true, status: 200, json: async () => ({ created: true }) })
    const http = new HTTPTransport()
    const body = { a: 1 }
    const res = await http.post('/test', body)
    const [, options] = (global.fetch as jest.Mock).mock.calls[0]
    expect(options?.method).toBe('POST')
    expect(options?.headers).toMatchObject({ 'Content-Type': 'application/json' })
    expect(options?.body).toBe(JSON.stringify(body))
    expect((res as any).created).toBe(true)
  })

  test('post() keeps FormData without setting Content-Type', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({ ok: true, status: 200, json: async () => ({ ok: 1 }) })
    const http = new HTTPTransport()
    const fd = new FormData()
    fd.append('x', 'y')
    await http.post('/upload', fd)
    const [, options] = (global.fetch as jest.Mock).mock.calls[0]
    expect(options?.headers).not.toHaveProperty('Content-Type')
    expect(options?.body).toBe(fd)
  })

  test('throws parsed error body on non-ok response', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 400, json: async () => ({ reason: 'bad' }) })
    const http = new HTTPTransport()
    await expect(http.get('/bad')).rejects.toEqual({ reason: 'bad' })
  })
})
