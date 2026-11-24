import { ApiV1 } from "../../api/api"
import { ApiResponse } from "./apiResponse"
import { CreateWalletItemRequest } from "./requests/wallet"
import { DeleteResponse, WalletItemMeta, WalletItemResponse } from "./responses/wallet"
import { walletCreateWalletItem, walletDeleteWalletItem, walletReadWalletItem } from "../../generated/sdk.gen"
import { call, clientFor } from "../../core/transport"
import type { Client } from "../../generated/client"

/**
 * Wallet items a tenant issues (proofs of ownership or permission). Attach them
 * to a letter with `wallet_info` in `content().sendContent`.
 */
class WalletEndpoints {
    private readonly client: Client

    constructor(api: ApiV1) {
        this.client = clientFor(api)
    }

    /**
     * issues a wallet item
     * @param tenantId - the issuing tenant
     * @param request - the item
     */
    public createItem(tenantId: string, request: CreateWalletItemRequest): Promise<ApiResponse<WalletItemMeta>> {
        return call(walletCreateWalletItem({ client: this.client, path: { tenant: tenantId }, body: request as never, throwOnError: true })) as Promise<ApiResponse<WalletItemMeta>>
    }

    /**
     * reads an issued wallet item
     * @param tenantId - the issuing tenant
     * @param itemId - the item id
     */
    public getItem(tenantId: string, itemId: string): Promise<ApiResponse<WalletItemResponse>> {
        return call(walletReadWalletItem({ client: this.client, path: { tenant: tenantId, id: itemId }, throwOnError: true })) as Promise<ApiResponse<WalletItemResponse>>
    }

    /**
     * revokes an issued wallet item
     * @param tenantId - the issuing tenant
     * @param itemId - the item id
     */
    public revokeItem(tenantId: string, itemId: string): Promise<ApiResponse<DeleteResponse>> {
        return call(walletDeleteWalletItem({ client: this.client, path: { tenant: tenantId, id: itemId }, throwOnError: true })) as Promise<ApiResponse<DeleteResponse>>
    }
}

export {
    WalletEndpoints
}
