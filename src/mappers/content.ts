import type { ReceiverRequest, SendContentRequest } from "../endpoints/v1/requests/content"
import type { ContentActionsResponse, DeliveryStatusResponse, SignatureReferenceInfo } from "../endpoints/v1/responses/content"
import type * as Wire from "../generated/types.gen"

/**
 * Public request/response types are the SDK's stable contract; these functions
 * translate them to and from what the API actually sends. Inputs are never
 * mutated.
 */

/** `vad_id` (old misspelling) becomes `vat_id`; `ssn` is dropped (the API rejects unknown receivers' fields silently). */
export function toWireReceiver(receiver: ReceiverRequest): Wire.ApiSendContentReceiverRequest {
    const { vad_id, ssn: _ssn, ...rest } = receiver
    const wire = { ...rest } as Wire.ApiSendContentReceiverRequest
    if (wire.vat_id === undefined && vad_id !== undefined) {
        wire.vat_id = vad_id
    }
    return wire
}

/** A plain list of wallet item ids becomes `{ items: [{ item_id }] }`, the shape the API reads. */
export function toWireSendContent(request: SendContentRequest): Wire.ApiSendContentSendContentRequest {
    const { to, wallet_info, ...rest } = request
    const wire = { ...rest, to: toWireReceiver(to) } as unknown as Wire.ApiSendContentSendContentRequest
    if (wallet_info !== undefined) {
        wire.wallet_info = Array.isArray(wallet_info)
            ? { items: wallet_info.map((item_id) => ({ item_id })) }
            : wallet_info
    }
    return wire
}

/**
 * The API wraps the status in `delivery_status` and names the Brifle delivery
 * date `delivered_date`. The public type is flat with `delivery_date`, so both
 * are provided: the flat fields and the original envelope.
 */
export function fromWireDeliveryStatus(wire: unknown): DeliveryStatusResponse {
    const envelope = wire as { delivery_status?: Record<string, unknown> }
    const status = (envelope?.delivery_status ?? wire) as Record<string, unknown>
    const flat = { ...status } as unknown as DeliveryStatusResponse
    const brifle = status?.brifle as Record<string, unknown> | undefined
    if (brifle) {
        const date = (brifle.delivered_date ?? brifle.delivery_date) as string
        flat.brifle = { ...brifle, delivered_date: date, delivery_date: date } as DeliveryStatusResponse["brifle"]
    }
    flat.delivery_status = { ...status } as DeliveryStatusResponse["delivery_status"]
    return flat
}

/**
 * The API returns `signatures.signature_reference` as an object; it is left as
 * it is (callers may rely on that) and also exposed, typed, as
 * `signature_reference_info`.
 */
export function fromWireContentActions(wire: unknown): ContentActionsResponse {
    const actions = { ...(wire as object) } as ContentActionsResponse
    const ref = (actions.signatures as unknown as { signature_reference?: unknown } | undefined)?.signature_reference
    if (actions.signatures && ref !== null && typeof ref === "object") {
        actions.signatures = { ...actions.signatures, signature_reference_info: ref as SignatureReferenceInfo }
    }
    return actions
}
