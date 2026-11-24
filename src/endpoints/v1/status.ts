import { ApiV1 } from "../../api/api"
import { ApiResponse } from "./apiResponse"
import { StatusResponse } from "./responses/status"
import { statusGetStatus } from "../../generated/sdk.gen"
import { call, clientFor } from "../../core/transport"
import type { Client } from "../../generated/client"

class StatusEndpoint {
    private readonly client: Client

    constructor(api: ApiV1) {
        this.client = clientFor(api)
    }

    /**
     * get the status of the API (no login needed)
     */
    public getStatus(): Promise<ApiResponse<StatusResponse>> {
        return call(statusGetStatus({ client: this.client, throwOnError: true })) as Promise<ApiResponse<StatusResponse>>
    }
}

export {
    StatusEndpoint
}
