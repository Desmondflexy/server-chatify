import { Response } from "express";

/** Returns internal server error message with status code 500 */
export function errorHandler(res: Response, error: any) {
    devLog(error.message);
    res.status(500).json("Internal Server Error!");
}

/** Log messages only in development mode */
export function devLog(message: unknown) {
    if (process.env.NODE_ENV !== "production") {
        console.log(message);
    }
}


export function generateChatifyId() {

}