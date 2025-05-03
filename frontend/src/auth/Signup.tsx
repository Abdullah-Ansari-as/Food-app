import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { Separator } from "@/components/ui/separator";
import { SignupInputState, userSignupSchema } from "@/schema/userSchema";
import { useUserStore } from "@/store/useUserStore";
import { Loader2, LockKeyhole, Mail, Phone, User } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {

	const [input, setInput] = useState<SignupInputState>({
		fullname: "",
		email: "",
		password: "",
		contact: ""
	});

	const [errors, setErrors] = useState<Partial<SignupInputState>>({});
	const {signup, loading} = useUserStore();

	const navigate = useNavigate();

	const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target;
		setInput({...input, [name]:value})
	}

	const HandleFormSubmit = async (e: FormEvent) => {
		e.preventDefault();

		const result = userSignupSchema.safeParse(input);
		if(!result.success) {
			const fieldErrors = result.error.formErrors.fieldErrors;
			setErrors(fieldErrors as Partial<SignupInputState>);
			return;
		}
		// console.log(input)
		try {
			await signup(input)
			navigate("/auth/verify-email");
		} catch (error) {
			console.log(error)
		}
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
							type="text"
							placeholder="Fullname"
							className="pl-10 focus-visible:ring-0"
							name="fullname"
							value={input.fullname}
							onChange={changeEventHandler}
						/>
						<User className="absolute inset-y-1.5 left-2 text-gray-500 pointer-events-none" />
						{errors && <span className="text-sm text-red-500">{errors.fullname}</span>}
					</div>
				</div>

				<div className="mb-4">
					<div className="relative"> 
						<Input
							type="email"
							placeholder="Email"
							className="pl-10 focus-visible:ring-0"
							name="email"
							value={input.email}
							onChange={changeEventHandler}
						/>
						<Mail className="absolute inset-y-1.5 left-2 text-gray-500 pointer-events-none" />
						{errors && <span className="text-sm text-red-500">{errors.email}</span>}
					</div>
				</div>

				<div className="mb-4">
					<div className="relative"> 
						<Input
							type="password"
							placeholder="Password"
							className="pl-10 focus-visible:ring-0"
							name="password"
							value={input.password}
							onChange={changeEventHandler}
						/>
						<LockKeyhole className="absolute inset-y-1.5 left-2 text-gray-500 pointer-events-none" />
						{errors && <span className="text-sm text-red-500">{errors.password}</span>}
					</div>
				</div>

				<div className="mb-4">
					<div className="relative"> 
						<Input
							type="number"
							placeholder="Phone number"
							className="pl-10 focus-visible:ring-0"
							name="contact"
							value={input.contact}
							onChange={changeEventHandler}
						/>
						<Phone className="absolute inset-y-1.5 left-2 text-gray-500 pointer-events-none" />
						{errors && <span className="text-sm text-red-500">{errors.contact}</span>}
					</div>
				</div>

				<div className="mb-10">
					{
						loading ? 
						<Button disabled className="w-full bg-orange hover:bg-hoverOrange cursor-pointer"><Loader2 className="h-4 w-4 animate-spin"/>please wait</Button>
						:
						<Button type="submit" className="w-full bg-orange hover:bg-hoverOrange cursor-pointer">Signup</Button>
					}
					
				</div>
				<Separator />
				<p className="flex items-center justify-center mt-2">
					Already have an account?&nbsp;
					<Link to="/login" className=" text-blue-500">Login</Link>
				</p>
			</form>
		</div>
	);
};

export default Signup;
