import { Response } from "express";
import { IChat } from "../types";

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

/** Returns the chat name based on the number of members */
export async function getChatName(chat: IChat, userId: string) {
    chat = await chat.populate('members');
    if (chat.members.length > 2) return "GroupName";
    if (chat.members.length > 1) return chat.members.find(i => i.id !== userId)?.displayName as string;
    return  `${chat.members[0].displayName} (You)`;
}