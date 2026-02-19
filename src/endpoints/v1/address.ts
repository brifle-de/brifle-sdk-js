import axios, { AxiosError } from "axios"
import { ApiV1, ApiV1State } from "../../api/api"
import { ApiResponse } from "./apiResponse"
import { StatusResponse } from "./responses/status"
import { AddressParseRequest } from "./requests/address"
import { ParsedAddressResponse } from "./responses/address"


class AddressEndpoint {
    private endpoint: string
    private readonly VERSION: string = "v1"
    private state : ApiV1State

    constructor(api: ApiV1) {
            this.endpoint = api.endpoint
            this.state = api.apiState     
    } 

    private getPath(path: string): string {
        return `${this.endpoint}/${this.VERSION}/address/${path}`
    }

    /**
     * parses an address and returns the parsed address
     * @param request - The address to parse
     * @return the parsed address
     */
    public parseAddress(request: AddressParseRequest): Promise<ApiResponse<ParsedAddressResponse>> {
        const path = this.getPath("parse")
        return axios.post<ParsedAddressResponse>(path, request, {
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
     * parses an address and returns the parsed address and the expanded address
     * @param request - The address to parse and expand
     * @return the parsed and expanded address
     */
    public parseAndExpandAddress(request: AddressParseRequest): Promise<ApiResponse<ParsedAddressResponse[]>> {
        const path = this.getPath("parse_and_expand")
        return axios.post<ParsedAddressResponse[]>(path, request, {
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
    AddressEndpoint
}