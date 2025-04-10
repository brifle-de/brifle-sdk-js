import { ApiV1 } from "../../../src/api/api";
import { AuthenticationEndpoints } from "../../../src/endpoints/v1/authentication";


describe("AuthenticationEndpoints", () => {
    const endpoint = "https://internaltest-api.brifle.de"
    const api = new ApiV1(endpoint).authentication()

    const key = process.env.API_TEST_KEY as string
    const secret = process.env.API_TEST_SECRET as string    

    it("should create an instance of AuthenticationEndpoints", () => {
        expect(api).toBeInstanceOf(AuthenticationEndpoints)
    })

    // check login
    it("invalid password", async () => {
        const req = await api.login({
            key: "test",
            secret: "test"
        })
        // assert that the response is an error
        expect(req.isError).toBe(true)
        expect(req.error).toBeDefined()
        expect(req.error?.code).toBe(40101)        
    })
    it("valid password", async () => {

        const req = await api.login({
            key: key,
            secret: secret
        })
        // assert that the response is a success
        expect(req.isSuccess).toBe(true)
        expect(req.data).toBeDefined()
        expect(req.data?.access_token).toBeDefined()
    })
}
)