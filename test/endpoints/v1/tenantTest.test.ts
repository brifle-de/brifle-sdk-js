import { ApiV1 } from "../../../src/api/api";

describe("TenantsEndpoints", () => {
    const endpoint = "https://internaltest-api.brifle.de"
    const api = new ApiV1(endpoint);
    const auth = api.authentication()
    const tenants = api.tenants()

    const key = process.env.API_TEST_KEY as string
    const secret = process.env.API_TEST_SECRET as string    
    const tenantId = process.env.API_TEST_TENANT_ID as string


    it("get my", async () => {
        const req = await auth.login({
            key: key,
            secret: secret
        })
        // assert that the response is a success
        expect(req.isSuccess).toBe(true)
        expect(req.data).toBeDefined()
        expect(req.data?.access_token).toBeDefined()

        const myTenants = await tenants.getMy();

        expect(myTenants.isSuccess).toBe(true)
        expect(myTenants.data).toBeDefined()
        expect(myTenants.data?.tenants).toBeDefined()
        expect(myTenants.data?.tenants.length).toBeGreaterThan(0)
        expect(myTenants.data?.total).toBeDefined()
        expect(myTenants.data?.total).toBeGreaterThan(0)
    })

     it("get by id", async () => {
        const req = await auth.login({
            key: key,
            secret: secret
        })
        // assert that the response is a success
        expect(req.isSuccess).toBe(true)
        expect(req.data).toBeDefined()
        expect(req.data?.access_token).toBeDefined()

        const tenantRes = await tenants.getById(tenantId);

        expect(tenantRes.isSuccess).toBe(true)
        expect(tenantRes.data).toBeDefined()
        expect(tenantRes.data?.id).toBeDefined()
        expect(tenantRes.data?.id).toBe(tenantId)
        expect(tenantRes.data?.name).toBeDefined()
    })

});