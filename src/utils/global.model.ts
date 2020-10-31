import { Request, Response } from 'express';
import { IUserPayload } from '../auth/interfaces/jwt-payload.interface';
import { responseException } from './response.middleware';

export interface CustomRequest extends Request {
    user: IUserPayload;
}

export interface CustomResponse extends Response {
    responseException: typeof responseException;
}