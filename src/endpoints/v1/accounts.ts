import axios, { AxiosError } from "axios"
import { ApiV1, ApiV1State } from "../../api/api"
import { AccountInfo } from "./responses/accounts"
import { ApiResponse } from "./apiResponse"

class AccountsEndpoints {
    private endpoint: string
    private readonly VERSION: string = "v1"
    private state : ApiV1State

    constructor(api: ApiV1) {
        this.endpoint = api.endpoint
        this.state = api.apiState     
    } 

    private getPath(path: string): string {
        return `${this.endpoint}/${this.VERSION}/accounts/${path}`
    }

    /**
     * Gets a tenant by its ID
     */
    public getById(accountId: string): Promise<ApiResponse<AccountInfo>>{
        const path = this.getPath(`${accountId}`)
        console.log(path, path)
        
        return axios.get<AccountInfo>(path, {
            headers: {
                "Authorization": `Bearer ${this.state.auth_token}`,
                "Content-Type": "application/json"
            }
        })
            .then((response) => {
                return ApiResponse.success(response.data)
            })
            .catch((error : AxiosError) => {                
                return ApiResponse.errorAxios(error)
            })            
    }   
}

export {
    AccountsEndpoints
}
