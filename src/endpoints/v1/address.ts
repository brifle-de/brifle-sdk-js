import { ApiV1 } from "../../api/api"
import { ApiResponse } from "./apiResponse"
import { AddressParseRequest } from "./requests/address"
import { ParsedAddressResponse } from "./responses/address"
import { addressParseAddress, addressParseAndExpandAddress } from "../../generated/sdk.gen"
import { call, clientFor } from "../../core/transport"
import type { Client } from "../../generated/client"

class AddressEndpoint {
    private readonly client: Client

    constructor(api: ApiV1) {
        this.client = clientFor(api)
    }

    /**
     * parses a postal address string into its parts
     * @param request - the address to parse
     */
    public parseAddress(request: AddressParseRequest): Promise<ApiResponse<ParsedAddressResponse>> {
        return call(addressParseAddress({ client: this.client, body: request, throwOnError: true })) as Promise<ApiResponse<ParsedAddressResponse>>
    }

    /**
     * parses a postal address string and returns all plausible variants
     * @param request - the address to parse
     */
    public parseAndExpandAddress(request: AddressParseRequest): Promise<ApiResponse<ParsedAddressResponse[]>> {
        return call(addressParseAndExpandAddress({ client: this.client, body: request, throwOnError: true })) as Promise<ApiResponse<ParsedAddressResponse[]>>
    }
}

export {
    AddressEndpoint
}
