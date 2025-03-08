import { errorResponse, GlobalErrorHandler } from "../../utils";

export function errorStructure(primaryMessage:string,statusCode:number,seondaryMessage:string,stack?:any){
    errorResponse.message = primaryMessage
    errorResponse.statusCode = statusCode
    errorResponse.error.stack = {
        message: primaryMessage,
        statusCode: statusCode,
        error: seondaryMessage
    }
    return errorResponse

}