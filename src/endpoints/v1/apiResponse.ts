import { AxiosError } from "axios";

export class ApiResponse<ResponseType> {

    private _data?: ResponseType
    private _error?: ErrorResponse

    private constructor(data?: ResponseType, error?: ErrorResponse) {
        this._data = data
        this._error = error
    }

    /**
     * create a success response from data
     * @param data - The data to return
     */
    public static success<ResponseType>(data: ResponseType): ApiResponse<ResponseType> {
        return new ApiResponse<ResponseType>(data)
    }

    /**
     * create an error response from an AxiosError
     * @param error - The AxiosError object
     */
    public static error<ResponseType>(error: ErrorResponse): ApiResponse<ResponseType> {
        return new ApiResponse<ResponseType>(undefined, error)
    }

    /**
     * create an error response from an AxiosError
     * @param error - The AxiosError object
     */
    public static errorAxios<ResponseType>(error: AxiosError): ApiResponse<ResponseType> {
        const response = error.response
        if (response === undefined) {
            return ApiResponse.error<ResponseType>({
                code: 50000,
                message: "Unknown error",
                status: 500
            })
        }
        const data = response.data as ErrorResponse
        return ApiResponse.error<ResponseType>({
            code: data.code,
            message: data.message,
            status: response.status
        })
    }

    /**
     * check if the response is a success
     */
    public get isSuccess(): boolean {
        return this._data !== undefined
    }

    /**
     * check if the response is an error
     */
    public get isError(): boolean {
        return this._error !== undefined
    }

    /**
     * get the data from the response
     */
    public get data(): ResponseType | undefined {
        return this._data
    }

    /**
     * get the error from the response
     */
    public get error(): ErrorResponse | undefined {
        return this._error
    }
    
}

export interface ErrorResponse {
    code: number
    message: string
    status: number
}