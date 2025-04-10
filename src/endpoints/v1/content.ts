import axios, { AxiosError } from "axios"
import { ApiResponse } from "./apiResponse"
import { CheckReceiverResponse, ContentActionsResponse, ContentResponse, SendContentResponse } from "./responses/content"
import { ApiV1, ApiV1State } from "../../api/api"
import { ReceiverRequest, SendContentRequest } from "./requests/content"

class ContentEndpoints {
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
        return `${this.endpoint}/${this.VERSION}/content/${path}`        
    }

    /**
     * get the content of a document
     * @param documentId - The id of the document
     * @returns the content of the document
     */
    public getContent(documentId: string) : Promise<ApiResponse<ContentResponse>> {
        const path = this.getPath(`document/${documentId}`)
        return axios.get<ContentResponse>(path, {
            headers: {
                "Authorization": `Bearer ${this.state.auth_token}`
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
     * get the actions of a document
     * @param documentId - The id of the document
     * @returns the actions of the document
     */
    public getContentActions(documentId: string) : Promise<ApiResponse<ContentActionsResponse>> {
        const path = this.getPath(`document/${documentId}/actions`)
        return axios.get<ContentActionsResponse>(path, {
                headers: {
                    "Authorization": `Bearer ${this.state.auth_token}`
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
     * checks if a receiver is existing in Brifle
     * @param receiver - The receiver object to check
     * @returns 
     */
    public checkReceiver(receiver: ReceiverRequest) : Promise<ApiResponse<CheckReceiverResponse>> {
        const path = this.getPath(`receiver/check`)
        return axios.post<CheckReceiverResponse>(path, receiver, {
            headers: {
                "Authorization": `Bearer ${this.state.auth_token}`
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
     * send a content to a receiver
     * @param tenantId - The tenant id of the receiver
     * @param request - The request object to send
     * @returns 
     */
    public sendContent(tenantId: string, request: SendContentRequest): Promise<ApiResponse<SendContentResponse>> {
        const path = this.getPath(`send/${tenantId}`)
        return axios.post<SendContentResponse>(path, request, {
            headers: {
                "Authorization": `Bearer ${this.state.auth_token}`
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
    ContentEndpoints
}