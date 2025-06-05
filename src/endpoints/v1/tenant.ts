import axios, { AxiosError } from "axios"
import { ApiV1, ApiV1State } from "../../api/api"
import { Tenant, TenantsResponse } from "./responses/tenant"
import { ApiResponse } from "./apiResponse"

class TenantsEndpoints {
    private endpoint: string
    private readonly VERSION: string = "v1"
    private state : ApiV1State

    constructor(api: ApiV1) {
        this.endpoint = api.endpoint
        this.state = api.apiState     
    } 

    private getPath(path: string): string {
        return `${this.endpoint}/${this.VERSION}/tenants/${path}`
    }

    /**
     * Gets a tenant by its ID
     */
    public getById(tenantId: string): Promise<ApiResponse<Tenant>>{
        const path = this.getPath(`id/${tenantId}`)
        
        return axios.get<Tenant>(path, {
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

    /**
     * Gets all tenants owned by the account id
     */
    public getMy(): Promise<ApiResponse<TenantsResponse>>{
        const path = this.getPath(`my`)       
        return axios.get<TenantsResponse>(path,{
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
    TenantsEndpoints
}
