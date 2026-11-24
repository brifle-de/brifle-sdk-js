import { ApiV1 } from "../../api/api"
import { ApiResponse } from "./apiResponse"
import { CreateContractRequest, ListContractsOptions } from "./requests/contracts"
import { ContractEventsResponse, ContractListResponse, ContractResponse, ContractSignaturesResponse } from "./responses/contracts"
import {
    contractCancel,
    contractCreate,
    contractDocument,
    contractEvents,
    contractIndex,
    contractShow,
    contractSignature,
    contractSignatures,
} from "../../generated/sdk.gen"
import { binaryResponseType, call, clientFor } from "../../core/transport"
import { toWireReceiver } from "../../mappers/content"
import type { Client } from "../../generated/client"

/**
 * Contracts: a document sent to one or more signers, who sign it in the Brifle
 * app (m-SES or m-AES). Needs an API with contracts enabled; otherwise every
 * call fails with code 40499 (feature not enabled).
 */
class ContractsEndpoints {
    private readonly client: Client

    constructor(api: ApiV1) {
        this.client = clientFor(api)
    }

    /**
     * creates a contract and sends it to the signers
     * @param tenantId - the tenant (sender) id
     * @param request - the contract
     */
    public create(tenantId: string, request: CreateContractRequest): Promise<ApiResponse<ContractResponse>> {
        const body = { ...request, signers: request.signers.map((s) => ({ ...s, to: toWireReceiver(s.to) })) }
        return call(contractCreate({ client: this.client, path: { tenant_id: tenantId }, body, throwOnError: true })) as Promise<ApiResponse<ContractResponse>>
    }

    /**
     * lists the contracts of a tenant
     * @param tenantId - the tenant id
     * @param options - paging and status filter
     */
    public list(tenantId: string, options?: ListContractsOptions): Promise<ApiResponse<ContractListResponse>> {
        return call(contractIndex({ client: this.client, path: { tenant_id: tenantId }, query: options, throwOnError: true })) as Promise<ApiResponse<ContractListResponse>>
    }

    /**
     * gets one contract
     * @param tenantId - the tenant id
     * @param contractId - the contract id
     */
    public get(tenantId: string, contractId: string): Promise<ApiResponse<ContractResponse>> {
        return call(contractShow({ client: this.client, path: { tenant_id: tenantId, contract_id: contractId }, throwOnError: true })) as Promise<ApiResponse<ContractResponse>>
    }

    /**
     * cancels an open contract (code 40903 if it is no longer open)
     * @param tenantId - the tenant id
     * @param contractId - the contract id
     */
    public cancel(tenantId: string, contractId: string): Promise<ApiResponse<ContractResponse>> {
        return call(contractCancel({ client: this.client, path: { tenant_id: tenantId, contract_id: contractId }, throwOnError: true })) as Promise<ApiResponse<ContractResponse>>
    }

    /**
     * downloads the contract document
     * @param tenantId - the tenant id
     * @param contractId - the contract id
     * @param revision - `current` (with the signatures so far, default) or `original`
     * @returns the document, an ArrayBuffer in Node and a Blob in a browser
     */
    public getDocument(tenantId: string, contractId: string, revision: 'current' | 'original' = 'current'): Promise<ApiResponse<Blob | ArrayBuffer>> {
        return call(contractDocument({
            client: this.client,
            path: { tenant_id: tenantId, contract_id: contractId },
            query: { revision },
            responseType: binaryResponseType(),
            throwOnError: true,
        })) as Promise<ApiResponse<Blob | ArrayBuffer>>
    }

    /**
     * lists the signatures made so far
     * @param tenantId - the tenant id
     * @param contractId - the contract id
     */
    public listSignatures(tenantId: string, contractId: string): Promise<ApiResponse<ContractSignaturesResponse>> {
        return call(contractSignatures({ client: this.client, path: { tenant_id: tenantId, contract_id: contractId }, throwOnError: true })) as Promise<ApiResponse<ContractSignaturesResponse>>
    }

    /**
     * gets the signature of one signer (XAdES XML for the XAdES formats)
     * @param tenantId - the tenant id
     * @param contractId - the contract id
     * @param signerId - the signer id
     */
    public getSignature(tenantId: string, contractId: string, signerId: string): Promise<ApiResponse<string>> {
        return call(contractSignature({
            client: this.client,
            path: { tenant_id: tenantId, contract_id: contractId, signer_id: signerId },
            responseType: 'text',
            throwOnError: true,
        })) as Promise<ApiResponse<string>>
    }

    /**
     * the audit trail of a contract
     * @param tenantId - the tenant id
     * @param contractId - the contract id
     */
    public getEvents(tenantId: string, contractId: string): Promise<ApiResponse<ContractEventsResponse>> {
        return call(contractEvents({ client: this.client, path: { tenant_id: tenantId, contract_id: contractId }, throwOnError: true })) as Promise<ApiResponse<ContractEventsResponse>>
    }
}

export {
    ContractsEndpoints
}
