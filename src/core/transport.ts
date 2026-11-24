import { AxiosError } from "axios"
import { createClient, createConfig, type Client } from "../generated/client"
import { ApiResponse } from "../endpoints/v1/apiResponse"
import type { ApiV1 } from "../api/api"

/**
 * The bridge between the stable public endpoints (src/endpoints) and the
 * generated low-level client (src/generated). Internal: not exported from the
 * package entry point, so the generated layer can change with the spec without
 * changing the public API.
 */

const clients = new WeakMap<ApiV1, Client>()

/**
 * The generated client for one ApiV1 instance. It is created on first use and
 * shared by all endpoint objects of that instance, so they see the same token
 * (`api.apiState.auth_token`).
 */
export function clientFor(api: ApiV1): Client {
    let client = clients.get(api)
    if (!client) {
        client = createClient(createConfig({
            baseURL: api.endpoint,
            auth: () => api.apiState.auth_token,
        }))
        clients.set(api, client)
    }
    return client
}

/** `arraybuffer` in Node, `blob` in a browser: what the 0.3 SDK returned for binary responses. */
export function binaryResponseType(): "blob" | "arraybuffer" {
    const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined"
    return isBrowser ? "blob" : "arraybuffer"
}

/**
 * Runs a generated call (with `throwOnError: true`) and wraps the outcome in an
 * ApiResponse exactly as the 0.3 SDK did: the body on success, `{code, message,
 * status}` from the error body otherwise. `map` turns the wire format into the
 * public type.
 */
export async function call<Wire, Public = Wire>(
    request: Promise<{ data: Wire }>,
    map?: (data: Wire) => Public,
): Promise<ApiResponse<Public>> {
    let data: Wire
    try {
        data = (await request).data
    } catch (error) {
        return ApiResponse.errorAxios<Public>(error as AxiosError)
    }
    return ApiResponse.success(map ? map(data) : (data as unknown as Public))
}
