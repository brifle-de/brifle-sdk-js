// Nothing that compiled against @brifle/brifle-sdk 0.3.3 may stop compiling:
// test/compat/baseline/v0.3.3.d.ts is the published 0.3.3 typings, frozen.
import type * as Old from "../compat/baseline/v0.3.3"
import type * as New from "../../src"
import type { Accepts, Assert, CallsStillCompile, KeepsFields } from "./helpers"

// every method, with the arguments it took in 0.3.3
type _api = Assert<CallsStillCompile<Old.ApiV1, New.ApiV1>>
type _auth = Assert<CallsStillCompile<Old.AuthenticationEndpoints, New.AuthenticationEndpoints>>
type _content = Assert<CallsStillCompile<Old.ContentEndpoints, New.ContentEndpoints>>
type _signature = Assert<CallsStillCompile<Old.SignaturesEndpoint, New.SignaturesEndpoint>>
type _mailbox = Assert<CallsStillCompile<Old.MailboxEndpoints, New.MailboxEndpoints>>
type _tenants = Assert<CallsStillCompile<Old.TenantsEndpoints, New.TenantsEndpoints>>
type _accounts = Assert<CallsStillCompile<Old.AccountsEndpoints, New.AccountsEndpoints>>
type _status = Assert<CallsStillCompile<Old.StatusEndpoint, New.StatusEndpoint>>
type _address = Assert<CallsStillCompile<Old.AddressEndpoint, New.AddressEndpoint>>

// every request object a 0.3.3 caller built is still accepted
type _r1 = Assert<Accepts<New.LoginRequest, Old.LoginRequest>>
type _r2 = Assert<Accepts<New.LogoutRequest, Old.LogoutRequest>>
type _r3 = Assert<Accepts<New.ReceiverRequest, Old.ReceiverRequest>>
type _r4 = Assert<Accepts<New.SendContentRequest, Old.SendContentRequest>>
type _r5 = Assert<Accepts<New.PreviewPaperMailRequest, Old.PreviewPaperMailRequest>>
type _r6 = Assert<Accepts<New.InboxFilter, Old.InboxFilter>>
type _r7 = Assert<Accepts<New.OutboxFilter, Old.OutboxFilter>>
type _r8 = Assert<Accepts<New.CreateSignatureReferenceRequest, Old.CreateSignatureReferenceRequest>>
type _r9 = Assert<Accepts<New.AddressParseRequest, Old.AddressParseRequest>>

// every response field a 0.3.3 caller read is still there
type _s1 = Assert<KeepsFields<Old.LoginResponse, New.LoginResponse>>
type _s2 = Assert<KeepsFields<Old.ContentResponse, New.ContentResponse>>
type _s3 = Assert<KeepsFields<Old.ContentMeta, New.ContentMeta>>
type _s4 = Assert<KeepsFields<Old.ContentActionsResponse, New.ContentActionsResponse>>
type _s5 = Assert<KeepsFields<Old.ContentActionsSignatureResponse, New.ContentActionsSignatureResponse>>
type _s6 = Assert<KeepsFields<Old.ContentActionsPaymentResponse["details"], New.ContentActionsPaymentResponse["details"]>>
type _s7 = Assert<KeepsFields<Old.DeliveryStatusResponse, New.DeliveryStatusResponse>>
type _s8 = Assert<KeepsFields<Old.DeliveryStatusBrifleResponse, New.DeliveryStatusBrifleResponse>>
type _s9 = Assert<KeepsFields<Old.DeliveryStatusPhysicalResponse, New.DeliveryStatusPhysicalResponse>>
type _s10 = Assert<KeepsFields<Old.DeliveryCertificateResponse, New.DeliveryCertificateResponse>>
type _s11 = Assert<KeepsFields<Old.CoverLetterOverviewItem, New.CoverLetterOverviewItem>>
type _s12 = Assert<KeepsFields<Old.Meta, New.Meta>>
type _s13 = Assert<KeepsFields<Old.MailboxResponse, New.MailboxResponse>>
type _s14 = Assert<KeepsFields<Old.Tenant, New.Tenant>>
type _s15 = Assert<KeepsFields<Old.AccountInfo, New.AccountInfo>>
type _s16 = Assert<KeepsFields<Old.ParsedAddressResponse, New.ParsedAddressResponse>>
type _s17 = Assert<KeepsFields<Old.CreateSignatureReferenceResponse, New.CreateSignatureReferenceResponse>>
type _s18 = Assert<KeepsFields<Old.ErrorResponse, New.ErrorResponse>>
