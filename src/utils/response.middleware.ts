import { HttpStatus } from "@nestjs/common";
import { CustomRequest, CustomResponse } from "./global.model";

// export type ResponseEntityType = { 
//     data?: any, 
//     status?: number
// }

// export type ResponseListType = { 
//     data: Array<any>, 
//     status?: number,
//     pagination: any
// }

export type responseException = {
    message: object;
    status: number;
}

// export function responseEntity({data, status}: ResponseEntityType): void{
//     this
//         .status(status || HttpStatus.OK)
//         .json({ data: data } || { } );
// }

// export function responseList({data, status, pagination}: ResponseListType): void{
//     this
//         .status(status || HttpStatus.OK)
//         .json({ data: data, pagination: pagination } || { } );
// }

export function responseException({message, status}: responseException): void{
    this
        .status( status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: message } || { message: "Internal server error." });
}

export function ResponseMiddleware(req: CustomRequest, res: CustomResponse, next: Function){
    res.responseException = responseException.bind(res);
    next();
    }
