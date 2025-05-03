import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";

const Orders = () => {

    

    const {restaurantOrder, getRestaurantOrders, updateRestaurantOrder, loading} = useRestaurantStore();

    const handleStatusChange = async (id: string, status: string) => {
        await updateRestaurantOrder(id, status);
    }; 


    useEffect(() => {
        getRestaurantOrders(); 
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
    
    return (
        <div className="max-w-6xl mx-auto my-10 px-6">
            <h1 className="text-3xl font-extrabold text-shadow-gray-900 dark:text-white mb-10">
                Orders Overview
            </h1>
            <div className="space-y-8 ">
                {/* if no restaurant orders */}
                {
                    restaurantOrder.length <= 0 && <div className="flex items-center justify-center min-h-[70vh]">
                    <h1 className="font-bold text-2xl text-gray-700 dark:text-gray-300">
                        No Orders Overviews
                    </h1>
                </div>
                }
               
               {/* Restaurant orders display here */}
                {
                    restaurantOrder.map((order)=> (
                        <div key={order._id} className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-y-gray-700">
                        <div className="flex-1 mb-6 sm:mb-0">
                            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                                {order.deliveryDetails.name}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mt-2">
                                <span className="font-semibold">Address: </span>
                               {order.deliveryDetails.address}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300 mt-2 mb-0 sm:mb-2">
                                <span className="font-semibold">
                                    Total Amount:{" "}
                                </span>
                                {order.totalAmount/100}
                            </p>
                        </div>
                        <div className="w-full sm:w-1/3">
                            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Order Status
                            </Label>
                            <Select onValueChange={(newStatus) => handleStatusChange(order._id, newStatus)} defaultValue={order.status}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder='Select Status'/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {
                                            ["Pending", "Confirmed", "Preparing", "OutForDelivery", "Delivered"].map((status: string, idx:number) => (
                                                <SelectItem key={idx} value={status.toLowerCase()}>{status}</SelectItem>
                                            ))
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    ))
                }
               
            </div>
        </div>
    );
};

export default Orders;
