import { User } from "../models/users.js";
import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config';
import fs from "fs/promises";
import gravatar from "gravatar";
import path from "path";
import Jimp from "jimp";
import { nanoid } from "nanoid";
import sendEmail from "../helpers/SendEmail.js";

const { SECRET_KEY, BASE_URL } = process.env;

const avatarDir = path.resolve("public", "avatars");

export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            throw HttpError(409, "Email in use");
        }
        const avatarURL = gravatar.url(email);
        const hashPassword = await bcrypt.hash(password, 10);
        const verificationToken = nanoid();

        const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken });
        
        const verifyEmail = {
            to: email,
            subject: "Verify email",
            html: `<a target="_blank" href = "${BASE_URL}/api/users/verify/${verificationToken}" >Click verify email</a>`
        }
        await sendEmail(verifyEmail);

        res.status(201).json(
            {
                user: {
                    email: newUser.email,
                    subscription: newUser.subscription,
                    avatarURL:newUser.avatarURL
                }
            })
    } catch (error) {
        next(error)
    }
};

export const verifyEmail = async (req, res, next) => {
    try {
        const { verificationToken } = req.params;
        const user = await User.findOne({ verificationToken });

        if (!user) {
            throw HttpError(404, "User not found");
        }
        await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });
        res.json({
            message: "Email verify success"
        });
    } catch (error) {
        next(error)
    }
};

export const resendVerifyEmail = async(req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            throw HttpError(404, "User not found");           
        }
        if (user.verify) {
            throw HttpError(400, "Verification has already been passed");
        }
        
        const verifyEmail = {
            to: email,
            subject: "Verify email",
            html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`,
        };
        
        await sendEmail(verifyEmail);

        res.json({
            message: "Verify email send success",
  });
    } catch (error) {
        next(error)
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw HttpError(401, "Email or password is wrong");
        }

        if (!user.verify) {
            throw HttpError(401, "Email not verified");
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            throw HttpError(401, "Email or password is wrong");           
        }
        const payload = {
            id: user._id
        }
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
        await User.findByIdAndUpdate(user._id, { token });
        
        res.status(200).json({
            token,
            user: {
                email: user.email,
                subscription: user.subscription,
            }
        })
    } catch (error) {
        next(error)
    }
}

export const getCurrent = async (req, res, next) => {
    try {
        const { email, subscription } = req.user;
        res.json({
            email,
            subscription,
        })
    } catch (error) {
        next(error)
    }
}

export const logout = async (req, res, next) => {
    try {
        const { _id } = req.user;
        await User.findOneAndUpdate(_id, { token: '' });
        throw HttpError(204);        
    } catch (error) {
        next(error)
    }
}

export const updateAvatar = async (req, res, next) => {
    try {
        const { _id } = req.user;
        const { path: tempUpload, originalname } = req.file;
        if (!req.file) {
            throw HttpError(400);  
        }
        const filename = `${_id}_${originalname}`;
        const resultUpload = path.join(avatarDir, filename);

        const img = await Jimp.read(tempUpload);
        await img.resize(250, 250).quality(60).write(tempUpload);

        await fs.rename(tempUpload, resultUpload);
        const avatarURL = path.join("avatars", filename);
        await User.findByIdAndUpdate(_id, { avatarURL });

        res.json({
            avatarURL
        })

    } catch (error) {
        next (error)
    }
}
