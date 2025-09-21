import { Platform } from 'react-native';
import { idTokenStorage, tokenStorage } from './../../../apps/mobile/repos/store';

const baseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000'

export type FetchOptions = {
  baseURL?: string
  headers?: Record<string, string>
  url: string
  method:
    | "get"
    | "post"
    | "put"
    | "delete"
    | "patch"
    | "GET"
    | "POST"
    | "PUT"
    | "DELETE"
    | "PATCH"
  params?: Record<string, unknown>
  data?: unknown
  responseType?: string
  signal?: AbortSignal
}

export type FetchResponse<T = unknown> = T

export type FetchError<T = unknown> = {
  data: T
  status: number
}

function createUrlParams(params: Record<string, unknown>): string {
  const urlParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // For array values, append each item separately
      value.forEach((item) => {
        urlParams.append(key, item)
      })
    } else {
      // For non-array values, add normally
      urlParams.append(key, String(value))
    }
  })

  return urlParams.toString()
}

export function getResponseBody<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type")

  if (contentType && contentType.includes("application/json")) {
    return response.json()
  }

  if (contentType) {
    if (
      [
        "application/pdf",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(contentType) ||
      contentType?.startsWith("image")
    ) {
      return response.blob() as Promise<T>
    }
  }
  return response.text() as Promise<T>
}

export async function fetchInstance<T>(
  config: FetchOptions,
  init?: RequestInit
): Promise<FetchResponse<T>> {
  const isFormData = config.headers?.["Content-Type"] === "multipart/form-data"
  const isJson = config.headers?.["Content-Type"] === "application/json"

  // Retrieve the token from local storage
  const token = await idTokenStorage.getIdToken()

  // Build headers, including authorization with token
  const headers = {
    authorization: config.headers?.authorization ?? `Bearer ${token}`,
    ...config.headers,
    ...(isJson ? { "Content-Type": "application/json" } : {}),
  }

  // Remove Content-Type header if it's not needed to avoid issues
  if (!isJson) {
    delete headers["Content-Type"]
  }

  const response = await fetch(
    `${baseUrl}${config.url}${config.params ? `?${createUrlParams(config.params)}` : ""}`,
    {
      method: config.method,
      ...(config.data
        ? {
            body: !isFormData
              ? JSON.stringify(config.data)
              : (config.data as BodyInit),
          }
        : {}),
      headers,
      signal: config.signal,
      ...init,
    }
  )

  const data = await getResponseBody<T>(response)

  if (!response.ok) {
    if (response.status === 401) {
      try {
        const idToken = await idTokenStorage.getIdToken()

        const retryHeaders = {
          ...headers,
          authorization: `Bearer ${idToken}`,
        }

        const retryResponse = await fetch(
          `${baseUrl}${config.url}${config.params ? `?${createUrlParams(config.params)}` : ""}`,
          {
            method: config.method,
            ...(config.data
              ? {
                  body: !isFormData
                    ? JSON.stringify(config.data)
                    : (config.data as BodyInit),
                }
              : {}),
            headers: retryHeaders,
            signal: config.signal,
            ...init,
          }
        )

        const retryData = await getResponseBody<T>(retryResponse)
        
        if (retryResponse.ok) {
          return retryData
        } else {
          throw {
            status: retryResponse.status,
            data: retryData,
          }
        }

      } catch (error) {
        console.error("Failed to inner fetch:", error)
        throw error
      }
    }

    console.error("Failed to fetch:", response.status, data)

    throw {
      status: response.status,
      data,
    }
  }

  return data
}