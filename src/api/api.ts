import { AuthenticationEndpoints } from "../endpoints/v1/authentication"
import { ContentEndpoints } from "../endpoints/v1/content"
import { SignaturesEndpoint } from "../endpoints/v1/signatures"

enum ENDPOINTS {
    SANDBOX = "https://sandbox-api.brifle.de",
    PRODUCTION = "https://api.brifle.de",
}

class ApiV1 {

    public readonly endpoint: string
    public readonly apiState: ApiV1State

    constructor(endpoint: string) {
        if(endpoint.endsWith("/")) {
            this.endpoint = endpoint.slice(0, -1)
        }else{
            this.endpoint = endpoint
        } 
        this.apiState = {}
    }

    public static get sandbox() {
        return new ApiV1(ENDPOINTS.SANDBOX)
    }

    public static get production() {
        return new ApiV1(ENDPOINTS.PRODUCTION)
    }

    /**
     * gets an instance of the AuthenticationEndpoints
     * @returns AuthenticationEndpoints
     */
    public authentication() : AuthenticationEndpoints {
        return new AuthenticationEndpoints(this)
    }

    /**
     * gets an instance of the ContentEndpoints
     * @returns ContentEndpoints
     */
    public content() : ContentEndpoints {
        return new ContentEndpoints(this)
    }

    /**
     * gets an instance of the SignatureEndpoints
     * @returns ContentEndpoints
     */
    public signature() : SignaturesEndpoint {
        return new SignaturesEndpoint(this)
    }

}

export interface ApiV1State {
    auth_token?: string
    auth_token_expire_date?: Date
}

export {
    ApiV1
}