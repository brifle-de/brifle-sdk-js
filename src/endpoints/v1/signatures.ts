import axios, { AxiosError } from "axios"
import { ApiV1, ApiV1State } from "../../api/api"
import { CreateSignatureReferenceRequest } from "./requests/signatures"
import { ApiResponse } from "./apiResponse"

class SignaturesEndpoint {
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
        return `${this.endpoint}/${this.VERSION}/signature/${path}`        
    }

    
    /**
     * creates a signature reference
     * @param tenantId - The id of the tenant
     * @param request - The request object
     * @returns the response object
     */
    public createSignatureReference(tenantId: string, request: CreateSignatureReferenceRequest) : Promise<ApiResponse<CreateSignatureReferenceResponse>> {
        const path = this.getPath(`${tenantId}/reference`)
        const headers = {
            "Authorization": `Bearer ${this.state.auth_token}`,
        }
        console.log(tenantId)
        return axios.post<CreateSignatureReferenceResponse>(path, request, { headers })
            .then((response) => {
                return ApiResponse.success(response.data)
            })
            .catch((error : AxiosError) => {
                return ApiResponse.errorAxios(error)
            }
        );
    }

    /**
     * gets a signature reference
     * @param signatureId - The id of the signature
     * @returns the response object
     */
    public exportSignature(signatureId: string, format: 'xml'): Promise<ApiResponse<any>> {
        const path = this.getPath(`${signatureId}/export/${format}`)
        const headers = {
            "Authorization": `Bearer ${this.state.auth_token}`,
        }
        return axios.get<any>(path, { headers })
            .then((response) => {
                return ApiResponse.success(response.data)
            })
            .catch((error : AxiosError) => {
                return ApiResponse.errorAxios(error)
            }
        );            
    }
}

export {SignaturesEndpoint};