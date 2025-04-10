import { assert } from "console";
import { ApiV1 } from "../../../src/api/api";
import { SignaturesEndpoint } from "../../../src/endpoints/v1/signatures";


describe("AuthenticationEndpoints", () => {
    const endpoint = "https://internaltest-api.brifle.de"
    const api = new ApiV1(endpoint);
    const auth = api.authentication()
    const signature = api.signature()

    const key = process.env.API_TEST_KEY as string
    const secret = process.env.API_TEST_SECRET as string    
    const tenantId = process.env.API_TEST_TENANT_ID as string
   
    it("test signing request", async () => {

        const req = await auth.login({
            key: key,
            secret: secret
        })
        // assert that the response is a success
        expect(req.isSuccess).toBe(true)
        expect(req.data).toBeDefined()
        expect(req.data?.access_token).toBeDefined()

        // issue new signature reference
        const sigReq = await signature.createSignatureReference(tenantId, {
            fields: [
                {
                    name: "test field",
                    purpose: "just for an sdk test",
                    role: "tester"
                }
            ]
        });
        expect(sigReq.isSuccess).toBe(true)
        expect(sigReq.data).toBeDefined()
        expect(sigReq.data?.id).toBeDefined()
    })
}
)