export class HTTPTransport {
  static API_URL = 'https://ya-praktikum.tech/api/v2'

  private async _request<TResponse>(url: string, options: RequestInit): Promise<TResponse> {
    const fullUrl = `${HTTPTransport.API_URL}${url}`

    // 🔍 Логируем запрос
    console.log('[HTTP REQUEST]', {
      url: fullUrl,
      method: options.method,
      headers: options.headers,
      body: options.body
    })

    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData

    return await fetch(fullUrl, {
      ...options,
      credentials: 'include', // для куки
      // Если отправляем FormData, не задаём Content-Type вручную
      headers: isFormData
        ? { ...((options.headers) ?? {}) }
        : { 'Content-Type': 'application/json', ...((options.headers) ?? {}) }
    })
      .then(async response => {
        const data = await response.json().catch(() => ({}))

        // 🔍 Логируем ответ
        console.log('[HTTP RESPONSE]', {
          url: fullUrl,
          status: response.status,
          ok: response.ok,
          data
        })

        if (!response.ok) throw data
        return data
      })
  }

  async get<T>(url: string): Promise<T> {
    return await this._request<T>(url, { method: 'GET' })
  }

  async post<T>(url: string, body?: any): Promise<T> {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
    return await this._request<T>(url, {
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body)
    })
  }

  async put<T>(url: string, body?: any): Promise<T> {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
    return await this._request<T>(url, {
      method: 'PUT',
      body: isFormData ? body : JSON.stringify(body)
    })
  }

  async delete<T>(url: string, body?: any): Promise<T> {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
    return await this._request<T>(url, {
      method: 'DELETE',
      body: isFormData ? body : JSON.stringify(body)
    })
  }
}
