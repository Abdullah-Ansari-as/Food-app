import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";
import { LoginInputState, SignupInputState } from "@/schema/userSchema";
import { toast } from "sonner";
import { UserState } from "@/types/userTypes";
import { useCartStore } from "./userCartStore";

const API_END_POINT = `${import.meta.env.VITE_BACKEND_API_URL}/api/v1/user`
axios.defaults.withCredentials = true;



export const useUserStore = create<UserState>()(persist(
	(set) => ({
		user: null,
		isAuthenticated: false,
		isCheckingAuth: true,
		loading: false, 

		// signup api implementation
		signup: async (input: SignupInputState) => {
			try {
				set({loading: true});
				const response = await axios.post(`${API_END_POINT}/signup`, input, {
					headers: {
						"Content-Type": "application/json"
					},
				});
				if(response.data.success) {
					// console.log(response.data)
					toast.success(response.data.message)
					set({loading: false, user: response.data.user, isAuthenticated: true});
				}
			} catch (error: any) {
				toast.error(error.response.data.message)
				set({loading: false});
			}
		},

		// login api implementation
		login: async(input: LoginInputState) => {
			try {
				set({loading: true});
				const response = await axios.post(`${API_END_POINT}/login`, input, {
					headers: {
						"Content-Type": "application/json"
					},
				});

				if(response.data.success) {
					useCartStore.setState({ cart: [] });  // Reset cart to empty on login
					// console.log(response.data)
					toast.success(response.data.message)
					set({loading:false, user: response.data.user, isAuthenticated: true});
				}
				
			} catch (error: any) {
				toast.error(error.response.data.message)
				set({loading: false});
			}
		},

		// verifyEmail api implementation
		verifyEmail: async (verificationCode: string) => {
			try {
				set({loading: true});
				const response = await axios.post(`${API_END_POINT}/verify-email`, {verificationCode}, {
					headers: {
						"Content-Type": "application/json",
					}
				});

				if(response.data.success) {
					toast.success(response.data.message); 
					set({loading: false, user: response.data.user, isAuthenticated: true});
				}

			} catch (error: any) { 
				toast.error(error.response.data.message)
				set({loading: false});
			}
		},

		// check auth api implementation
		checkAuthentication: async () => {
			try {
				set({isCheckingAuth: true}); 
				const response = await axios.get(`${API_END_POINT}/check-auth`);
				if(response.data.success){ 
					set({loading: false, user: response.data.user, isAuthenticated: true, isCheckingAuth: false});
				}
			} catch (error) {
				set({loading: false, isAuthenticated: false, isCheckingAuth: false});
			}
		},

		// logout api implementation
		logout: async () => {
			try {
				set({loading: true});
				const response = await axios.post(`${API_END_POINT}/logout`);
				if(response.data.success) {
					toast.success(response.data.message);

					useCartStore.setState({ cart: [] });  // Reset cart to empty on logout
					const clearCart = useCartStore.getState().clearCart;
					clearCart();
					

					set({loading: false, user: null, isAuthenticated: false});
				}
			} catch (error:any) {
				toast.error(error.response.data.message)
				set({loading: false});
			}
		},

		// forgot password api implementation 
		forgotPassword: async (email: string) => {
			try {
				set({loading: true});
				const response = await axios.post(`${API_END_POINT}/forgot-password`, {email});
				if(response.data.success) {
					toast.success(response.data.message);
					set({loading: false});
				}
			} catch (error: any) {
				console.log(error)
				toast.error(error.response.data.message);
				set({loading: false});
			}
		},

		// reset password api implementation
		resetPassword: async (token: string, newPassword: string) => {
			try {
				set({loading: true});
				const response = await axios.post(`${API_END_POINT}/reset-password/${token}`, {newPassword});
				if(response.data.success) {
					toast.success(response.data.message);
					set({loading: false});
				}
			} catch (error: any) { 
				toast.error(error.response.data.message);
				set({loading: false});
			}
		},

		// update profile
		updateProfile: async (input: any) => {
			try { 
				const response = await axios.put(`${API_END_POINT}/profile/update`, input, {
					headers: {
						"Content-Type": "application/json"
					}
				});

				if(response.data.success) {
					toast.success(response.data.message);
					set({user: response.data.user, isAuthenticated: true});
				}

			} catch (error) {
				set({loading: false});
			}
		}

	}),

	{
		name: "cart-name",
		storage: createJSONStorage(() => localStorage)
	}
))
