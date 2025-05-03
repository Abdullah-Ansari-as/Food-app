import { string, z } from "zod";

export const userSignupSchema = z.object({
    fullname: z.string().min(1, "Full name is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(3, "password must be atleast 3 characters"),
    contact: z.string().min(10, "contact number must be atleast 10 digits"),
});

export type SignupInputState = z.infer<typeof userSignupSchema>;

export const userLoginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(3, "password must be atleast 3 characters"),
});

export type LoginInputState = z.infer<typeof userLoginSchema>;

export const newPasswordSchema = z.object({
    newPassword: z.string().min(3, "password must be atleast 3 characters"),
        confirmPassword: z.string(),
    }).refine((data) => data.newPassword === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

export type NewPasswordSchema = z.infer<typeof newPasswordSchema>;
