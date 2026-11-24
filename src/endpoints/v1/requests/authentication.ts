export interface LoginRequest {
    key: string
    secret: string
    /** space-separated scopes to request; default: all scopes of the api key */
    scopes?: string
}

export interface LogoutRequest {
    token: string
}