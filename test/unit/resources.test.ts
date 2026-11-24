import { body, ENDPOINT, lastRequest, mockedApi } from "./helpers"

describe("mailbox", () => {
    it("inbox and outbox post filter and page; outbox can filter by sender user", async () => {
        const { api, mock } = mockedApi()
        mock.onPost(`${ENDPOINT}/v1/mailbox/inbox`).reply(200, { results: [], total: 0 })
        mock.onPost(`${ENDPOINT}/v1/mailbox/outbox/t`).reply(200, { results: [{ id: "1", payable: true }], total: 1 })
        await api.mailbox().getInbox({ state: ["unread"] })
        expect(body(mock)).toEqual({ filter: { state: ["unread"] }, page: 1 })
        const out = await api.mailbox().getOutbox("t", {}, 2)
        expect(out.data?.results[0].payable).toBe(true)
        expect(body(mock)).toEqual({ filter: {}, page: 2 })
        await api.mailbox().getOutbox("t", {}, 1, { sender_user: "u1" })
        expect(body(mock)).toEqual({ filter: {}, page: 1, sender_user: "u1" })
    })
})

describe("tenants, accounts, address, status", () => {
    it("call the right paths", async () => {
        const { api, mock } = mockedApi()
        mock.onGet(`${ENDPOINT}/v1/tenants/id/t1`).reply(200, { id: "t1", name: "Firma" })
        mock.onGet(`${ENDPOINT}/v1/accounts/a1`).reply(200, { company_name: "Firma", type: "business" })
        mock.onPost(`${ENDPOINT}/v1/address/parse`).reply(200, { street: "Musterstr." })
        mock.onPost(`${ENDPOINT}/v1/address/parse_and_expand`).reply(200, [{ street: "Musterstr." }])
        expect((await api.tenants().getById("t1")).data?.name).toBe("Firma")
        expect((await api.accounts().getById("a1")).data?.type).toBe("business")
        expect((await api.address().parseAddress({ address: "Musterstr. 1" })).data?.street).toBe("Musterstr.")
        expect((await api.address().parseAndExpandAddress({ address: "x" })).data).toHaveLength(1)
    })

    it("status needs no token", async () => {
        const { api, mock } = mockedApi()
        api.apiState.auth_token = undefined
        mock.onGet(`${ENDPOINT}/v1/status`).reply(200, { status: "ok", version: "1.1.0" })
        const res = await api.status().getStatus()
        expect(res.data?.status).toBe("ok")
        expect(lastRequest(mock)?.headers?.Authorization).toBeUndefined()
    })
})

describe("contracts", () => {
    const T = `${ENDPOINT}/v1/contract/t`

    it("create maps signer receivers like letters", async () => {
        const { api, mock } = mockedApi()
        mock.onPost(T).reply(200, { id: "c1", status: "pending", signers: [] })
        const res = await api.contracts().create("t", {
            title: "Vertrag", document: { content: "JVBE", file_name: "v.pdf" },
            signature_format: "pades", required_level: "m-ses",
            signers: [{ to: { vad_id: "DE1" }, order: 1 }],
        })
        expect(res.data?.id).toBe("c1")
        expect(body(mock).signers).toEqual([{ to: { vat_id: "DE1" }, order: 1 }])
    })

    it("list, get, cancel, events, signatures, document, signature", async () => {
        const { api, mock } = mockedApi()
        mock.onGet(new RegExp(`^${T}(\\?.*)?$`)).reply(200, { contracts: [], total: 0 })
        mock.onGet(`${T}/c1`).reply(200, { id: "c1" })
        mock.onPost(`${T}/c1/cancel`).reply(409, { code: 40903, message: "contract not open" })
        mock.onGet(`${T}/c1/events`).reply(200, { events: [{ event: "created", at: "2026-11-24T00:00:00Z" }] })
        mock.onGet(`${T}/c1/signatures`).reply(200, { signatures: [{ signer_id: "s1" }] })
        mock.onGet(new RegExp(`^${T}/c1/document`)).reply(200, new ArrayBuffer(4))
        mock.onGet(`${T}/c1/signatures/s1`).reply(200, "<xades/>")
        await api.contracts().list("t", { status: "pending", page: 2 })
        expect(lastRequest(mock)?.url).toBe(`${T}?status=pending&page=2`)
        expect((await api.contracts().get("t", "c1")).data?.id).toBe("c1")
        expect((await api.contracts().cancel("t", "c1")).error?.code).toBe(40903)
        expect((await api.contracts().getEvents("t", "c1")).data?.events[0].event).toBe("created")
        expect((await api.contracts().listSignatures("t", "c1")).data?.signatures[0].signer_id).toBe("s1")
        await api.contracts().getDocument("t", "c1")
        expect(lastRequest(mock)?.url).toBe(`${T}/c1/document?revision=current`)
        expect((await api.contracts().getSignature("t", "c1", "s1")).data).toBe("<xades/>")
    })

    it("reports a disabled feature as 40499", async () => {
        const { api, mock } = mockedApi()
        mock.onGet(T).reply(404, { code: 40499, message: "feature not enabled" })
        expect((await api.contracts().list("t")).error?.code).toBe(40499)
    })
})

describe("wallet", () => {
    it("create, read, revoke", async () => {
        const { api, mock } = mockedApi()
        const W = `${ENDPOINT}/v1/wallet/items/issued/t`
        mock.onPost(`${W}/create`).reply(201, { id: "w1", type: "proof_of_ownership", subject: "Kfz" })
        mock.onGet(`${W}/read/w1`).reply(200, { meta: { id: "w1" }, data: { elements: [] } })
        mock.onDelete(`${W}/revoke/w1`).reply(200, { status: "deleted" })
        const created = await api.wallet().createItem("t", { type: "proof_of_ownership", subject: "Kfz", data: { elements: [{ name: "Kennzeichen", type: "text", value: "B-XY 1" }] } })
        expect(created.data?.id).toBe("w1")
        expect((await api.wallet().getItem("t", "w1")).data?.meta.id).toBe("w1")
        expect((await api.wallet().revokeItem("t", "w1")).data?.status).toBe("deleted")
    })
})

describe("signature (deprecated)", () => {
    it("still works", async () => {
        const { api, mock } = mockedApi()
        mock.onPost(`${ENDPOINT}/v1/signature/t/reference`).reply(200, { id: "r1", managed_by: "brifle", signature_fields: [] })
        mock.onGet(`${ENDPOINT}/v1/signature/s1/export/xml`).reply(200, "<xades/>")
        expect((await api.signature().createSignatureReference("t", { fields: [{ name: "a", purpose: "p", role: "receiver" }] })).data?.id).toBe("r1")
        expect((await api.signature().exportSignature("s1", "xml")).data).toBe("<xades/>")
    })
})
