import { Request, Response } from "express";
import uploadImageOnCloudinary from "../utils/imageUpload";
import { Menu } from "../models/menu-model";
import { Restaurant } from "../models/restaurant-model";
import mongoose from "mongoose";

const addMenu = async (req: Request, res: Response): Promise<void> => {
	try {
		const {name, description, price} = req.body;
		const file = req.file;
		if(!file) {
			return res.status(400).json({
				success: false,
				message: "Image is required"
			}) as unknown as void;
		};

		const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
		const menu: any = await Menu.create({
			name,
			description,
			price,
			image: imageUrl
		});

		const restaurant = await Restaurant.findOne({user: req.id});
		// console.log(restaurant)
		if(restaurant) {
			(restaurant.menus as mongoose.Schema.Types.ObjectId[]).push(menu._id);
			await restaurant.save();
		}

		return res.status(201).json({
			success: true,
			message: "Menu added successfully",
			menu
		}) as unknown as void;

	} catch (error) {
		console.log(error);
		return res.status(500).json({message: "Internal server error"}) as unknown as void;
	}
}

const editMenu = async (req: Request, res: Response): Promise<void> => {
	try {
		const {id} = req.params;
		const {price, description, name} = req.body;
		const file = req.file;

		const menu = await Menu.findById(id);
		if(!menu) {
			return res.status(404).json({
				success: false,
				message: "menu not found"
			}) as unknown as void;
		}

		if(name) menu.name = name;
		if(description) menu.description = description;
		if(price) menu.price = price;

		if(file) {
			const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
			menu.image = imageUrl;
		}

		menu.save();

		return res.status(200).json({
			success: true,
			message: "Menu updated",
			menu
		}) as unknown as void;

	} catch (error) {
		console.log(error);
		return res.status(500).json({message: "Internal server error"}) as unknown as void;
	}
}


export {
	addMenu,
	editMenu
}