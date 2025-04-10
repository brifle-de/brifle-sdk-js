interface CreateSignatureReferenceResponse {
    id: string
    managed_by: string
    signature_fields: {
        name: string
        purpose: string
        role: string
    }[]
}

export type {
    CreateSignatureReferenceResponse
}