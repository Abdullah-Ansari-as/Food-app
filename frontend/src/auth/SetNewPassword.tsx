import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label' 
import { newPasswordSchema, NewPasswordSchema } from '@/schema/userSchema'
import { useUserStore } from '@/store/useUserStore'
import { Loader2, LockKeyhole, Mail } from 'lucide-react'
import React, { ChangeEvent, FormEvent, useState } from 'react' 
import { useNavigate, useParams } from 'react-router-dom'

const SetNewPassword = () => { 
	const params = useParams(); 
	const navigate = useNavigate();

	const {loading, resetPassword} = useUserStore();
	const [input, setInput] = useState<NewPasswordSchema>({
		newPassword: "",
		confirmPassword: ""
	}); 
	const [errors, setErrors] = useState<Partial<NewPasswordSchema>>({});

	const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
		const {name, value} = e.target;
		setInput({...input, [name]:value});
	}

	const HandleFormSubmit = async (e: FormEvent) => {
		e.preventDefault();

		const result = newPasswordSchema.safeParse(input);
		if(!result.success) {
			const fieldErrors = result.error.formErrors.fieldErrors;
			setErrors(fieldErrors as Partial<NewPasswordSchema>);
			return;
		} 

		try {
			await resetPassword(params.resetLink!, input.newPassword)
			navigate("/login")
		} catch (error) {
			console.log(error)
		}
	}
  return (
	<div>
	  <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={HandleFormSubmit} className="md:p-8 w-full max-w-md md:border border-gray-200 mx-4 rounded-lg">
                <div className="mb-4 flex items-center justify-center">
                    <h1 className="font-bold text-2xl">FsdFoods</h1>
                </div>
                <div className="mb-4">
                    <div className="relative"> 
						<Label className='mb-2'>New Password</Label>
                        <Input
                            type="password"
                            placeholder="Enter new password"
                            className="pl-10 focus-visible:ring-0"
                            name="newPassword"
                            value={input.newPassword}
                            onChange={changeEventHandler}
                        />
						<LockKeyhole className="absolute inset-y-7 left-2 text-gray-500 pointer-events-none" />
                        {errors && <span className="text-sm text-red-500">{errors.newPassword}</span>}
                    </div>
                </div>

                <div className="mb-6">
                    <div className="relative"> 
						<Label className='mb-2'>Confirm Password</Label>
                        <Input
                            type="password"
                            placeholder="Confirm password"
                            className="pl-10 focus-visible:ring-0"
                            name="confirmPassword"
                            value={input.confirmPassword}
                            onChange={changeEventHandler}
                        />
                        <LockKeyhole className="absolute inset-y-7 left-2 text-gray-500 pointer-events-none" />
                        {errors && <span className="text-sm text-red-500">{errors.confirmPassword}</span>}
                    </div>
                </div>
				<div className="mb-6">
					{
						loading ? 
						<Button disabled className="w-full bg-orange hover:bg-hoverOrange cursor-pointer"><Loader2 className="h-4 w-4 animate-spin"/>please wait</Button>
						:
						<Button type="submit" className="w-full bg-orange hover:bg-hoverOrange cursor-pointer">Reset Password</Button>
					}
					
				</div>
               
			
            </form>
        </div>
	</div>
  )
}

export default SetNewPassword
