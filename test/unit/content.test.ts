import { body, ENDPOINT, lastRequest, mockedApi } from "./helpers"

const C = `${ENDPOINT}/v1/content`

describe("content", () => {
    it("getContent passes read only when asked", async () => {
        const { api, mock } = mockedApi()
        mock.onGet(new RegExp(`^${C}/document/d1`)).reply(200, { content: [{ type: "application/pdf", content: "JVBE" }], meta: { subject: "s" } })
        const res = await api.content().getContent("d1")
        expect(res.data?.content[0].type).toBe("application/pdf")
        expect(lastRequest(mock)?.url).toBe(`${C}/document/d1`)
        await api.content().getContent("d1", { read: true })
        expect(lastRequest(mock)?.url).toBe(`${C}/document/d1?read=true`)
    })

    it("sendContent sends vad_id as vat_id, drops ssn and wraps a wallet id list", async () => {
        const { api, mock } = mockedApi()
        mock.onPost(`${C}/send/t1`).reply(200, { id: "doc-1" })
        const request = {
            to: { vad_id: "DE123", ssn: "x", email: "a@example.org" },
            type: "letter" as const,
            subject: "Hallo",
            body: [{ type: "application/pdf" as const, content: "JVBE" }],
            wallet_info: ["w1", "w2"],
        }
        const res = await api.content().sendContent("t1", request)
        expect(res.data).toEqual({ id: "doc-1" })
        expect(body(mock)).toEqual({
            to: { vat_id: "DE123", email: "a@example.org" },
            type: "letter",
            subject: "Hallo",
            body: [{ type: "application/pdf", content: "JVBE" }],
            wallet_info: { items: [{ item_id: "w1" }, { item_id: "w2" }] },
        })
        // the caller's object is left alone
        expect(request.to.vad_id).toBe("DE123")
        expect(request.wallet_info).toEqual(["w1", "w2"])
    })

    it("sendContent keeps an explicit vat_id and a wallet_info object", async () => {
        const { api, mock } = mockedApi()
        mock.onPost(`${C}/send/t1`).reply(200, { id: "doc-2" })
        await api.content().sendContent("t1", {
            to: { vat_id: "DE1", vad_id: "DE2" }, type: "letter", subject: "s", body: [],
            wallet_info: { items: [{ item_id: "w" }] },
        })
        expect(body(mock).to).toEqual({ vat_id: "DE1" })
        expect(body(mock).wallet_info).toEqual({ items: [{ item_id: "w" }] })
    })

    it("checkReceiver posts the receiver itself; bulk wraps the list", async () => {
        const { api, mock } = mockedApi()
        mock.onPost(`${C}/receiver/check`).reply(200, { receiver: { type: "email" } })
        mock.onPost(`${C}/receiver/check/bulk`).reply(200, { receivers: [{ type: "email" }, null] })
        const one = await api.content().checkReceiver({ email: "a@example.org" })
        expect(one.data?.receiver.type).toBe("email")
        expect(body(mock)).toEqual({ email: "a@example.org" })
        const many = await api.content().checkMultipleReceivers([{ email: "a@example.org" }, { tel: "+49" }])
        expect(many.data?.receivers).toEqual([{ type: "email" }, null])
        expect(body(mock)).toEqual({ receivers: [{ email: "a@example.org" }, { tel: "+49" }] })
    })

    it("checkReceiver returns 40401 for an unknown receiver", async () => {
        const { api, mock } = mockedApi()
        mock.onPost(`${C}/receiver/check`).reply(404, { code: 40401, message: "receiver not found" })
        const res = await api.content().checkReceiver({ email: "nobody@example.org" })
        expect(res.error?.code).toBe(40401)
        expect(res.error?.status).toBe(404)
    })

    it("getDeliveryStatus flattens the envelope and provides both date names", async () => {
        const { api, mock } = mockedApi()
        const status = { tenant_id: "t", document_id: "d", delivery_mode: "brifle", brifle: { delivered_date: "2026-11-01T00:00:00Z", read: true } }
        mock.onGet(`${C}/document/d/delivery_status`).reply(200, { delivery_status: status })
        const res = await api.content().getDeliveryStatus("d")
        expect(res.data?.delivery_mode).toBe("brifle")
        expect(res.data?.document_id).toBe("d")
        expect(res.data?.brifle?.delivery_date).toBe("2026-11-01T00:00:00Z")
        expect(res.data?.brifle?.delivered_date).toBe("2026-11-01T00:00:00Z")
        expect(res.data?.delivery_status?.delivery_mode).toBe("brifle")
    })

    it("getContentActions exposes the signature reference object typed", async () => {
        const { api, mock } = mockedApi()
        const ref = { managed_by: "brifle", signature_fields: [], document_signatures: [] }
        mock.onGet(`${C}/document/d/actions`).reply(200, {
            signatures: { signature_reference: ref, embedded_signatures: [], document_signatures: { signature_ids: [], signature_reference: "r" } },
            payments: {}, wallet: { items: [{ id: "w1", type: "proof_of_ownership", subject: "Kfz" }] },
        })
        const res = await api.content().getContentActions("d")
        expect(res.data?.signatures.signature_reference_info).toEqual(ref)
        expect(res.data?.signatures.signature_reference as unknown).toEqual(ref)
        expect(res.data?.wallet?.items[0].id).toBe("w1")
    })

    it("cover letters: list, create, delete, content and getCoverLetter", async () => {
        const { api, mock } = mockedApi()
        mock.onGet(`${C}/cover_letter/t/list`).reply(200, { cover_letters: [{ name: "a", display_name: "A", type: "custom" }] })
        mock.onPost(`${C}/cover_letter/t/custom/new`).reply(200, { id: "1", name: "a", display_name: "A", type: "custom", description: "" })
        mock.onDelete(`${C}/cover_letter/t/custom/a/delete`).reply(200, { status: "deleted" })
        mock.onGet(`${C}/cover_letter/t/custom/a/base64`).reply(200, "JVBERi0=")
        expect((await api.content().listCoverLetters("t")).data?.cover_letters).toHaveLength(1)
        const created = await api.content().createCoverLetter("t", "a", "JVBE", "desc")
        expect(created.data?.id).toBe("1")
        expect(body(mock)).toEqual({ name: "a", data: "JVBE", description: "desc" })
        expect((await api.content().deleteCoverLetter("t", "a")).isSuccess).toBe(true)
        const raw = await api.content().getCoverLetterContent("t", "custom", "a", "base64")
        expect(raw.status).toBe(200)
        expect(raw.headers).toBeDefined()
        const wrapped = await api.content().getCoverLetter("t", "custom", "a", "base64")
        expect(wrapped.data).toBe("JVBERi0=")
    })

    it("getCoverLetterContent still throws on an error response", async () => {
        const { api, mock } = mockedApi()
        mock.onGet(`${C}/cover_letter/t/custom/x/pdf`).reply(404, { code: 40400, message: "not found" })
        await expect(api.content().getCoverLetterContent("t", "custom", "x", "pdf")).rejects.toBeTruthy()
        const wrapped = await api.content().getCoverLetter("t", "custom", "x", "pdf")
        expect(wrapped.error?.code).toBe(40400)
    })

    it("getPaperMailPreview returns binary data in Node", async () => {
        const { api, mock } = mockedApi()
        const pdf = new Uint8Array([0x25, 0x50, 0x44, 0x46]).buffer
        mock.onPost(`${C}/preview/t/paper_mail`).reply(200, pdf)
        const res = await api.content().getPaperMailPreview("t", {
            to: { address_line1: "Musterstr. 1", postal_code: "12345", city: "Musterstadt", country: "DE" },
            body: [{ type: "application/pdf", content: "JVBE" }],
        })
        expect(res.isSuccess).toBe(true)
        expect(lastRequest(mock)?.responseType).toBe("arraybuffer")
        expect(body(mock).body).toHaveLength(1)
    })

    it("getDeliveryCertificate passes the data through", async () => {
        const { api, mock } = mockedApi()
        mock.onGet(`${C}/document/d/delivery_certificate`).reply(200, { meta: { id: "c", document_id: "d", type: "aes" }, certificate: "<xml/>" })
        expect((await api.content().getDeliveryCertificate("d")).data?.meta.type).toBe("aes")
    })
})
