import { z } from "zod";

export const restaurantFormSchema = z.object({
	restaurantName: z.string().nonempty({message: "Resraurant name is required"}),
	city: z.string().nonempty({message: "city is required"}),
	country: z.string().nonempty({message: "country is required"}),
	deliveryTime: z.number().min(0, {message: "delivery time can not be negative"}),
	cuisines: z.array(z.string()),
	imageFile: z.instanceof(File).optional().refine((file) => file?.size !== 0, {message: "Image file is required"})
});

export type RestaurantFormSchema = z.infer<typeof restaurantFormSchema>;
