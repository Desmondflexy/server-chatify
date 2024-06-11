import { Response, Request } from 'express';
import { deleteFromCloud, errorHandler, upload2cloud } from '../utils/helpers';
import User from '../models/user';
import * as joi from '../utils/joi-validators';
import { IUser } from '../types';

export function me(req: Request, res: Response) {
    return res.json(req.user);
}

export async function allUsers(req: Request, res: Response) {
    try {
        const users = await User.find().select('email displayName phone');
        return res.json({
            noOfUsers: users.length,
            users,
        });

    } catch (error) {
        errorHandler(res, error);
    }
}

export async function getUserByEmail(req: Request, res: Response) {
    try {
        const { email } = req.query;
        const user = await User.findOne({ email }).select('email displayName phone');
        if (!user) return res.status(404).json("User not found");
        return res.json(user);
    } catch (error) {
        errorHandler(res, error);
    }
}

export async function getUserById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('email displayName phone picture');
        if (!user) return res.status(404).json("User not found");
        return res.json(user);
    } catch (error) {
        errorHandler(res, error);
    }
}

// controller to update displayNmame, phone or picture
export async function updateUser(req: Request, res: Response) {
    try {
        const { error, value } = joi.updateProfile.validate(req.body);
        if (error) return res.status(400).json(error.message);
        const userId = req.user.id;
        const user = (await User.findById(userId)) as IUser;
        if (value.displayName) user.displayName = value.displayName;
        if (value.phone) user.phone = value.phone;
        // update profile picture
        if (req.file) {
            if (req.file.size > 3 * 1000 * 1000) {
                return res.status(400).json({
                    message: "Bad request",
                    error: "Picture size should not exceed 3 MB",
                });
            }
            if (user.picture) await deleteFromCloud(user.picture);
            user.picture = await upload2cloud(req.file.path);
        }
        await user.save();
        return res.json(user);
    } catch (error) {
        errorHandler(res, error);
    }
}

export async function deleteProfilePicture(req: Request, res: Response) {
    try {
        const user = (await User.findById(req.user.id)) as IUser;
        if (!user.picture) return res.status(400).json("Profile picture not found");
        await deleteFromCloud(user.picture);
        user.picture = "";
        await user.save();
        return res.json(user);
    } catch (error) {
        errorHandler(res, error);
    }
}