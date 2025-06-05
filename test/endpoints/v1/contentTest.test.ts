import { ApiV1 } from "../../../src/api/api";
import { SignaturesEndpoint } from "../../../src/endpoints/v1/signatures";
import fs from "fs";


describe("ContentEndpoints", () => {
    const endpoint = "https://internaltest-api.brifle.de"
    const api = new ApiV1(endpoint);
    const auth = api.authentication()
    const content = api.content()

    const key = process.env.API_TEST_KEY as string
    const secret = process.env.API_TEST_SECRET as string    
    const tenantId = process.env.API_TEST_TENANT_ID as string
   
    it("test receiver check", async () => {
        const req = await auth.login({
            key: key,
            secret: secret
        })
        // assert that the response is a success
        expect(req.isSuccess).toBe(true)
        expect(req.data).toBeDefined()
        expect(req.data?.access_token).toBeDefined()

        // check if receiver exists
        const firstName = process.env.TEST_RECEIVER_FIRST_NAME as string
        const lastName = process.env.TEST_RECEIVER_LAST_NAME as string
        const dateOfBirth = process.env.TEST_RECEIVER_DATE_OF_BIRTH as string
        const placeOfBirth = process.env.TEST_RECEIVER_PLACE_OF_BIRTH as string
        const receiver = {
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth,
            place_of_birth: placeOfBirth
        }        
        const receiverCheck = await content.checkReceiver({
            birth_information: receiver
        })
        
        expect(receiverCheck.isSuccess).toBe(true)
        expect(receiverCheck.data).toBeDefined()
        expect(receiverCheck.data?.receiver.type).toBeDefined()    
       
    })

    it("test send and get", async () => {

        const req = await auth.login({
            key: key,
            secret: secret
        })
        // assert that the response is a success
        expect(req.isSuccess).toBe(true)
        expect(req.data).toBeDefined()
        expect(req.data?.access_token).toBeDefined()

        // read file and convert to base64
        
        const contentPath = "test/docs/welcome.pdf"
        const contentBuffer = fs.readFileSync(contentPath)
        const contentBase64 = contentBuffer.toString("base64")


        // check if receiver exists
        const firstName = process.env.TEST_RECEIVER_FIRST_NAME as string
        const lastName = process.env.TEST_RECEIVER_LAST_NAME as string
        const dateOfBirth = process.env.TEST_RECEIVER_DATE_OF_BIRTH as string
        const placeOfBirth = process.env.TEST_RECEIVER_PLACE_OF_BIRTH as string
        const receiver = {
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth,
            place_of_birth: placeOfBirth
        }        
        const receiverCheck = await content.checkReceiver({
            birth_information: receiver
        })

        expect(receiverCheck.isSuccess).toBe(true)

        const contentRes = await content.sendContent(tenantId, {
            to: {
                birth_information: receiver
            },
            body: [
                {
                    type: "application/pdf",
                    content: contentBase64
                }
            ],
            subject: "Test JS SDK",
            type: "letter",            
        })

        console.log(contentRes)

        expect(contentRes.isSuccess).toBe(true)
        expect(contentRes.data).toBeDefined()

        const getConent = await content.getContent(contentRes.data?.id as string)
        
        console.log(getConent)

    })
}
)