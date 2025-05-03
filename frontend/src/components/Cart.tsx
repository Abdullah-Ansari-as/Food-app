import React, { useState } from 'react'
import { Button } from './ui/button'
import { Minus, Plus } from 'lucide-react'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from './ui/table'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import CheckoutConfirmPage from './CheckoutConfirmPage'
import { useCartStore } from '@/store/userCartStore' 
import { CartItems } from '@/types/cartTypes'

const Cart = () => {
	const [open, setOpen] = useState<boolean>(false);
	const {cart, decrementQuantity, incrementQuantity, clearCart, removeFromTheCart} = useCartStore();

	let totalAmount = cart.reduce((acc, elem) => {
		return acc + elem.price * elem.quantity
	}, 0);

  return (
	<div className='flex flex-col max-w-7xl mx-auto my-10'>
		<div className="flex justify-end">
			<Button variant={"link"} onClick={() => clearCart()} className='cursor-pointer'>Clear All</Button>
		</div> 
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Item</TableHead>
					<TableHead>Title</TableHead>
					<TableHead>Price</TableHead>
					<TableHead>Quantity</TableHead>
					<TableHead>Total</TableHead>
					<TableHead className='text-right'>Remove</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{
					cart.map((item: CartItems) => ( 
							<TableRow key={item._id}>
						<TableCell>
							<Avatar>
								<AvatarImage src={item.image} alt=''/>
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
						</TableCell>
						<TableCell>{item.name}</TableCell>
						<TableCell>{item.price}</TableCell>
						<TableCell>
							<div className='w-fit flex items-center rounded-full border border-gray-100 dark:border-gray-800 shadow-md'>
								<Button onClick={() => decrementQuantity(item._id)} size={"icon"} variant={"outline"} className='rounded-full bg-gray-200'><Minus /></Button>
								<Button disabled size={"icon"} variant={"outline"} className='font-bold border-none dark:text-gray-200'>{item.quantity}</Button>
								<Button onClick={() => incrementQuantity(item._id)} size={"icon"} variant={"outline"} className='rounded-full bg-orange hover:bg-hoverOrange'><Plus /></Button>
							</div>
						</TableCell>
						<TableCell>{item.price * item.quantity}</TableCell>
						<TableCell className='text-right'>
							<Button size={"sm"} className='bg-orange hover:bg-hoverOrange cursor-pointer' onClick={() => removeFromTheCart(item._id)}>Remove</Button>
						</TableCell>
					</TableRow> 
					))
				}
			</TableBody>
			<TableFooter>
				<TableRow className='text-2xl font-bold'>
					<TableCell colSpan={5}>Total</TableCell>
					<TableCell className='text-right'>{totalAmount}</TableCell>
				</TableRow>
			</TableFooter>
		</Table>

		<div className='flex justify-end my-5'>
			
				<Button disabled={cart?.length <= 0 } onClick={() => setOpen(true)} className='bg-orange hover:bg-hoverOrange cursor-pointer'>Proceed to CheckOut</Button>
			
		</div>

		<CheckoutConfirmPage open={open} setOpen={setOpen}/>
	</div>
  )
}

export default Cart
