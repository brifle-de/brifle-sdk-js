import axios, { AxiosError } from "axios"
import { ApiV1, ApiV1State } from "../../api/api"
import { InboxFilter, OutboxFilter } from "./requests/mailbox"
import { MailboxResponse } from "./responses/mailbox"
import { ApiResponse } from "./apiResponse"

class MailboxEndpoints {
    private endpoint: string
    private readonly VERSION: string = "v1"
    private state : ApiV1State

    constructor(api: ApiV1) {
        this.endpoint = api.endpoint
        this.state = api.apiState     
    } 

    private getPath(path: string): string {
        return `${this.endpoint}/${this.VERSION}/mailbox/${path}`
    }

    /**
     * Get the inbox of an account
     * @returns the mailbox response object
     */
    public getInbox(filter: InboxFilter, page: number = 1): Promise<ApiResponse<MailboxResponse>>{
        const path = this.getPath(`inbox`)
        const body = {
            filter: filter,
            page: page
        }
        return axios.post<MailboxResponse>(path, body,{
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

    public getOutbox(tenant:string, filter: OutboxFilter, page: number = 1): Promise<ApiResponse<MailboxResponse>>{
        const path = this.getPath(`outbox/${tenant}`)
        const body = {
            filter: filter,
            page: page
        }
        return axios.post<MailboxResponse>(path, body,{
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
    MailboxEndpoints
}
