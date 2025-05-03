import React from 'react'
import { Button } from './ui/button'
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { useRestaurantStore } from '@/store/useRestaurantStore';

export type FilterOptionsState = {
	id: string
	lable: string,
}[];

const filterOptions: FilterOptionsState = [
	{id: "burger", lable: "Burger"}, 
	{id: "pizza", lable: "Pizza"}, 
	{id: "biryani", lable: "Biryani"},
	{id: "omelets", lable: "Omelets"},
	{id: "soup", lable: "Soup"},
	{id: "momos", lable: "Momos"},
	{id: "salad", lable: "Salad"},
	{id: "chicken karahi", lable: "Chicken Karahi"},
	{id: "sandwich", lable: "Sandwich"},
	{id: "fish", lable: "Fish"},
	{id: "steak", lable: "Steak"},
	{id: "kabab", lable: "Kabab"},
	{id: "shawarma", lable: "Shawarma"},
	{id: "pasta", lable: "Pasta"},
	{id: "lazania", lable: "Lazania"},
	{id: "rice", lable: "Rice"},
	{id: "tanduri tori", lable: "Thanduri Roti"},
	{id: "tea", lable: "Tea"},
	{id: "coffee", lable: "Coffee"},
]

const FilterPage = () => {
	const {setAppliedFilter, appliedFilter, resetAppliedFilter} = useRestaurantStore();
	const appliedFilterHandler = (value: string) => {
		// console.log(label)
		setAppliedFilter(value);
	}
  return (
	<div className='md:w-72'>
		<div className='flex items-center justify-between'>
			<h1 className='font-medium text-lg'>Filter by cuisines</h1>
			<Button className='cursor-pointer' variant={"link"} onClick={resetAppliedFilter}>Reset</Button>
		</div>
		{/* {
			filterOptions.map((option) => (
				<div key={option.id} className='flex items-center space-x-2 my-5'>
					<Checkbox 
						id={option.id}
						checked={appliedFilter.includes(option.lable)}
						onClick={() => appliedFilterHandler(option.lable)}
					/>

					<Label className='text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>{option.lable}</Label>
				</div>
			))
		}  */}
		<div className="flex flex-wrap -mx-2">
  {filterOptions.map((option, index) => (
    <div
      key={option.id}
    //   className="w-1/3 md:w-full px-2 my-2 flex items-center space-x-2"
	  className={`w-1/3 md:w-full px-2 my-2 flex items-center space-x-2 
        ${index >= 9 ? 'hidden md:flex' : 'flex'}`}
		//TODO: see all button on sm screen
    >
      <Checkbox
        id={option.id}
        checked={appliedFilter.includes(option.lable)}
        onClick={() => appliedFilterHandler(option.lable)}
      />
      <Label className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {option.lable}
      </Label>
    </div>
  ))}
</div>
		

	</div>
  )
}

export default FilterPage
