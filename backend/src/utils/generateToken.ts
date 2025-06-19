import { Response } from "express";
import jwt from "jsonwebtoken";
import { IUserDocument } from "../models/user-model";

export const generateToken = (res: Response, user: IUserDocument) => {
	const isProduction = process.env.NODE_ENV === "production";
	const token = jwt.sign({userId: user?._id}, process.env.TOKEN_SECRET_KEY!, {expiresIn: "1d"});

	// ********* this is recomended for production
	res.cookie("token", token, {
				httpOnly: true,
				sameSite: isProduction ? "none" : "lax",
				secure: isProduction, // only send over HTTPS
				maxAge: 24 * 60 * 60 * 1000,
			})

	// ********** token problem with this in production
	// res.cookie("token", token, {httpOnly: true, sameSite: "strict", maxAge: 24 * 60 * 60 * 1000});
	
	return token;
};