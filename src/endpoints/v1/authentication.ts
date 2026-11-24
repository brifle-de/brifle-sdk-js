import { ApiV1, ApiV1State } from "../../api/api"
import { ApiResponse } from "./apiResponse"
import { LoginRequest, LogoutRequest } from "./requests/authentication"
import { LoginResponse } from "./responses/authentication"
import { authCreate, authRevoke } from "../../generated/sdk.gen"
import { call, clientFor } from "../../core/transport"
import type { Client } from "../../generated/client"

class AuthenticationEndpoints {
    private readonly client: Client
    private readonly state: ApiV1State

    constructor(api: ApiV1) {
        this.client = clientFor(api)
        this.state = api.apiState
    }

    /**
     * login to the API. The token is kept on the ApiV1 instance and used by all
     * its endpoints.
     * @param loginRequest - The login request object
     * @returns the login response object
     */
    public login(loginRequest: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        return call(authCreate({ client: this.client, body: loginRequest, throwOnError: true }))
            .then((response) => {
                const data = response.data as LoginResponse | undefined
                if (data) {
                    this.state.auth_token = data.access_token
                    const issued = Date.parse(data.created_at)
                    const start = Number.isNaN(issued) ? Date.now() : issued
                    this.state.auth_token_expire_date = new Date(start + (data.expires_in ?? 0) * 1000)
                }
                return response as ApiResponse<LoginResponse>
            })
    }

    /**
     * revokes a token. Without a request the token of this ApiV1 instance is
     * revoked and forgotten.
     * @param logoutRequest - the token to revoke (optional)
     */
    public logout(logoutRequest?: LogoutRequest): Promise<ApiResponse<Record<string, unknown>>> {
        const token = logoutRequest?.token ?? this.state.auth_token
        if (!token) {
            return Promise.resolve(ApiResponse.success({}))
        }
        return call(authRevoke({ client: this.client, body: { token }, throwOnError: true }))
            .then((response) => {
                if (response.isSuccess && token === this.state.auth_token) {
                    this.state.auth_token = undefined
                    this.state.auth_token_expire_date = undefined
                }
                return response as ApiResponse<Record<string, unknown>>
            })
    }
}

export {
    AuthenticationEndpoints
}
