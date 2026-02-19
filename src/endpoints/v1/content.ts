import axios, { AxiosError, AxiosResponse } from "axios"
import { ApiResponse } from "./apiResponse"
import { CheckMultipleReceiversResponse, CheckReceiverResponse, ContentActionsResponse, ContentResponse, CoverLetterOverviewItem, CoverLetterOverviewResponse, DeliveryCertificateResponse, DeliveryStatusResponse, SendContentResponse } from "./responses/content"
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
     * checks if a receivers are existing in Brifle
     * @param receivers - The receiver object to check
     * @returns 
     */
    public checkMultipleReceivers(receivers: ReceiverRequest[]) : Promise<ApiResponse<CheckMultipleReceiversResponse>> {
        const path = this.getPath(`receiver/check/bulk`)
        const body = {
            receivers: receivers
        }
        return axios.post<CheckMultipleReceiversResponse>(path, body, {
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

    /**
     * list all cover letters for a tenant
     * @param tenantId - The tenant id
     * @returns 
     */
    public listCoverLetters(tenantId: string): Promise<ApiResponse<CoverLetterOverviewResponse>> {
        const path = this.getPath(`cover_letter/${tenantId}/list`)
        return axios.get<CoverLetterOverviewResponse>(path, {
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
     * create a custom cover letter for a tenant
     * @param tenantId - The tenant id
     * @param name - The name of the cover letter
     * @param base64Content - The content of the cover letter in base64 encoding
     * @param description - The description of the cover letter (optional)
     * @returns 
     */
    public createCoverLetter(tenantId: string, name: string, base64Content: string, description?: string)
    : Promise<ApiResponse<CoverLetterOverviewItem>> {
        const path = this.getPath(`cover_letter/${tenantId}/custom/new`)       
        const req = {
            name: name,
            data: base64Content,
            description: description
        }
        return axios.post<CoverLetterOverviewItem>(path, req, {
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
     * delete a custom cover letter
     * 
     */
    public deleteCoverLetter(tenantId: string, name: string): Promise<ApiResponse<void>> {
        const path = this.getPath(`cover_letter/${tenantId}/custom/${name}/delete`)
        return axios.delete(path, {
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
     * get the content of a cover letter
     * @param tenantId - The tenant id
     * @param type - The type of the cover letter (custom | default)
     * @param name - The name of the cover letter
     * @param encoding - The encoding of the cover letter (base64 | pdf)
     * @returns 
     */
    public getCoverLetterContent(tenantId: string, type: 'custom' | 'default', name: string, encoding: 'base64' | 'pdf'): Promise<AxiosResponse<string | Blob>> {
        const path = this.getPath(`cover_letter/${tenantId}/${type}/${name}/${encoding}`)
        return axios.get<Blob>(path, {
            headers: {
                "Authorization": `Bearer ${this.state.auth_token}`
            },
            responseType: 'blob'
        })
    }

    /**
     * get the delivery certificate for a document
     * @param documentId - The id of the document
     * @returns 
     */
    public getDeliveryCertificate(documentId: string): Promise<ApiResponse<DeliveryCertificateResponse>> {
        const path = this.getPath(`document/${documentId}/delivery_certificate`)
        return axios.get<DeliveryCertificateResponse>(path, {
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
     * get the delivery status of a document
     * @param documentId - The id of the document
     * @returns 
     */
    public getDeliveryStatus(documentId: string): Promise<ApiResponse<DeliveryStatusResponse>> {
        const path = this.getPath(`document/${documentId}/delivery_status`)
        return axios.get<DeliveryStatusResponse>(path, {
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