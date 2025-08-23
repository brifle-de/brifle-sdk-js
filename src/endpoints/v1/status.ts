import axios, { AxiosError } from "axios"
import { ApiV1, ApiV1State } from "../../api/api"
import { ApiResponse } from "./apiResponse"
import { StatusResponse } from "./responses/status"


class StatusEndpoint {
    private endpoint: string
    private readonly VERSION: string = "v1"
    private state : ApiV1State

    constructor(api: ApiV1) {
            this.endpoint = api.endpoint
            this.state = api.apiState     
    } 

    private getPath(path: string): string {
        return `${this.endpoint}/${this.VERSION}/status/${path}`
    }

    /**
     * 
     * @returns the 
     */
    public getStatus(): Promise<ApiResponse<StatusResponse>> {
        const path = this.getPath("")
        return axios.get<StatusResponse>(path) 
            .then((response) => {
                return ApiResponse.success(response.data)
            })
            .catch((error : AxiosError) => {                
                return ApiResponse.errorAxios(error)
            })  
    }

}

export {
    StatusEndpoint
}