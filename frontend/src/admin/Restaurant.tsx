import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    restaurantFormSchema,
    RestaurantFormSchema,
} from "@/schema/restaurantSchema";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { Label } from "@radix-ui/react-menubar";
import { Loader2 } from "lucide-react";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

const Restaurant = () => {
    const [input, setInput] = useState<RestaurantFormSchema>({
        restaurantName: "",
        city: "",
        country: "",
        deliveryTime: 0,
        cuisines: [],
        imageFile: undefined,
    });
    // console.log(input)

    const [errors, setErrors] = useState<Partial<RestaurantFormSchema>>({});

    const {
        loading,
        restaurant,
        updateRestaurant,
        createRestaurant,
        getRestaurant,
    } = useRestaurantStore();

    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setInput({
            ...input,
            [name]: type === "number" ? Number(value) : value,
        });
    };

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = restaurantFormSchema.safeParse(input);
        if (!result.success) {
            const fieldError = result.error.formErrors.fieldErrors;
            setErrors(fieldError as Partial<RestaurantFormSchema>);
            return;
        }

        // add restaurant api implementation
        try {
            const formData = new FormData();
            formData.append("restaurantName", input.restaurantName);
            formData.append("city", input.city);
            formData.append("country", input.country);
            formData.append("deliveryTime", input.deliveryTime.toString());
            formData.append("cuisines", JSON.stringify(input.cuisines));

            if (input.imageFile) {
                formData.append("imageFile", input.imageFile);
            }

            if (restaurant) {
                // update
                await updateRestaurant(formData);
            } else {
                // create
                await createRestaurant(formData);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const fetchRestaurant = async () => {
            await getRestaurant();
            setInput({
                restaurantName: restaurant?.restaurantName || "",
                city: restaurant?.city || "",
                country: restaurant?.country || "",
                deliveryTime: restaurant?.deliveryTime || 0,
                cuisines: restaurant?.cuisines ? restaurant?.cuisines.map((cuisine: string) => cuisine) : [],
                imageFile: undefined,
            });
        };
		fetchRestaurant();
    }, []);

    return (
        <div className="max-w-6xl mx-auto my-10">
            <div>
                <div>
                    <h1 className="font-extrabold text-2xl mb-5">
                        Add Restaurants
                    </h1>
                    <form onSubmit={submitHandler} action="">
                        <div className="md:grid grid-cols-2 gap-6 space-y-2 md:space-y-0">
                            {/* Restaurant Name */}
                            <div>
                                <Label>Restaurant Name</Label>
                                <Input
                                    type="text"
                                    value={input.restaurantName}
                                    onChange={changeEventHandler}
                                    name="restaurantName"
                                    placeholder="Enter your restaurant name"
                                />
                                {errors && (
                                    <span className="text-xs font-medium text-red-500">
                                        {errors.restaurantName}
                                    </span>
                                )}
                            </div>
                            <div>
                                <Label>City</Label>
                                <Input
                                    type="text"
                                    value={input.city}
                                    onChange={changeEventHandler}
                                    name="city"
                                    placeholder="Enter your restaurant city name"
                                />
                                {errors && (
                                    <span className="text-xs font-medium text-red-500">
                                        {errors.city}
                                    </span>
                                )}
                            </div>
                            <div>
                                <Label>Country</Label>
                                <Input
                                    type="text"
                                    value={input.country}
                                    onChange={changeEventHandler}
                                    name="country"
                                    placeholder="Enter your country name"
                                />
                                {errors && (
                                    <span className="text-xs font-medium text-red-500">
                                        {errors.country}
                                    </span>
                                )}
                            </div>
                            <div>
                                <Label>Delivery Time</Label>
                                <Input
                                    type="number"
                                    value={input.deliveryTime}
                                    onChange={changeEventHandler}
                                    name="deliveryTime"
                                    placeholder="Enter your delivery time"
                                />
                                {errors && (
                                    <span className="text-xs font-medium text-red-500">
                                        {errors.deliveryTime}
                                    </span>
                                )}
                            </div>
                            <div>
                                <Label>Cuisines</Label>
                                <Input
                                    type="text"
                                    value={input.cuisines}
                                    onChange={(e) =>
                                        setInput({
                                            ...input,
                                            cuisines: e.target.value.split(","),
                                        })
                                    }
                                    name="cuisines"
                                    placeholder="e.g. Biryani, Momos"
                                />
                                {errors && (
                                    <span className="text-xs font-medium text-red-500">
                                        {errors.cuisines}
                                    </span>
                                )}
                            </div>
                            <div>
                                <Label>Upload Restaurant Banner</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    name="imageFile"
                                    onChange={(e) =>
                                        setInput({
                                            ...input,
                                            imageFile: e.target.files?.[0],
                                        })
                                    }
                                />
                                {errors && (
                                    <span className="text-xs font-medium text-red-500">
                                        {errors.imageFile?.name}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="my-5 w-fit">
                            {loading ? (
                                <Button
                                    disabled
                                    className="bg-orange hover:bg-hoverOrange cursor-pointer"
                                >
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    please wait
                                </Button>
                            ) : (
                                <Button className="bg-orange hover:bg-hoverOrange cursor-pointer">
                                    {restaurant
                                        ? "Update Your Restaurant"
                                        : "Add Your Restaurant"}
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Restaurant;
