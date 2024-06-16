import { Response, Request, NextFunction } from 'express';
import { deleteFromCloud, errorHandler, upload2cloud } from '../utils/helpers';
import User, { IUser } from '../models/User';
import * as joi from '../utils/joi-validators';

export function me(req: Request, res: Response) {
    return res.json(req.user);
}

export async function allUsers(req: Request, res: Response) {
    try {
        const users = await User.find().select('email displayName phone cPin');
        return res.json({
            noOfUsers: users.length,
            users,
        });

    } catch (error) {
        errorHandler(res, error);
    }
}

export async function getUserByCPin(req: Request, res: Response) {
    try {
        const { cPin } = req.query;
        const user = await User.findOne({ cPin }).select('email displayName phone cPin picture');
        if (!user) return res.status(404).json({ error: "User not found" });
        return res.json(user);
    } catch (error) {
        errorHandler(res, error);
    }
}

export async function getUserById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('email displayName phone picture cPin');
        if (!user) return res.status(404).json({ error: "User not found" });
        return res.json(user);
    } catch (error) {
        errorHandler(res, error);
    }
}

// controller to update displayName, phone or picture
export async function updateUser(req: Request, res: Response) {
    try {
        const { error, value } = joi.updateProfile.validate(req.body);
        if (error) return res.status(400).json({ error: error.message });
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
        if (!user.picture) return res.status(400).json({ error: "Profile picture not found" });
        await deleteFromCloud(user.picture);
        user.picture = "";
        await user.save();
        return res.json(user);
    } catch (error) {
        errorHandler(res, error);
    }
}

export async function getFriendByCPin(req: Request, res: Response, next: NextFunction) {
    try {
        const cPin = req.query.cPin as string;
        if (!cPin) return res.status(400).json({ error: "Chatify pin is required in the query params" });
        const user = await User.findOne({ cPin: cPin.toUpperCase() });
        if (!user) return res.status(404).json({ error: "User not found" });
        req.body.friend = user;
        next();
    }
    catch (error) {
        errorHandler(res, error);
    }
}

export async function deleteUserById(req: Request, res: Response) {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "user not found" });
        user.deleteOne();
    } catch (error) {
        errorHandler(res, error);
    }
}