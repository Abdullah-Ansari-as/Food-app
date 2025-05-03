import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useUserStore } from "@/store/useUserStore";
import { CheckoutSessionRequest } from "@/types/orderTypes";
import { useCartStore } from "@/store/userCartStore";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { useOrderStore } from "@/store/useOrderStore";
import { Loader2 } from "lucide-react";

const CheckoutConfirmPage = ({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
    const { user } = useUserStore();

    const [input, setInput] = useState({
        name: user?.fullname || "",
        email: user?.email || "",
        contact: user?.contact.toString() || "",
        address: user?.address || "",
        city: user?.city || "",
        country: user?.country || "",
    });

    const { cart } = useCartStore();
    const { restaurant, getRestaurant, restaurantId } = useRestaurantStore();
    const { createCheckoutSession, loading } = useOrderStore();  

    useEffect(() => {
        getRestaurant();
    }, [])

    const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };

    const checkOutHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // api implementation
        try {
            const checkoutData: CheckoutSessionRequest = {
                cartItems: cart.map((cartItem) => ({
                    menuId: cartItem._id,
                    name: cartItem.name,
                    image: cartItem.image,
                    price: cartItem.price.toString(),
                    quantity: cartItem.quantity.toString(),
                })),
                deliveryDetails: input,
                restaurantId: restaurantId as string,
            };

            await createCheckoutSession(checkoutData);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent onInteractOutside={() => setOpen(false)}>
                <DialogTitle className="font-semibold">
                    Review your Order
                </DialogTitle>
                <DialogDescription className="text-xs">
                    Double-check your delivery details and ensure everything is
                    in order. When you are ready, hit confirm button to finalize
                    your order
                </DialogDescription>
                <form
                    onSubmit={checkOutHandler}
                    className="md:grid grid-cols-2 gap-2 space-y-1 md:space-y-0"
                >
                    <div>
                        <Label>Fullname</Label>
                        <Input
                            type="text"
                            name="name"
                            value={input.name}
                            onChange={changeEventHandler}
                        />
                    </div>
                    <div>
                        <Label>Email</Label>
                        <Input
                            disabled
                            type="email"
                            name="email"
                            value={input.email}
                            onChange={changeEventHandler}
                        />
                    </div>
                    <div>
                        <Label>Contact</Label>
                        <Input
                            type="text"
                            name="contact"
                            value={input.contact}
                            onChange={changeEventHandler}
                        />
                    </div>
                    <div>
                        <Label>Address</Label>
                        <Input
                            type="text"
                            name="address"
                            value={input.address}
                            onChange={changeEventHandler}
                        />
                    </div>
                    <div>
                        <Label>City</Label>
                        <Input
                            type="text"
                            name="city"
                            value={input.city}
                            onChange={changeEventHandler}
                        />
                    </div>
                    <div>
                        <Label>Country</Label>
                        <Input
                            type="text"
                            name="country"
                            value={input.country}
                            onChange={changeEventHandler}
                        />
                    </div>
                    <DialogFooter className="col-span-2 mt-5">
                        {loading ? (
                            <Button
                                disabled
                                className="bg-orange hover:bg-hoverOrange"
                            >
                                <Loader2 className="w-4 h-4 animate-spin" />
                                please wait
                            </Button>
                        ) : (
                            <Button className="bg-orange hover:bg-hoverOrange cursor-pointer">
                                Continue to Payment
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CheckoutConfirmPage;
