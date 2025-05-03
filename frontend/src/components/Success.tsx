// basically its an Order Page;
import React, { useEffect } from "react";
import Image from "@/assets/hero_pizza.png"
import { Separator } from "./ui/separator";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useOrderStore } from "@/store/useOrderStore";
import { CartItems } from "@/types/cartTypes";
import { Loader2 } from "lucide-react";

const Success = () => { 
    const {orders, loading, getOrderDetails} = useOrderStore();

    useEffect(() => {
        getOrderDetails()
    }, []);

    if(loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h1 className="font-bold text-2xl text-gray-700 dark:text-gray-300">
                    <Loader2 className="w-8 h-8 animate-spin"/>
                </h1>
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h1 className="font-bold text-2xl text-gray-700 dark:text-gray-300">
                    Order not Found!
                </h1>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 px-y my-4">
            <div className="bg-white dark:bg-gray-800 shadow-lg p-6 rounded-lg max-w-lg w-full">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        Order Status:{" "}
                        <span className="text-[#FF5A5A]">
                            {"confirm".toUpperCase()}
                        </span>
                    </h1>
                </div>
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                        Orders History
                    </h2>
                    {/* your ordered items display here */}
                  {
                    orders.map((order: any, idx: number) => (
                        <div key={idx}>
                        {
                            order.cartItems.map((item: CartItems) => (
                                <div key={item._id} className="mb-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <img src={item.image} className="w-14 h-14 rounded-md object-cover" alt="" />
                                        <h3 className="ml-4 text-gray-800 dark:text-gray-200 font-medium ">
                                            {item.name}
                                        </h3>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-gray-800 dark:text-gray-200 flex items-center">
                                            <h2 className="font-semibold text-gray-900 text-xl dark:text-gray-200">Rs: <span className="text-lg font-medium">
                                                {item.price}
                                            </span></h2>
                                        </div>
                                    </div>
                                </div>
                                <Separator className="my-4"/>
                            </div>
                            ))
                        }
                        </div>
                    ))
                  }
                </div>
                <Link to="/cart">
                    <Button className="bg-orange hover:bg-hoverOrange cursor-pointer w-full py-3 rounded-md shadow-lg">Continue Shopping</Button>
                </Link>
            </div>
        </div>
    );
};
export default Success;
