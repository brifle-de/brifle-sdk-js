import MockAdapter from "axios-mock-adapter"
import type { InternalAxiosRequestConfig } from "axios"
import { ApiV1 } from "../../src/api/api"
import { clientFor } from "../../src/core/transport"

export const ENDPOINT = "https://api.test.brifle.local"

/** an ApiV1 whose HTTP traffic goes to a mock instead of the network */
export function mockedApi(token = "test-token"): { api: ApiV1, mock: MockAdapter } {
    const api = new ApiV1(ENDPOINT)
    api.apiState.auth_token = token
    const instance = clientFor(api).instance
    const mock = new MockAdapter(instance, { onNoMatch: "throwException" })
    const sent: InternalAxiosRequestConfig[] = []
    instance.interceptors.request.use((config) => { sent.push(config); return config })
    requests.set(mock, sent)
    return { api, mock }
}

const requests = new WeakMap<MockAdapter, InternalAxiosRequestConfig[]>()

/** the request sent last through this mock, whatever its method */
export function lastRequest(mock: MockAdapter): InternalAxiosRequestConfig | undefined {
    const sent = requests.get(mock) ?? []
    return sent[sent.length - 1]
}

export function body(mock: MockAdapter): any {
    const data = lastRequest(mock)?.data
    return typeof data === "string" ? JSON.parse(data) : data
}
