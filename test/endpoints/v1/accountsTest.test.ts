
import { ApiV1 } from "../../../src/api/api";

describe("AccountsEndpoints", () => {
    const endpoint = "https://internaltest-api.brifle.de"
    const api = new ApiV1(endpoint);
    const auth = api.authentication()
    const accounts = api.accounts()

    const key = process.env.API_TEST_KEY as string
    const secret = process.env.API_TEST_SECRET as string    
    const accountId = process.env.API_TEST_ACCOUNT_ID as string


     it("get by id", async () => {
        const req = await auth.login({
            key: key,
            secret: secret
        })
        // assert that the response is a success
        expect(req.isSuccess).toBe(true)
        expect(req.data).toBeDefined()
        expect(req.data?.access_token).toBeDefined()

        const accountsRes = await accounts.getById(accountId);


        expect(accountsRes.isSuccess).toBe(true)
        expect(accountsRes.data).toBeDefined()
        expect(accountsRes.data?.first_name).toBeDefined()
        expect(accountsRes.data?.last_name).toBeDefined()
        expect(accountsRes.data?.type).toBeDefined()
    })

});