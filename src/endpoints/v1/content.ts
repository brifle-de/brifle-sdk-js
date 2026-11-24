import { AxiosResponse } from "axios"
import { ApiResponse } from "./apiResponse"
import { CheckMultipleReceiversResponse, CheckReceiverResponse, ContentActionsResponse, ContentResponse, CoverLetterOverviewItem, CoverLetterOverviewResponse, DeliveryCertificateResponse, DeliveryStatusResponse, SendContentResponse } from "./responses/content"
import { ApiV1, ApiV1State } from "../../api/api"
import { PreviewPaperMailRequest, ReceiverRequest, SendContentRequest } from "./requests/content"
import {
    contentCheckReceiver,
    contentCheckReceiverBulk,
    contentDeleteCoverLetter,
    contentGet,
    contentGetActions,
    contentGetCoverLetter,
    contentGetCoverLettersList,
    contentGetDeliveryCertificate,
    contentGetDeliveryStatus,
    contentPreviewPaperMail,
    contentSend,
    contentUploadCoverLetter,
} from "../../generated/sdk.gen"
import { binaryResponseType, call, clientFor } from "../../core/transport"
import { fromWireContentActions, fromWireDeliveryStatus, toWireReceiver, toWireSendContent } from "../../mappers/content"
import type { Client } from "../../generated/client"

interface GetContentOptions {
    /**
     * marks the document as read when the logged in account is its receiver.
     * Once read, a document cannot become unread again.
     */
    read?: boolean
}

class ContentEndpoints {
    private readonly client: Client
    private readonly state: ApiV1State

    constructor(api: ApiV1) {
        this.client = clientFor(api)
        this.state = api.apiState
    }

    /**
     * get the content of a document
     * @param documentId - The id of the document
     * @param options - e.g. mark the document as read
     * @returns the content of the document
     */
    public getContent(documentId: string, options?: GetContentOptions): Promise<ApiResponse<ContentResponse>> {
        return call(contentGet({
            client: this.client,
            path: { id: documentId },
            query: options?.read !== undefined ? { read: options.read } : undefined,
            throwOnError: true,
        })) as Promise<ApiResponse<ContentResponse>>
    }

    /**
     * get the actions (signatures, payment, wallet items) of a document
     * @param documentId - The id of the document
     */
    public getContentActions(documentId: string): Promise<ApiResponse<ContentActionsResponse>> {
        return call(contentGetActions({ client: this.client, path: { id: documentId }, throwOnError: true }), fromWireContentActions)
    }

    /**
     * checks if a receiver is existing in Brifle
     * @param receiver - The receiver object to check
     * @returns the receiver type if found (404 / code 40401 otherwise)
     */
    public checkReceiver(receiver: ReceiverRequest): Promise<ApiResponse<CheckReceiverResponse>> {
        return call(contentCheckReceiver({ client: this.client, body: toWireReceiver(receiver), throwOnError: true })) as Promise<ApiResponse<CheckReceiverResponse>>
    }

    /**
     * checks if receivers are existing in Brifle
     * @param receivers - The receiver objects to check
     * @returns one entry per receiver, in the same order; `null` for a receiver that was not found
     */
    public checkMultipleReceivers(receivers: ReceiverRequest[]): Promise<ApiResponse<CheckMultipleReceiversResponse>> {
        return call(contentCheckReceiverBulk({
            client: this.client,
            body: { receivers: receivers.map(toWireReceiver) },
            throwOnError: true,
        })) as Promise<ApiResponse<CheckMultipleReceiversResponse>>
    }

    /**
     * send a content to a receiver
     * @param tenantId - The tenant (sender) id
     * @param request - The request object
     * @returns the id of the new document
     */
    public sendContent(tenantId: string, request: SendContentRequest): Promise<ApiResponse<SendContentResponse>> {
        return call(contentSend({
            client: this.client,
            path: { tenant: tenantId },
            body: toWireSendContent(request),
            throwOnError: true,
        })) as Promise<ApiResponse<SendContentResponse>>
    }

    /**
     * list all cover letters for a tenant
     * @param tenantId - The tenant id
     */
    public listCoverLetters(tenantId: string): Promise<ApiResponse<CoverLetterOverviewResponse>> {
        return call(contentGetCoverLettersList({ client: this.client, path: { tenant: tenantId }, throwOnError: true })) as Promise<ApiResponse<CoverLetterOverviewResponse>>
    }

    /**
     * create a custom cover letter for a tenant
     * @param tenantId - The tenant id
     * @param name - The name of the cover letter
     * @param base64Content - The content of the cover letter in base64 encoding
     * @param description - The description of the cover letter (optional)
     */
    public createCoverLetter(tenantId: string, name: string, base64Content: string, description?: string)
    : Promise<ApiResponse<CoverLetterOverviewItem>> {
        return call(contentUploadCoverLetter({
            client: this.client,
            path: { tenant: tenantId },
            body: { name, data: base64Content, description } as never,
            throwOnError: true,
        })) as Promise<ApiResponse<CoverLetterOverviewItem>>
    }

    /**
     * delete a custom cover letter
     * @param tenantId - The tenant id
     * @param name - The name of the cover letter
     */
    public deleteCoverLetter(tenantId: string, name: string): Promise<ApiResponse<void>> {
        return call(contentDeleteCoverLetter({ client: this.client, path: { tenant: tenantId, name }, throwOnError: true })) as Promise<ApiResponse<void>>
    }

    /**
     * get the content of a cover letter. Throws on an error response; prefer
     * `getCoverLetter`, which returns an ApiResponse like every other method.
     * @param tenantId - The tenant id
     * @param type - The type of the cover letter (custom | default)
     * @param name - The name of the cover letter
     * @param encoding - The encoding of the cover letter (base64 | pdf)
     */
    public getCoverLetterContent(tenantId: string, type: 'custom' | 'default', name: string, encoding: 'base64' | 'pdf'): Promise<AxiosResponse<string | Blob>> {
        const path = `/v1/content/cover_letter/${encodeURIComponent(tenantId)}/${type}/${encodeURIComponent(name)}/${encoding}`
        return this.client.instance.get<Blob>(path, {
            headers: {
                "Authorization": `Bearer ${this.state.auth_token}`
            },
            responseType: 'blob'
        })
    }

    /**
     * get the content of a cover letter
     * @param tenantId - The tenant id
     * @param type - The type of the cover letter (custom | default)
     * @param name - The name of the cover letter
     * @param format - `base64` returns the PDF as base64 text, `pdf` as binary
     *   (an ArrayBuffer in Node, a Blob in a browser)
     */
    public getCoverLetter(tenantId: string, type: 'custom' | 'default', name: string, format: 'base64' | 'pdf'): Promise<ApiResponse<string | Blob | ArrayBuffer>> {
        return call(contentGetCoverLetter({
            client: this.client,
            path: { tenant: tenantId, type, file_name: name, format },
            responseType: format === 'base64' ? 'text' : binaryResponseType(),
            throwOnError: true,
        })) as Promise<ApiResponse<string | Blob | ArrayBuffer>>
    }

    /**
     * get the delivery certificate for a document
     * @param documentId - The id of the document
     */
    public getDeliveryCertificate(documentId: string): Promise<ApiResponse<DeliveryCertificateResponse>> {
        return call(contentGetDeliveryCertificate({ client: this.client, path: { id: documentId }, throwOnError: true })) as Promise<ApiResponse<DeliveryCertificateResponse>>
    }

    /**
     * get the delivery status of a document
     * @param documentId - The id of the document
     */
    public getDeliveryStatus(documentId: string): Promise<ApiResponse<DeliveryStatusResponse>> {
        return call(contentGetDeliveryStatus({ client: this.client, path: { id: documentId }, throwOnError: true }), fromWireDeliveryStatus)
    }

    /**
     * gets a preview of a paper mail including the content and the cover letter merged into one pdf
     * @param tenantId the tenant (sender) id
     * @param request the request object to send
     * @returns the api response containing the preview as a blob if is called in the browser or as an array buffer if is called in node
     */
    public getPaperMailPreview(tenantId: string, request: PreviewPaperMailRequest): Promise<ApiResponse<Blob | ArrayBuffer>> {
        return call(contentPreviewPaperMail({
            client: this.client,
            path: { tenant: tenantId },
            body: request as never,
            responseType: binaryResponseType(),
            throwOnError: true,
        })) as Promise<ApiResponse<Blob | ArrayBuffer>>
    }
}

export type { GetContentOptions }

export {
    ContentEndpoints
}
