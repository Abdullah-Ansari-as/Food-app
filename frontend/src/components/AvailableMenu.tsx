import React from 'react'
import { Card, CardContent, CardFooter } from './ui/card'
import { Button } from './ui/button'
import { MenuItem } from '@/types/restaurantTypes'
import { useCartStore } from '@/store/userCartStore'
import { useNavigate } from 'react-router-dom'

const AvailableMenu = ({menus}:{menus:MenuItem[]}) => {

	const {addToCart} = useCartStore();
	const navigate = useNavigate();
	 
  return (
	<div className='md:p-4'>
	  <h1 className='text-xl md:text-2xl font-extrabold mb-6'>Available Menu</h1>
	  <div className="grid md:grid-cols-3 space-y-4 md:space-y-0 gap-4 lg:gap-0">
		{
			menus?.map((menu) => (
				<Card key={menu._id} className='my-3 max-w-xs mx-auto shadow-lg rounded-lg overflow-hidden'>
			<img 
				src={menu.image}
				alt="card-img"
				className='w-full h-40 object-cover'
			/>
			<CardContent className='p-4'>
				<h2 className='text-xl font-semibold text-gray-800 dark:text-white'>{menu.name}</h2>
				<p className='text-sm text-gray-600 mt-2 dark:text-gray-400'>{menu.description.length > 153 ? menu.description.slice(0, 153)+"..." : menu.description}</p>
				<h3 className='text-lg font-semibold mt-4'>Price: <span className='text-[#d19254]'>Rs. {menu.price}</span></h3>
			</CardContent>
			<CardFooter className='p-4'>
				<Button onClick={() => {
					addToCart(menu)
					navigate("/cart")
				}} className='w-full bg-orange hover:bg-hoverOrange cursor-pointer'>Add to Cart</Button>
			</CardFooter>
		</Card>
			))
		}
	  </div>
	</div>
  )
}

export default AvailableMenu
