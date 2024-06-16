import { Request, Response } from "express";
import User from "../models/User";
import * as joi from "../utils/joi-validators";
import { errorHandler, generateChatifyId } from "../utils/helpers";
import { attachToken, generateToken } from "../utils/jwt";
import bcrypt from "bcryptjs";

export async function signup(req: Request, res: Response) {
    try {
        const { value, error } = joi.signup.validate(req.body);
        if (error) return res.status(400).json(error.message);
        let user = await User.findOne({ email: value.email });
        if (user) return res.status(409).json({ error: "Email has been used" });

        user = await User.create({ ...value, password: await bcrypt.hash(value.password, 10), cPin: await generateChatifyId() });
        res.status(201).json({
            message: `User ${user.displayName} created successfully!`,
            userId: user.id
        });
    } catch (error) {
        errorHandler(res, error);
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { value, error } = joi.login.validate(req.body);
        if (error) return res.status(400).json({ error: error.message });

        let user = await User.findOne({ email: value.email });
        if (!user) return res.status(401).json({ error: "Invalid credentials!" });

        const isValid = await bcrypt.compare(value.password, user.password as string);
        if (!isValid) return res.status(401).json({ error: "Invalid credentials!" });

        const token = generateToken(user);
        attachToken(token, res);
        res.json({ message: "Login successful", token });
    } catch (error) {
        errorHandler(res, error);
    }
}

/**Sign in with Google. User id, email and name is sent from the client */
export async function googleSignOn(req: Request, res: Response) {
    try {
        const { value, error } = joi.googleSignOn.validate(req.body);
        if (error) return res.status(400).json({ error: error.message });

        let user = await User.findOne({ email: value.email });

        if (!user) {
            user = await User.create({
                email: value.email,
                displayName: value.name,
                ssoId: value.id,
                ssoProvider: "Google",
                cPin: await generateChatifyId()
            });
        } else if (!user.ssoProvider) {
            // user exists but has not signed in with Google before
            user.ssoProvider = "Google";
            user.ssoId = value.id;
            await user.save();
        }

        const token = generateToken(user);
        attachToken(token, res);
        res.json({ message: "Login successful", token });
    } catch (error) {
        errorHandler(res, error);
    }
}

// logout for postman
export function logout(req: Request, res: Response) {
    res.clearCookie("token");
    res.json({
        message: "Logout successful",
    });
}