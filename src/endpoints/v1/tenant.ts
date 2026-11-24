import { ApiV1 } from "../../api/api"
import { ApiResponse } from "./apiResponse"
import { Tenant, TenantsResponse } from "./responses/tenant"
import { tenantGetOwn, tenantGetTenant } from "../../generated/sdk.gen"
import { call, clientFor } from "../../core/transport"
import type { Client } from "../../generated/client"

class TenantsEndpoints {
    private readonly client: Client

    constructor(api: ApiV1) {
        this.client = clientFor(api)
    }

    /**
     * get a tenant by its id
     * @param tenantId - the id of the tenant
     */
    public getById(tenantId: string): Promise<ApiResponse<Tenant>> {
        return call(tenantGetTenant({ client: this.client, path: { id: tenantId }, throwOnError: true })) as Promise<ApiResponse<Tenant>>
    }

    /**
     * get the tenants of the logged in api key
     */
    public getMy(): Promise<ApiResponse<TenantsResponse>> {
        return call(tenantGetOwn({ client: this.client, throwOnError: true })) as Promise<ApiResponse<TenantsResponse>>
    }
}

export {
    TenantsEndpoints
}
