import { Response } from "express";
import http from "http";

function isOk(httpCode: number) {
    return httpCode >= 200 && httpCode < 300;
}

type Options = {
    msg?: string
    format?: boolean
    [key: string]: unknown
}

export function apiResponse(res: Response, httpCode: number, options?: Options) {
    const json = {
        ...options,
        format: undefined,
        httpCode,
        msg: options?.msg || http.STATUS_CODES[httpCode],
        ok: isOk(httpCode) 
    };

    const jsonStr = options?.format ? JSON.stringify(json, null, 2) : JSON.stringify(json);

    res.status(httpCode).contentType("application/json").end(jsonStr);
}