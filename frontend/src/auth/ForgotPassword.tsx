import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/useUserStore";
import { Loader2, Mail } from "lucide-react";
import React, { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState<string>("");
    const {loading, forgotPassword} = useUserStore(); 

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try { 
            await forgotPassword(email)
        } catch (error) {
            console.log(error)
        }
    }
    
    return (
        <div className="flex items-center justify-center w-full min-h-screen">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:p-8 w-full max-w-md rounded-lg mx-4">
                <div className="text-center">
                    <h1 className="font-extrabold text-2xl mb-2">
                        Forgot Password
                    </h1>
                    <p className="text-sm text-gray-600 ">
                        Enter your Email Address to reset your password
                    </p>
                </div>
                <div className="relative">
                    <Input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter you Email"
                        className="pl-10"
                    />
                    <Mail className="absolute inset-1.5 left-2 text-gray-600 pointer-events-none " />
                </div>
                {loading ? (
                    <Button disabled className="bg-orange hover:bg-hoverOrange">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        please wait
                    </Button>
                ) : (
                    <Button type="submit" className="bg-orange hover:bg-hoverOrange cursor-pointer">
                        Send Reset Link
                    </Button>
                )}
                <p className="text-center mt-2">
                    Back to&nbsp;
                    <Link to="/login" className=" text-blue-500">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default ForgotPassword;
