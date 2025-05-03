import { Request, Response } from "express";
import { User } from "../models/user-model";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import cloudinary from "../utils/cloudinary";
import { generateVerificationCode } from "../utils/generateVerificationCode";
import { generateToken } from "../utils/generateToken";    
import { sendEmail, sendPasswordResetEmail, sendResetSuccessEmail, sendWelcomeEmail } from "../utils/nodemailer/sendEmails";
 

interface AuthRequest extends Request {
  id: string;
}




const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fullname, email, password, contact } = req.body;

        let existedUser = await User.findOne({ email });
        if (existedUser) {
            return res.status(400).json({
                success: false,
                message: "user already exists with this email",
            }) as unknown as void;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateVerificationCode();

        const user = await User.create({
            fullname,
            email,
            password: hashedPassword,
            contact: Number(contact),
            verificationToken, 
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours in milliseconds
        });

        // jwt token
        generateToken(res, user);

		// send Emails to users
		const subject = `Welcome to FsdFoods, ${fullname}!`;
		await sendEmail(email, subject, verificationToken, fullname)

        // await sendVerificationEmail(email, fullname, verificationToken); 
		
        const userWithoutPassword = await User.findOne({ email }).select(
            "-password"
        );

        return res.status(200).json({
            success: true,
            message: "Account created successfully",
            user: userWithoutPassword,
        }) as unknown as void;
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" }) as unknown as void;;
    }
};

const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "incorrect email or password",
            })as unknown as void;
        };

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "incorrect email or password",
            })as unknown as void;
        }

        generateToken(res, user)
        user.lastLogin = new Date();
        await user.save();

		const userWithoutPassword = await User.findOne({ email }).select(
            "-password"
        );

		return res.status(200).json({
			success: true,
			message: `Welcome back ${user.fullname}`,
			user: userWithoutPassword
		})as unknown as void;

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })as unknown as void;
    }
};

const verifyEmail = async (req: Request, res: Response): Promise<void> => {
	try {
		const {verificationCode} = req.body;
		// console.log(verificationCode); 
		const user = await User.findOne({verificationToken: verificationCode, verificationTokenExpiresAt: {$gt: Date.now()}}).select("-password");
		// console.log(user)
		if(!user){
			return res.status(400).json({
				success: false,
				message: "Invalid or expire verification token"
			})as unknown as void
		};

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();

		// send welcome email
		await sendWelcomeEmail(user.email, user.fullname);
		// await sendWelcomeEmail(user.email, user.fullname)


		return res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user
		})as unknown as void

	} catch (error) {
		console.log(error);
        return res.status(500).json({ message: "Internal server error" }) as unknown as void;
	}
}

const logout = async (_: Request, res: Response): Promise<void> => {
	try {
		return res.clearCookie("token").status(200).json({
			success: true,
			message: "Logged out successfully"
		})as unknown as void
	} catch (error) {
		console.log(error);
        return res.status(500).json({ message: "Internal server error" }) as unknown as void;
	}
};

const forgotPassword = async (req: Request, res: Response): Promise<void> => {
	try {
		const {email} = req.body;
		const user = await User.findOne({email});
		if(!user) {
			return res.status(400).json({
				success: false,
				message: "user doesn't exist"
			})as unknown as void
		}; 

		const resetToken = crypto.randomBytes(40).toString('hex');
		const resetTokenExpiresAt = new Date(Date.now()+1*60*60*1000);

		user.resetPasswordToken = resetToken;
		user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
		await user.save();

		// send email
		await sendPasswordResetEmail(user.email, user.fullname, `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`);

		return res.status(200).json({
			success: true,
			message: "Password reset link sent to your email"
		})as unknown as void;

	} catch (error) {
		console.log(error);
        return res.status(500).json({ message: "Internal server error" })as unknown as void;
	}
}

const resetpassword = async (req: Request, res: Response): Promise<void> => {
	try {
		const {token} = req.params;
		const {newPassword} = req.body; 

		const user = await User.findOne({resetPasswordToken: token, resetPasswordTokenExpiresAt: {$gt: Date.now()}});

		if(!user) {
			return res.status(400).json({
				success: false,
				message: "Invalid or expired reset token"
			})as unknown as void
		}

		// update new password
		const hashedPassword = await bcrypt.hash(newPassword, 10);
		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordTokenExpiresAt = undefined; 

		await user.save();

		// send success reset email;
		await sendResetSuccessEmail(user.email);

		return res.status(200).json({
			success: true,
			message: "Password rest successfully"
		})as unknown as void

	} catch (error) {
		console.log(error);
        return res.status(500).json({ message: "Internal server error" })as unknown as void;
	}
}

const checkAuth = async (req: AuthRequest, res: Response): Promise<void> => {
	try {
		const userId = req.id;
		const user = await User.findById(userId).select("-password");
		if(!user) {
			return res.status(404).json({
				success: false,
				message: "User not found"
			})as unknown as void
		}

		return res.status(200).json({
			success: true,
			user
		})as unknown as void;
		
	} catch (error) {
		console.log(error);
        return res.status(500).json({ message: "Internal server error" }) as unknown as void;
	}
}

const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
	try {
		const userId = req.id;
		const {fullname, profile, address, city, country, profilePicture} = req.body;
		
		// upload image on cloudinary 
		let cloudResponse: any; 

		cloudResponse = await cloudinary.uploader.upload(profilePicture);
		 
		const updatedData = {fullname, profile, address, city, country, profilePicture};

		const user = await User.findByIdAndUpdate(userId, updatedData, {new: true}).select("-password");

		return res.status(200).json({
			success: true,
			user,
			message: "Profile Updated Successfully"
		})as unknown as void;

	} catch (error) {
		console.log(error);
        return res.status(500).json({ message: "Internal server error" })as unknown as void;
	}
}


export {
	 signup,
	 login,
	 verifyEmail,
	 logout,
	 forgotPassword,
	 resetpassword,
	 checkAuth,
	 updateProfile
 };
