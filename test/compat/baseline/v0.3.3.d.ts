import { AxiosError, AxiosResponse } from 'axios';

declare class ApiResponse<ResponseType> {
    private _data?;
    private _error?;
    private constructor();
    /**
     * create a success response from data
     * @param data - The data to return
     */
    static success<ResponseType>(data: ResponseType): ApiResponse<ResponseType>;
    /**
     * create an error response from an AxiosError
     * @param error - The AxiosError object
     */
    static error<ResponseType>(error: ErrorResponse): ApiResponse<ResponseType>;
    /**
     * create an error response from an AxiosError
     * @param error - The AxiosError object
     */
    static errorAxios<ResponseType>(error: AxiosError): ApiResponse<ResponseType>;
    /**
     * check if the response is a success
     */
    get isSuccess(): boolean;
    /**
     * check if the response is an error
     */
    get isError(): boolean;
    /**
     * get the data from the response
     */
    get data(): ResponseType | undefined;
    /**
     * get the error from the response
     */
    get error(): ErrorResponse | undefined;
}
interface ErrorResponse {
    code: number;
    message: string;
    status: number;
}

interface LoginRequest {
    key: string;
    secret: string;
}
interface LogoutRequest {
    token: string;
}

interface LoginResponse {
    access_token: string;
    created_at: string;
    expires_in: number;
    refresh_token: string;
    token_type: string;
    scope: string;
}

declare class AuthenticationEndpoints {
    private endpoint;
    private readonly VERSION;
    private state;
    constructor(api: ApiV1);
    /**
     * builds the full path
     * @param path - The path to the endpoint, e.g. "authentication/login"
     * @returns
     */
    private getPath;
    /**
     * login to the API
     * @param loginRequest - The login request object
     * @returns the login response object
     */
    login(loginRequest: LoginRequest): Promise<ApiResponse<LoginResponse>>;
}

interface ReceiverRequest {
    account_id?: string;
    birth_information?: BirthInformation;
    email?: string;
    tel?: string;
    vad_id?: string;
    ssn?: string;
    first_name?: string;
    last_name?: string;
    full_name?: string;
    date_of_birth?: string;
    postal_address?: PostalAddress;
}
interface PostalAddress {
    city: string;
    country: string;
    date_of_birth?: string;
    first_name: string;
    house_number: string;
    last_name: string;
    postcode: string;
    street: string;
}
interface BirthInformation {
    birth_name?: string;
    date_of_birth: string;
    place_of_birth: string;
    nationality?: string;
    given_names?: string;
    last_name?: string;
    postal_address?: string;
}
interface PaymentDetails {
    amount: number;
    currency: 'EUR';
    description: string;
    due_date: string;
    iban: string;
    recipient_name: string;
    reference: string;
}
interface ContentBody {
    type: 'application/pdf';
    content: string;
}
interface PreviewCoverLetterRequest {
    enable: boolean;
    data?: string | undefined;
    name?: string | undefined;
    type: 'default' | 'custom';
}
interface PreviewToRequest {
    address_line1: string;
    address_line2?: string;
    address_line3?: string;
    postal_code: string;
    city: string;
    country: string;
}
interface PreviewPaperMailRequest {
    body: ContentBody[];
    cover_letter?: PreviewCoverLetterRequest;
    to: PreviewToRequest;
}
interface SendContentRequest {
    to: ReceiverRequest;
    type: 'letter' | 'invoice' | 'contract';
    subject: string;
    delivery_certificate?: 'none' | 'aes';
    body: ContentBody[];
    fallback?: FallbackOptions;
    wallet_info?: string[];
    payment_info?: {
        details?: PaymentDetails;
        payable: boolean;
    };
    signature_info?: {
        signature_reference: string;
        requesting_signer: {
            field: string;
            signer: 'sender' | 'receiver';
        }[];
    };
}
interface FallbackPaperMailOptions {
    cover_letter?: {
        type: 'default' | 'custom';
        data?: string;
        name?: string;
    } | undefined;
    recipient: {
        address_line1: string;
        address_line2?: string;
        address_line3?: string;
        postal_code: string;
        city: string;
        country: string;
    };
    test_mode: {
        email: string;
        enabled: boolean;
    } | undefined;
}
interface FallbackOptions {
    enabled_physical_delivery: boolean;
    paper_mail: FallbackPaperMailOptions;
}

interface SendContentResponse {
    id: string;
}
interface ReceiverCheckElementResponse {
    type: string;
}
interface CheckReceiverResponse {
    receiver: ReceiverCheckElementResponse;
}
interface CheckMultipleReceiversResponse {
    receivers: ReceiverCheckElementResponse[];
}
interface ContentMeta {
    delivered: boolean;
    delivered_date: string;
    read: boolean;
    read_date: string;
    receiver?: string;
    sender?: string;
    receiver_state?: 'unread' | 'read' | 'archived' | 'trashed' | 'deleted' | 'pending';
    sender_state?: 'activate' | 'activated' | 'trashed' | 'deleted' | 'pending';
    sent_date: string;
    size: number;
    subject: string;
    type: string;
    size_responsive?: number;
}
interface ContentResponse {
    content: ContentBody[];
    meta: ContentMeta;
}
interface ContentActionsPaymentResponse {
    details: {
        amount: number;
        currency: string;
        due_date: string;
        market: string;
        reference: string;
        recipient_name: string;
        iban: string;
        tink_payment_id: string;
    };
    link: string;
}
interface CoverLetterOverviewItem {
    type: string;
    name: string;
    display_name: string;
    description?: string;
}
interface CoverLetterOverviewResponse {
    cover_letters: CoverLetterOverviewItem[];
}
interface DeliveryCertificateResponse {
    certificate: string;
    meta: {
        id: string;
        document_id: string;
        type: 'aes';
    };
}
interface DeliveryStatusResponse {
    delivery_mode: string;
    document_id: string;
    tenant_id: string;
    brifle?: DeliveryStatusBrifleResponse;
    physical?: DeliveryStatusPhysicalResponse;
}
interface DeliveryStatusPhysicalResponse {
    deliverer: 'Deutsche Post';
    deliverer_prefix: 'dp';
    document_id: string;
    last_status_check: string;
    errors: DeliveryStatusPhysicalError[];
    letter_id: string;
    state: 'preprocessing' | 'processing' | 'sent' | 'test_sent' | 'error' | 'unknown';
}
interface DeliveryStatusBrifleResponse {
    delivery_date: string;
    read: boolean;
}
interface DeliveryStatusPhysicalError {
    dp_error_code?: string;
    dp_error_description?: string;
    dp_error_date?: string;
    dp_level?: string;
}
interface DeliveryStatusPhysicalErr {
    errors: DeliveryStatusPhysicalError[];
}
interface EmbbededSignatureResponse {
    id: string;
    created_by: string;
    created_date: string;
    document_signature_id: string;
    due_date: string;
    field_name: string;
    history?: string;
    purpose: string;
    request_date: string;
    requested_to: string;
    signature_date: string;
    signed_by: string;
    signed_for: string;
    value: string;
    status: 'pending' | 'signed' | 'rejected';
}
interface ContentActionsSignatureResponse {
    document_signatures: {
        signature_ids: string[];
        signature_reference: string;
    };
    embedded_signatures: EmbbededSignatureResponse[];
    signature_reference: string;
}
interface ContentActionsResponse {
    payments: ContentActionsPaymentResponse;
    signatures: ContentActionsSignatureResponse;
}

declare class ContentEndpoints {
    private endpoint;
    private readonly VERSION;
    private state;
    constructor(api: ApiV1);
    /**
     * builds the full path
     * @param path - The path to the endpoint, e.g. "authentication/login"
     * @returns
     */
    private getPath;
    /**
     * get the content of a document
     * @param documentId - The id of the document
     * @returns the content of the document
     */
    getContent(documentId: string): Promise<ApiResponse<ContentResponse>>;
    /**
     * get the actions of a document
     * @param documentId - The id of the document
     * @returns the actions of the document
     */
    getContentActions(documentId: string): Promise<ApiResponse<ContentActionsResponse>>;
    /**
     * checks if a receiver is existing in Brifle
     * @param receiver - The receiver object to check
     * @returns
     */
    checkReceiver(receiver: ReceiverRequest): Promise<ApiResponse<CheckReceiverResponse>>;
    /**
     * checks if a receivers are existing in Brifle
     * @param receivers - The receiver object to check
     * @returns
     */
    checkMultipleReceivers(receivers: ReceiverRequest[]): Promise<ApiResponse<CheckMultipleReceiversResponse>>;
    /**
     * send a content to a receiver
     * @param tenantId - The tenant id of the receiver
     * @param request - The request object to send
     * @returns
     */
    sendContent(tenantId: string, request: SendContentRequest): Promise<ApiResponse<SendContentResponse>>;
    /**
     * list all cover letters for a tenant
     * @param tenantId - The tenant id
     * @returns
     */
    listCoverLetters(tenantId: string): Promise<ApiResponse<CoverLetterOverviewResponse>>;
    /**
     * create a custom cover letter for a tenant
     * @param tenantId - The tenant id
     * @param name - The name of the cover letter
     * @param base64Content - The content of the cover letter in base64 encoding
     * @param description - The description of the cover letter (optional)
     * @returns
     */
    createCoverLetter(tenantId: string, name: string, base64Content: string, description?: string): Promise<ApiResponse<CoverLetterOverviewItem>>;
    /**
     * delete a custom cover letter
     *
     */
    deleteCoverLetter(tenantId: string, name: string): Promise<ApiResponse<void>>;
    /**
     * get the content of a cover letter
     * @param tenantId - The tenant id
     * @param type - The type of the cover letter (custom | default)
     * @param name - The name of the cover letter
     * @param encoding - The encoding of the cover letter (base64 | pdf)
     * @returns
     */
    getCoverLetterContent(tenantId: string, type: 'custom' | 'default', name: string, encoding: 'base64' | 'pdf'): Promise<AxiosResponse<string | Blob>>;
    /**
     * get the delivery certificate for a document
     * @param documentId - The id of the document
     * @returns
     */
    getDeliveryCertificate(documentId: string): Promise<ApiResponse<DeliveryCertificateResponse>>;
    /**
     * get the delivery status of a document
     * @param documentId - The id of the document
     * @returns
     */
    getDeliveryStatus(documentId: string): Promise<ApiResponse<DeliveryStatusResponse>>;
    /**
     * gets a preview of a paper mail including the content and the cover letter merged into one pdf
     * @param tenantId the
     * @param request the request object to send
     * @returns the api response containing the preview as a blob if is called in the browser or as an array buffer if is called in node
     */
    getPaperMailPreview(tenantId: string, request: PreviewPaperMailRequest): Promise<ApiResponse<Blob | ArrayBuffer>>;
}

interface CreateSignatureReferenceRequest {
    fields: {
        name: string;
        purpose: string;
        role: string;
    }[];
}

interface CreateSignatureReferenceResponse {
    id: string;
    managed_by: string;
    signature_fields: {
        name: string;
        purpose: string;
        role: string;
    }[];
}

declare class SignaturesEndpoint {
    private endpoint;
    private readonly VERSION;
    private state;
    constructor(api: ApiV1);
    /**
     * builds the full path
     * @param path - The path to the endpoint, e.g. "authentication/login"
     * @returns
     */
    private getPath;
    /**
     * creates a signature reference
     * @param tenantId - The id of the tenant
     * @param request - The request object
     * @returns the response object
     */
    createSignatureReference(tenantId: string, request: CreateSignatureReferenceRequest): Promise<ApiResponse<CreateSignatureReferenceResponse>>;
    /**
     * gets a signature reference
     * @param signatureId - The id of the signature
     * @returns the response object
     */
    exportSignature(signatureId: string, format: 'xml'): Promise<ApiResponse<any>>;
}

interface InboxFilter {
    state?: Array<'read' | 'unread' | 'trashed'>;
    subject?: string;
    sub_mailbox?: string;
    type?: 'letter' | 'invoice' | 'contract';
}
interface OutboxFilter {
    state?: Array<'active' | 'trashed'>;
    subject?: string;
    type?: 'letter' | 'invoice' | 'contract';
}

interface MailboxResponse {
    total: number;
    results: Meta[];
}
interface Meta {
    id: string;
    sender: string;
    receiver: string;
    read: boolean;
    read_date: string;
    size: number;
    type: string;
    delivered: boolean;
    delivered_date: string;
    sent_date: string;
    subject: string;
    sender_state?: string;
    receiver_state?: string;
    size_responsive?: number;
}

declare class MailboxEndpoints {
    private endpoint;
    private readonly VERSION;
    private state;
    constructor(api: ApiV1);
    private getPath;
    /**
     * Get the inbox of an account
     * @returns the mailbox response object
     */
    getInbox(filter: InboxFilter, page?: number): Promise<ApiResponse<MailboxResponse>>;
    getOutbox(tenant: string, filter: OutboxFilter, page?: number): Promise<ApiResponse<MailboxResponse>>;
}

interface Tenant {
    account_id: string;
    name: string;
    image?: string;
    private: boolean;
    id: string;
}
interface TenantsResponse {
    total: number;
    tenants: Tenant[];
}

declare class TenantsEndpoints {
    private endpoint;
    private readonly VERSION;
    private state;
    constructor(api: ApiV1);
    private getPath;
    /**
     * Gets a tenant by its ID
     */
    getById(tenantId: string): Promise<ApiResponse<Tenant>>;
    /**
     * Gets all tenants owned by the account id
     */
    getMy(): Promise<ApiResponse<TenantsResponse>>;
}

interface AccountInfo {
    company_name: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    type: 'private' | 'business';
}

declare class AccountsEndpoints {
    private endpoint;
    private readonly VERSION;
    private state;
    constructor(api: ApiV1);
    private getPath;
    /**
     * Gets a tenant by its ID
     */
    getById(accountId: string): Promise<ApiResponse<AccountInfo>>;
}

interface StatusResponse {
    status: string;
    timestamp: string;
    version: string;
    service: string;
    features: string[];
}

declare class StatusEndpoint {
    private endpoint;
    private readonly VERSION;
    private state;
    constructor(api: ApiV1);
    private getPath;
    /**
     *
     * @returns the
     */
    getStatus(): Promise<ApiResponse<StatusResponse>>;
}

interface AddressParseRequest {
    address: string;
}

interface ParsedAddressResponse {
    city: string;
    country: string;
    house_number: string;
    postcode: string;
    street: string;
}

declare class AddressEndpoint {
    private endpoint;
    private readonly VERSION;
    private state;
    constructor(api: ApiV1);
    private getPath;
    /**
     * parses an address and returns the parsed address
     * @param request - The address to parse
     * @return the parsed address
     */
    parseAddress(request: AddressParseRequest): Promise<ApiResponse<ParsedAddressResponse>>;
    /**
     * parses an address and returns the parsed address and the expanded address
     * @param request - The address to parse and expand
     * @return the parsed and expanded address
     */
    parseAndExpandAddress(request: AddressParseRequest): Promise<ApiResponse<ParsedAddressResponse[]>>;
}

declare class ApiV1 {
    readonly endpoint: string;
    readonly apiState: ApiV1State;
    constructor(endpoint: string);
    static get sandbox(): ApiV1;
    static get production(): ApiV1;
    /**
     * gets an instance of the AuthenticationEndpoints
     * @returns AuthenticationEndpoints
     */
    authentication(): AuthenticationEndpoints;
    /**
     * gets an instance of the ContentEndpoints
     * @returns ContentEndpoints
     */
    content(): ContentEndpoints;
    /**
     * gets an instance of the SignatureEndpoints
     * @returns ContentEndpoints
     */
    signature(): SignaturesEndpoint;
    /**
     * gets an instance of the TenantsEndpoints
     * @returns TenantsEndpoints
     */
    tenants(): TenantsEndpoints;
    /**
     * gets an instance of the AccountsEndpoints
     * @returns AccountsEndpoints
     */
    accounts(): AccountsEndpoints;
    /**
     * gets an instance of the MailboxEndpoints
     * @returns MailboxEndpoints
     */
    mailbox(): MailboxEndpoints;
    /**
     * gets an instance of the StatusEndpoint
     * @returns StatusEndpoint
     */
    status(): StatusEndpoint;
    /**
     * gets an instance of the AddressEndpoint
     * @returns AddressEndpoint
     */
    address(): AddressEndpoint;
}
interface ApiV1State {
    auth_token?: string;
    auth_token_expire_date?: Date;
}

export { AccountsEndpoints, AddressEndpoint, ApiResponse, ApiV1, AuthenticationEndpoints, ContentEndpoints, MailboxEndpoints, SignaturesEndpoint, StatusEndpoint, TenantsEndpoints };
export type { AccountInfo, AddressParseRequest, ApiV1State, BirthInformation, CheckMultipleReceiversResponse, CheckReceiverResponse, ContentActionsPaymentResponse, ContentActionsResponse, ContentActionsSignatureResponse, ContentBody, ContentMeta, ContentResponse, CoverLetterOverviewItem, CoverLetterOverviewResponse, CreateSignatureReferenceRequest, CreateSignatureReferenceResponse, DeliveryCertificateResponse, DeliveryStatusBrifleResponse, DeliveryStatusPhysicalErr, DeliveryStatusPhysicalError, DeliveryStatusPhysicalResponse, DeliveryStatusResponse, EmbbededSignatureResponse, ErrorResponse, FallbackOptions, FallbackPaperMailOptions, InboxFilter, LoginRequest, LoginResponse, LogoutRequest, MailboxResponse, Meta, OutboxFilter, ParsedAddressResponse, PaymentDetails, PostalAddress, PreviewCoverLetterRequest, PreviewPaperMailRequest, PreviewToRequest, ReceiverRequest, SendContentRequest, SendContentResponse, Tenant, TenantsResponse };
