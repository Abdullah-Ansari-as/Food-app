import { Orders } from "@/types/orderTypes";
import { MenuItem, RestaurantState, Restaurant } from "@/types/restaurantTypes";
import axios from "axios";
import { toast } from "sonner";
// import { URLSearchParams } from "url";
import {create} from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const API_END_POINT = "http://localhost:3000/api/v1/restaurant";
axios.defaults.withCredentials = true;



export const useRestaurantStore = create<RestaurantState>()(persist((set, get) => ({
	loading: false,
	restaurant: null,
	searchedRestaurant: null,
	appliedFilter: [],
	singleRestaurant: null,
	restaurantOrder: [],

	restaurantId: null,

	setRestaurantId: (id: string) => {
		set(() => ({restaurantId: id}));
	},

	createRestaurant: async (formData: FormData) => {
		try {
			set({loading: true});
			const response = await axios.post(`${API_END_POINT}/`, formData, {
				headers: {
					"Content-Type": "multipart/form-data"
				}
			});
			// console.log(response)
			if(response.data.success) {
				toast.success(response.data.message);
				set({loading: false})
			}
		} catch (error: any) {
			toast.error(error.response.data.message);
			set({loading: false})
		}
	},

	getRestaurant: async () => {
		try { 
			set({loading: true});
			const response = await axios.get(`${API_END_POINT}/`);  
			if(response.data.success) {
				set({loading: false, restaurant: response.data.restaurant});
			}
		} catch (error: any) {
			if(error.response.status === 404) {
				set({restaurant: null});
			}
			set({loading: false})
		}
	},

	updateRestaurant: async (formData: FormData) => {
		try {
			set({loading: true});
			const response = await axios.put(`${API_END_POINT}/`,formData, {
				headers: {
					"Content-Type": "multipart/form-data"
				}
			});
			if(response.data.success) {
				toast.success(response.data.message);
				set({loading: false});
			}
		} catch (error: any) {
			toast.success(error.response.data.message);
			set({loading: false});
		}
	},

	searchRestaurant: async (searchText: string, searchQuery: string, selectedCuisines: any) => {
		try {
			set({loading: true});
			const params = new URLSearchParams();
			params.set("searchQuery", searchQuery);
			params.set("selectedCuisines", selectedCuisines.join(","));

			// wait 2 sec then call api
			// await new Promise((resolve) => setTimeout(resolve, 2000));
			
			const response = await axios.get(`${API_END_POINT}/search/${searchText}?${params.toString()}`);
			if(response.data.success) {
				// console.log(response.data);
				set({loading: false, searchedRestaurant: response.data});

			}
		} catch (error) {
			set({loading: false})
		}
	},

	addMenuToRestaurant: (menu: MenuItem) => {
		set((state: any) => ({
			restaurant: state.restaurant ? {...state.restaurant, menus: [...state.restaurant.menus, menu]} : null
		}))
	},

	updateMenuToRestaurant: (updatedMenu: MenuItem) => {
		set((state: any) => {
			if(state.restaurant) {
				const updateMenuList = state.restaurant.menus.map((menu: any) => menu._id === updatedMenu._id ? updatedMenu : menu);
				return {
					restaurant : {
						...state.restaurant,
						menus: updateMenuList
					}
				}
			}
			return state
		});
	},

	setAppliedFilter: (value: string) => {
		set((state) => {
			const isAlreadyApplied = state.appliedFilter.includes(value);
			const updatedFilter = isAlreadyApplied ? state.appliedFilter.filter((item) => item !== value) : [...state.appliedFilter, value];
			return {appliedFilter: updatedFilter}
		});
	},

	resetAppliedFilter: () => {
		set({appliedFilter: []})
	},

	getSingleRestaurant: async (restaurantId: string) => {
		try {
			const response = await axios.get(`${API_END_POINT}/${restaurantId}`);
			if(response.data.success) {  
				set({singleRestaurant: response.data.restaurant})
			}
		} catch (error) {
			
		}
	},

	getRestaurantOrders: async () => {
		try {
			set({loading: true});
			const response = await axios.get(`${API_END_POINT}/orders`); 
			if(response.data.success) {
				set({loading: false, restaurantOrder: response.data.orders});
			}
		} catch (error) {
			console.log(error);
			set({loading: false, restaurantOrder: []});
		}
	},

	updateRestaurantOrder: async (orderId: string, status: string) => {
		try {
			const response = await axios.put(`${API_END_POINT}/order/${orderId}/status`, {status}, {
				headers: {
					"Content-Type": "application/json"
				}
			});
			if(response.data.success) {
				// console.log("pass")
				const updatedOrder = get().restaurantOrder.map((order: Orders) => {
					return order._id === orderId ? {...order, status: response.data.status} : order;
				});
				set({restaurantOrder: updatedOrder});
				toast.success(response.data.message);
			}
		} catch (error: any) {
			toast.error(error.response.data.message); 
		}
	}

}),
{
	name: "restaurant-name",
	storage: createJSONStorage(() => localStorage)
}))