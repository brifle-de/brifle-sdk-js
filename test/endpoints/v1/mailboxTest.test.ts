import { assert } from "console";
import { ApiV1 } from "../../../src/api/api";
import { MailboxEndpoints } from "../../../src/endpoints/v1/mailbox";

describe("MailboxEndpoints", () => {
    const endpoint = "https://internaltest-api.brifle.de"
    const api = new ApiV1(endpoint);
    const auth = api.authentication()
    const mailbox = api.mailbox()

    const key = process.env.API_TEST_KEY as string
    const secret = process.env.API_TEST_SECRET as string    
    const tenantId = process.env.API_TEST_TENANT_ID as string


    it("test outbox", async () => {
        const req = await auth.login({
            key: key,
            secret: secret
        })
        console.log(req)
        // assert that the response is a success
        expect(req.isSuccess).toBe(true)
        expect(req.data).toBeDefined()
        expect(req.data?.access_token).toBeDefined()

        const outbox = await mailbox.getOutbox(tenantId, {
            state: ["active"]
        }, 1);

        expect(outbox.isSuccess).toBe(true)
        expect(outbox.data).toBeDefined()
        expect(outbox.data?.results).toBeDefined()
        expect(outbox.data?.results.length).toBeGreaterThan(0)
        expect(outbox.data?.total).toBeDefined()
        expect(outbox.data?.total).toBeGreaterThan(0)
    })

     it("test inbox", async () => {
        const req = await auth.login({
            key: key,
            secret: secret
        })
        console.log(req)
        // assert that the response is a success
        expect(req.isSuccess).toBe(true)
        expect(req.data).toBeDefined()
        expect(req.data?.access_token).toBeDefined()

        const inbox = await mailbox.getInbox({
            state: ["read", "unread"]
        }, 1);

        expect(inbox.isSuccess).toBe(true)
        expect(inbox.data).toBeDefined()
        expect(inbox.data?.results).toBeDefined()
        expect(inbox.data?.results.length).toBeGreaterThan(0)
        expect(inbox.data?.total).toBeDefined()
        expect(inbox.data?.total).toBeGreaterThan(0)
    })

});