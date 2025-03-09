import { errorResponse, successResponse } from "../../utils";

export function errorStructure(primaryMessage: string, statusCode: number, seondaryMessage: string, stack?: any) {
    errorResponse.message = primaryMessage
    errorResponse.statusCode = statusCode
    errorResponse.error.stack = {
        message: primaryMessage,
        statusCode,
        error: seondaryMessage
    }
    return errorResponse

}

export function successStructure(primaryMessage: string, statusCode: number, seondaryMessage: string, data?: any) {
    successResponse.message = primaryMessage
    successResponse.statusCode = statusCode
    successResponse.data = {
        message: primaryMessage,
        statusCode: statusCode,
        data: data
    }
    return successResponse

}



