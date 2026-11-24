import { ApiV1 } from "../../src"
import { body, ENDPOINT, lastRequest, mockedApi } from "./helpers"

describe("authentication", () => {
    it("stores the token and computes the expiry from created_at + expires_in", async () => {
        const { api, mock } = mockedApi("")
        mock.onPost(`${ENDPOINT}/v1/auth/login`).reply(200, {
            access_token: "abc", created_at: "2026-11-24T10:00:00.000Z", expires_in: 7200,
            refresh_token: "r", scope: "content.read", token_type: "bearer",
        })
        const res = await api.authentication().login({ key: "k", secret: "s" })
        expect(res.isSuccess).toBe(true)
        expect(res.data?.access_token).toBe("abc")
        expect(api.apiState.auth_token).toBe("abc")
        expect(api.apiState.auth_token_expire_date?.toISOString()).toBe("2026-11-24T12:00:00.000Z")
        expect(body(mock)).toEqual({ key: "k", secret: "s" })
    })

    it("maps an error body to code, message and HTTP status", async () => {
        const { api, mock } = mockedApi("")
        mock.onPost(`${ENDPOINT}/v1/auth/login`).reply(401, { code: 40101, message: "login failed" })
        const res = await api.authentication().login({ key: "k", secret: "wrong" })
        expect(res.isError).toBe(true)
        expect(res.error).toEqual({ code: 40101, message: "login failed", status: 401 })
        expect(api.apiState.auth_token).toBe("")
    })

    it("reports a network failure as 50000", async () => {
        const { api, mock } = mockedApi("")
        mock.onPost(`${ENDPOINT}/v1/auth/login`).networkError()
        const res = await api.authentication().login({ key: "k", secret: "s" })
        expect(res.error).toEqual({ code: 50000, message: "Unknown error", status: 500 })
    })

    it("logout revokes and forgets the instance's own token", async () => {
        const { api, mock } = mockedApi("abc")
        mock.onPost(`${ENDPOINT}/v1/auth/logout`).reply(200, {})
        const res = await api.authentication().logout()
        expect(res.isSuccess).toBe(true)
        expect(body(mock)).toEqual({ token: "abc" })
        expect(api.apiState.auth_token).toBeUndefined()
    })

    it("logout without a token does not call the API", async () => {
        const api = new ApiV1(ENDPOINT)
        const res = await api.authentication().logout()
        expect(res.isSuccess).toBe(true)
    })

    it("sends the token of the instance as bearer token", async () => {
        const { api, mock } = mockedApi("tok-1")
        mock.onGet(`${ENDPOINT}/v1/tenants/my`).reply(200, { tenants: [], total: 0 })
        await api.tenants().getMy()
        expect(lastRequest(mock)?.headers?.Authorization).toBe("Bearer tok-1")
        api.apiState.auth_token = "tok-2"
        await api.tenants().getMy()
        expect(lastRequest(mock)?.headers?.Authorization).toBe("Bearer tok-2")
    })

    it("strips a trailing slash from the endpoint", async () => {
        const api = new ApiV1(`${ENDPOINT}/`)
        expect(api.endpoint).toBe(ENDPOINT)
    })
})
