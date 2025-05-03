import { MenuItem } from "./restaurantTypes";

export interface CartItems extends MenuItem {
	quantity: number;
}

export type CartState = {
	cart: CartItems[];
	addToCart: (item: MenuItem) => void;
	clearCart: () => void;
	removeFromTheCart: (id: string) => void;
	incrementQuantity: (id: string) => void;
	decrementQuantity: (id: string) => void;
}