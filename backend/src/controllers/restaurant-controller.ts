import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant-model"; 
import uploadImageOnCloudinary from "../utils/imageUpload";
import { Order } from "../models/order-model";

const createRestaurant = async (req: Request, res: Response): Promise<void> => {
	try {
		const {restaurantName, city, country, price, deliveryTime, cuisines} = req.body;
		const imageFile = req.file;

		if(!imageFile) {
			return res.status(400).json({
				success: false,
				message: "Image is required"
			}) as unknown as void;
		}

		const restaurant = await Restaurant.findOne({user: req.id});
		if(restaurant) {
			return res.status(400).json({
				success: false,
				message: "Restaurant is already exists for this user"
			}) as unknown as void;
		}

		const imageUrl = await uploadImageOnCloudinary(imageFile as Express.Multer.File);
		await Restaurant.create({
			user: req.id,
			restaurantName,
			city,
			country,
			deliveryTime,
			cuisines: JSON.parse(cuisines),
			imageUrl, 
		})

		return res.status(200).json({
			success: true,
			message: "Restaurant added"
		}) as unknown as void;

	} catch (error) {
		console.log(error);
		return res.status(500).json({message: "Internal server error"}) as unknown as void;
	}
}

const getRestaurant = async (req: Request, res: Response): Promise<void> => {
	try {
		const restaurant = await Restaurant.findOne({user: req.id}).populate("menus");
		if(!restaurant) {
			return res.status(404).json({
				success: false,
				restaurant: [],
				message: "Restaurant not found"
			}) as unknown as void;
		}

		return res.status(200).json({
			success: true,
			restaurant
		}) as unknown as void;
	
	} catch (error) {
		console.log(error);
		return res.status(500).json({message: "Internal server error"}) as unknown as void;
	}
}

const updateRestaurant = async (req: Request, res: Response): Promise<void> => {
	const {restaurantName, city, country, deliveryTime, cuisines} = req.body;
	const imageFile = req.file;
		
	try {
		const restaurant = await Restaurant.findOne({user: req.id});
		if(!restaurant) {
			return res.status(404).json({
				success: false,
				message: "Restaurant not found"
			}) as unknown as void;
		}

		restaurant.restaurantName = restaurantName;
		restaurant.city = city;
		restaurant.country = country;
		restaurant.deliveryTime = deliveryTime;
		restaurant.cuisines = JSON.parse(cuisines);

		if(imageFile) {
			const imageUrl = await uploadImageOnCloudinary(imageFile as Express.Multer.File);
			restaurant.imageUrl = imageUrl
		}

		await restaurant.save();

		return res.status(200).json({
			success: true,
			message: "Restaurant update",
			restaurant
		}) as unknown as void;

	} catch (error) {
		console.log(error);
		return res.status(500).json({message: "Internal server error"}) as unknown as void;
	}
}

const getRestaurantOrder = async (req: Request, res: Response): Promise<void> => {
	try {
		const restaurant = await Restaurant.findOne({user: req.id});
		if(!restaurant) {
			return res.status(404).json({
				success: false,
				message: "Restaurant not found"
			}) as unknown as void;
		};
		
		const orders = await Order.find({restaurant: restaurant._id}).populate("restaurant").populate("user");
		return res.status(200).json({
			success: true,
			orders
		}) as unknown as void;

	} catch (error) {
		console.log(error);
		return res.status(500).json({message: "Internal server error"}) as unknown as void;
	}
}

const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
	try {
		const {orderId} = req.params;
		const {status} = req.body;

		// console.log(orderId, status);

		const order = await Order.findById(orderId);

		if(!order) {
			return res.status(404).json({
				success: false,
				message: "Order not found"
			}) as unknown as void;
		};

		order.status = status;
		await order.save();

		return res.status(200).json({
			success: true,
			message: "Status updated",
			status: order.status
		}) as unknown as void;

	} catch (error) {
		console.log(error);
		return res.status(500).json({message: "Internal server error"}) as unknown as void;
	}
}

// advance searching
const searchRestaurant = async (req: Request, res: Response): Promise<void> => {

	try {
        const searchText = req.params.searchText || "";
        const searchQuery = req.query.searchQuery as string || "";
        const selectedCuisines = (req.query.selectedCuisines as string || "").split(",").filter(cuisine => cuisine);
        const query: any = {};
        // basic search based on searchText (name ,city, country)
        // console.log(selectedCuisines);

        
        if (searchText) {
            query.$or = [
                { restaurantName: { $regex: searchText, $options: 'i' } },
                { city: { $regex: searchText, $options: 'i' } },
                { country: { $regex: searchText, $options: 'i' } },
            ]
        }
        // filter on the basis of searchQuery
        if (searchQuery) {
            query.$or = [
                { restaurantName: { $regex: searchQuery, $options: 'i' } },
                { cuisines: { $regex: searchQuery, $options: 'i' } }
            ]
        }
        // console.log(query);

        if(selectedCuisines.length > 0){
            query.cuisines = {$in:selectedCuisines}
        }
        
        const restaurants = await Restaurant.find(query);
		
        return res.status(200).json({
            success:true,
            data:restaurants
        }) as unknown as void;

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" }) as unknown as void;
    }
}

const getSingleRestaurant = async (req: Request, res: Response): Promise<void> => {
	try {
		const restaurantId = req.params.id;
		const restaurant = await Restaurant.findById(restaurantId).populate({
			path: "menus",
			options: {createdAt: -1}
		});
		if(!restaurant) {
			return res.status(404).json({
				success: false,
				message: "Restaurat is not found"
			}) as unknown as void;
		};

		return res.status(200).json({
			success: true,
			restaurant
		}) as unknown as void;

	} catch (error) {
		console.log(error);
		return res.status(500).json({message: "Internal server error"}) as unknown as void;
	}
}


export {
	createRestaurant,
	getRestaurant,
	updateRestaurant,
	getRestaurantOrder,
	updateOrderStatus,
	searchRestaurant,
	getSingleRestaurant
}