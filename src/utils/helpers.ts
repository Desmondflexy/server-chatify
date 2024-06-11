import { Response } from "express";
import { IChat } from "../types";
import cloudinary from "../config/cloudinary";

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
    return `${chat.members[0].displayName} (You)`;
}

/**Upload image on imagePath to cloudinary and returns image url */
export async function upload2cloud(imagePath: string | undefined, folder: string = "chatify") {
    if (!imagePath) return "";
    try {
    const result = await cloudinary.uploader.upload(imagePath, { folder });
    const imageUrl = result.secure_url;
    return imageUrl;
    } catch (error: any) {
        devLog(error);
        throw new Error(error);
    }
}

/**Deletes image in imageUrl from cloudinary */
export async function deleteFromCloud(imageUrl: string) {
    try {
        // Extract the public ID from the image URL
        const urlParts = imageUrl.split('/');
        const publicIdWithExtension = urlParts.slice(-2).join('/'); // includes folder and file name with extension
        const publicId = publicIdWithExtension.split('.')[0]; // removes the file extension
        const deletionResponse = await cloudinary.uploader.destroy(publicId);
        if (deletionResponse.result === "ok") {
            console.log("Image deleted successfully");
        } else {
            console.warn("Image deletion failed", deletionResponse);
        }
    } catch (error) {
        console.warn("Error deleting image", error);
    }
}