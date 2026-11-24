import { ApiV1 } from "../../api/api"
import { CreateSignatureReferenceRequest } from "./requests/signatures"
import { ApiResponse } from "./apiResponse"
import { CreateSignatureReferenceResponse } from "./responses/signatures"
import { signatureCreateSignatureReference, signatureExportSignature } from "../../generated/sdk.gen"
import { call, clientFor } from "../../core/transport"
import type { Client } from "../../generated/client"

/**
 * @deprecated the signature endpoints are deprecated by the API (it sends
 * `Deprecation` headers). Use `contracts()`, which covers the whole signing
 * flow.
 */
class SignaturesEndpoint {
    private readonly client: Client

    constructor(api: ApiV1) {
        this.client = clientFor(api)
    }

    /**
     * creates a signature reference
     * @deprecated use `contracts().create`
     * @param tenantId - The id of the tenant
     * @param request - The request object
     * @returns the response object
     */
    public createSignatureReference(tenantId: string, request: CreateSignatureReferenceRequest): Promise<ApiResponse<CreateSignatureReferenceResponse>> {
        return call(signatureCreateSignatureReference({
            client: this.client,
            path: { tenant_id: tenantId },
            body: request as never,
            throwOnError: true,
        })) as Promise<ApiResponse<CreateSignatureReferenceResponse>>
    }

    /**
     * exports a signature
     * @deprecated use `contracts().getSignature`
     * @param signatureId - The id of the signature
     * @param format - The format of the export
     * @returns the signature (XAdES XML as a string)
     */
    public exportSignature(signatureId: string, format: 'xml'): Promise<ApiResponse<any>> {
        return call(signatureExportSignature({
            client: this.client,
            path: { signature_id: signatureId, format },
            responseType: 'text',
            throwOnError: true,
        }))
    }
}

export {
    SignaturesEndpoint
}
