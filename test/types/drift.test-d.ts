// The public types (src/endpoints/v1/requests|responses) are hand-written and
// stable; src/generated is regenerated from openapi/api.json. These checks
// fail the build when the API changes under the public types:
//   ExistsInSpec   a field the SDK declares is gone from (or renamed in) the API
//   CoversRequired the API requires a field the SDK cannot send
// A failure here means: map the change in src/mappers, or (if the public type
// itself has to change) make that change additive. See README "Compatibility".
import type * as P from "../../src"
import type * as W from "../../src/generated/types.gen"
import type { Assert, CoversRequired, ExistsInSpec } from "./helpers"

type Ok<T extends W.ContentGetResponses | object, C extends keyof T> = T[C]
type Item<T> = T extends Array<infer I> ? I : never

// deprecated aliases the mappers translate; they are not API fields
type ReceiverFields = Omit<P.ReceiverRequest, "vad_id" | "ssn">

// --- requests: the SDK can send everything the API requires, and nothing it does not know
type _q1 = Assert<CoversRequired<P.LoginRequest, W.LoginApiKeyRequest>>
type _q2 = Assert<ExistsInSpec<P.LoginRequest, W.LoginApiKeyRequest>>
type _q3 = Assert<ExistsInSpec<ReceiverFields, W.ApiSendContentReceiverRequest>>
type _q4 = Assert<CoversRequired<P.SendContentRequest, W.ApiSendContentSendContentRequest>>
type _q5 = Assert<ExistsInSpec<P.SendContentRequest, W.ApiSendContentSendContentRequest>>
type _q6 = Assert<CoversRequired<P.PreviewPaperMailRequest, W.SendContentPreviewPapermailRequest>>
type _q7 = Assert<ExistsInSpec<P.PreviewPaperMailRequest, W.SendContentPreviewPapermailRequest>>
type _q8 = Assert<CoversRequired<P.CreateContractRequest, W.CreateContractRequest>>
type _q9 = Assert<ExistsInSpec<P.CreateContractRequest, W.CreateContractRequest>>
type _q10 = Assert<CoversRequired<P.ContractSignerRequest, Item<W.CreateContractRequest["signers"]>>>
type _q11 = Assert<ExistsInSpec<P.ContractSignerRequest, Item<W.CreateContractRequest["signers"]>>>
type _q12 = Assert<CoversRequired<P.CreateWalletItemRequest, W.CreateWalletRequest>>
type _q13 = Assert<ExistsInSpec<P.CreateWalletItemRequest, W.CreateWalletRequest>>
type _q14 = Assert<ExistsInSpec<P.ListContractsOptions, NonNullable<W.ContractIndexData["query"]>>>
type _q15 = Assert<ExistsInSpec<P.OutboxOptions, W.MyOutboxRequest>>

// --- responses: every field the SDK declares exists in the API's schema
type _p1 = Assert<ExistsInSpec<P.LoginResponse, Ok<W.AuthCreateResponses, 200>>>
type _p2 = Assert<ExistsInSpec<P.ContentResponse, Ok<W.ContentGetResponses, 200>>>
type _p3 = Assert<ExistsInSpec<P.ContentMeta, W.Meta>>
type _p4 = Assert<ExistsInSpec<P.ContentBody, Item<Ok<W.ContentGetResponses, 200>["content"]>>>
type _p5 = Assert<ExistsInSpec<P.ContentActionsResponse, Ok<W.ContentGetActionsResponses, 200>>>
type _p6 = Assert<ExistsInSpec<
    Omit<P.ContentActionsSignatureResponse, "signature_reference_info">,
    NonNullable<Ok<W.ContentGetActionsResponses, 200>["signatures"]>>>
type _p7 = Assert<ExistsInSpec<P.ContentActionsWalletItem, W.WalletMetaResponse>>
type _p8 = Assert<ExistsInSpec<
    Omit<P.DeliveryStatusResponse, "delivery_status">,
    Ok<W.ContentGetDeliveryStatusResponses, 200>["delivery_status"]>>
type _p9 = Assert<ExistsInSpec<
    Omit<P.DeliveryStatusBrifleResponse, "delivery_date">,
    NonNullable<Ok<W.ContentGetDeliveryStatusResponses, 200>["delivery_status"]["brifle"]>>>
type _p10 = Assert<ExistsInSpec<
    P.DeliveryStatusPhysicalResponse,
    NonNullable<Ok<W.ContentGetDeliveryStatusResponses, 200>["delivery_status"]["physical"]>>>
type _p11 = Assert<ExistsInSpec<P.DeliveryCertificateResponse, Ok<W.ContentGetDeliveryCertificateResponses, 200>>>
type _p12 = Assert<ExistsInSpec<P.CoverLetterOverviewResponse, Ok<W.ContentGetCoverLettersListResponses, 200>>>
type _p13 = Assert<ExistsInSpec<P.CheckReceiverResponse, Ok<W.ContentCheckReceiverResponses, 200>>>
type _p14 = Assert<ExistsInSpec<P.CheckMultipleReceiversResponse, Ok<W.ContentCheckReceiverBulkResponses, 200>>>
type _p15 = Assert<ExistsInSpec<P.SendContentResponse, Ok<W.ContentSendResponses, 200>>>
type _p16 = Assert<ExistsInSpec<P.MailboxResponse, Ok<W.MailboxGetMyOutboxResponses, 200>>>
type _p17 = Assert<ExistsInSpec<P.Meta, W.Item>>
type _p18 = Assert<ExistsInSpec<P.Tenant, Ok<W.TenantGetTenantResponses, 200>>>
type _p19 = Assert<ExistsInSpec<P.TenantsResponse, Ok<W.TenantGetOwnResponses, 200>>>
type _p20 = Assert<ExistsInSpec<P.AccountInfo, Ok<W.AccountsGetBasicInfoResponses, 200>>>
type _p21 = Assert<ExistsInSpec<P.ParsedAddressResponse, Ok<W.AddressParseAddressResponses, 200>>>
type _p22 = Assert<ExistsInSpec<P.StatusResponse, Ok<W.StatusGetStatusResponses, 200>>>
type _p23 = Assert<ExistsInSpec<P.ContractResponse, Ok<W.ContractShowResponses, 200>>>
type _p24 = Assert<ExistsInSpec<P.ContractSigner, Item<NonNullable<Ok<W.ContractShowResponses, 200>["signers"]>>>>
type _p25 = Assert<ExistsInSpec<P.ContractListResponse, Ok<W.ContractIndexResponses, 200>>>
type _p26 = Assert<ExistsInSpec<P.ContractEvent, Item<NonNullable<Ok<W.ContractEventsResponses, 200>["events"]>>>>
type _p27 = Assert<ExistsInSpec<P.ContractSignatureInfo, Item<NonNullable<Ok<W.ContractSignaturesResponses, 200>["signatures"]>>>>
type _p28 = Assert<ExistsInSpec<P.WalletItemMeta, Ok<W.WalletCreateWalletItemResponses, 201>>>
type _p29 = Assert<ExistsInSpec<P.WalletItemResponse, Ok<W.WalletReadWalletItemResponses, 200>>>
type _p30 = Assert<ExistsInSpec<P.CreateSignatureReferenceResponse, Ok<W.SignatureCreateSignatureReferenceResponses, 200>>>
