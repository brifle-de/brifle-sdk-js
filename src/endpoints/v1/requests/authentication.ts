export interface LoginRequest {
    key: string
    secret: string
}

export interface LogoutRequest {
    token: string
}