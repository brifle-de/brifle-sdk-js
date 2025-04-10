import { ApiV1, ApiV1State } from "../../api/api"
import { ApiResponse } from "./apiResponse"
import { LoginRequest } from "./requests/authentication"
import { LoginResponse } from "./responses/authentication"

import axios, { AxiosError } from "axios"

class AuthenticationEndpoints {
    private endpoint: string
    private readonly VERSION: string = "v1"
    private state : ApiV1State

    constructor(api: ApiV1) {
        this.endpoint = api.endpoint
        this.state = api.apiState
    } 

    /**
     * builds the full path
     * @param path - The path to the endpoint, e.g. "authentication/login"
     * @returns 
     */
    private getPath(path: string): string {
        return `${this.endpoint}/${this.VERSION}/auth/${path}`
    }

    /**
     * login to the API
     * @param loginRequest - The login request object
     * @returns the login response object
     */
    public login(loginRequest: LoginRequest) : Promise<ApiResponse<LoginResponse>> {
        const path = this.getPath("login")
        // axios.post(path, loginRequest)
        return axios.post<LoginResponse>(path, loginRequest)
            .then((response) => {
                return ApiResponse.success(response.data)
            }).then((response) => {
                const at = response.data?.access_token 
                this.state.auth_token = at
                const expire_in = (response.data?.expires_in?? 0) * 1000
                const issue_time = new Date(response.data?.created_at?? new Date()).getMilliseconds()                
                const expires_milli = issue_time + expire_in
                this.state.auth_token_expire_date = new Date(expires_milli);
                return response
            })
            .catch((error : AxiosError) => {                
                return ApiResponse.errorAxios(error)
            })
    }

}

export {
    AuthenticationEndpoints
}