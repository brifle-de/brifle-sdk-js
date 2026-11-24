
import { ApiV1 } from "../../../src/api/api";

describe("StatusEndpoints", () => {
    const endpoint = process.env.API_TEST_ENDPOINT ?? "https://internaltest-api.brifle.de"
    const api = new ApiV1(endpoint);
    const status = api.status();

    it("get by id", async () => {
        const statusRes = await status.getStatus();
        const currentTime = new Date();
        const timestamp = Date.parse(statusRes.data?.timestamp || "");

        const timestampDifference = Math.abs(currentTime.getTime() - timestamp);

        // small difference may occur due to different system clocks
        expect(timestampDifference).toBeLessThan(15000);

        expect(statusRes.data?.status).toBe("ok");
        expect(statusRes.data?.version).toBeDefined();
        expect(statusRes.data?.service).toBe("brifle-system");
        const features = statusRes.data?.features || [];
        expect(features).toBeInstanceOf(Array);
        expect(features).toContain("mailbox");
    });

});