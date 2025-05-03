import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { Separator } from "@/components/ui/separator";
import { LoginInputState, userLoginSchema } from "@/schema/userSchema";
import { useUserStore } from "@/store/useUserStore";
import { Loader2, LockKeyhole, Mail } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {

    const [input, setInput] = useState<LoginInputState>({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState<Partial<LoginInputState>>({});
    const {login, loading} = useUserStore();

    const navigate = useNavigate();

    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setInput({...input, [name]:value})
    }

    const HandleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const result = userLoginSchema.safeParse(input);
        // console.log(result);

        if(!result.success) {
            const fieldErrors = result.error.formErrors.fieldErrors;
            setErrors(fieldErrors as Partial<LoginInputState>);
            return;
        }
        // login api implementation starts here
        try {
            await login(input);
            navigate("/");
        } catch (error) {
            console.log(error)
        }
        // console.log(input)
    }

 
    return (
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={HandleFormSubmit} className="md:p-8 w-full max-w-md md:border border-gray-200 mx-4 rounded-lg">
                <div className="mb-4 flex items-center justify-center">
                    <h1 className="font-bold text-2xl">FsdFoods</h1>
                </div>
                <div className="mb-4">
                    <div className="relative"> 
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10 focus-visible:ring-0"
                            name="email"
                            value={input.email}
                            onChange={changeEventHandler}
                        />
                        <Mail className="absolute inset-y-1.5 left-2 text-gray-500 pointer-events-none" />
                        {errors && <span className="text-sm text-red-500">{errors.email}</span>}
                    </div>
                </div>

                <div className="mb-6">
                    <div className="relative"> 
                        <Input
                            type="password"
                            placeholder="Enter your password"
                            className="pl-10 focus-visible:ring-0"
                            name="password"
                            value={input.password}
                            onChange={changeEventHandler}
                        />
                        <LockKeyhole className="absolute inset-y-1.5 left-2 text-gray-500 pointer-events-none" />
                        {errors && <span className="text-sm text-red-500">{errors.password}</span>}
                    </div>
                </div>
				<div className="mb-6">
					{
						loading ? 
						<Button disabled className="w-full bg-orange hover:bg-hoverOrange cursor-pointer"><Loader2 className="h-4 w-4 animate-spin"/>please wait</Button>
						:
						<Button type="submit" className="w-full bg-orange hover:bg-hoverOrange cursor-pointer">Login</Button>
					}
					
				</div>
                <div className="flex items-center justify-center mb-4 ">
                <Link to={"/auth/forgot-password"} className="text-blue-400 hover:underline hover:text-blue-500">Forgot Password</Link>
                </div>
				<Separator />
				<p className="flex items-center justify-center mt-2 ">
                    Don't have an account?&nbsp;
                    <Link to="/signup" className=" text-blue-500">Signup</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
