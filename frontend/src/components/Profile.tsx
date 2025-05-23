import React, { FormEvent, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
    Loader2,
    LocateIcon,
    Mail,
    MapPin,
    MapPinned,
    Plus,
} from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useUserStore } from "@/store/useUserStore";

const Profile = () => {

    const {user, updateProfile} = useUserStore();

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [profileData, setProfileData] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "", 
        address: user?.address || "",
        city: user?.city || "",
        country: user?.country || "",
        profilePicture: user?.profilePicture || "",
    }); 


    const imageRef = useRef<HTMLInputElement | null>(null);
    const [selectedProfilePicture, setSelectedProfilePicture] = useState<string>(profileData?.profilePicture || "");


    const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setSelectedProfilePicture(result);
                setProfileData((prevData) => ({
                    ...prevData,
                    profilePicture: result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    const updateProfileHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // console.log(profileData)
        // api implementations
        try {
            setIsLoading(true)
            await updateProfile(profileData);
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={updateProfileHandler} className="max-w-7xl mx-auto my-5">
            <div className="flex items-center justify-between ">
                <div className="flex items-center gap-2">
                    <Avatar className="relative md:w-28 md:h-28 w-20 h-20">
                        <AvatarImage src={selectedProfilePicture} className="object-contain"/>
                        <AvatarFallback>CN</AvatarFallback>
                        <input
                            ref={imageRef}
                            onChange={(e) => fileChangeHandler(e)}
                            accept="image/*"
                            type="file"
                            className="hidden"
                        />
                        <div
                            onClick={() => imageRef.current?.click()}
                            className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-full cursor-pointer"
                        >
                            <Plus className="text-white w-8 h-8" />
                        </div>
                    </Avatar>
                    <Input
                        type="text"
                        name="fullname"
                        value={profileData.fullname}
                        onChange={changeHandler}
                        className="font-bold text-2xl outline-none border-none focus-visible:ring-transparent"
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-4 md:gap-2 gap-3 my-10">
                <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200">
                    <Mail className="text-gray-500" />
                    <div className="w-full">
                        <Label className="text-gray-900">Email</Label>
                        <input
                        disabled
                            type="email"
                            name="email"
                            className="w-full text-gray-600 outline-none border-none bg-transparent focus-visible:ring-0 focus-visible:border-tr"
                            value={profileData.email}
                            onChange={changeHandler}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200">
                    <LocateIcon className="text-gray-500" />
                    <div className="w-full">
                        <Label className="text-gray-900">Address</Label>
                        <input
                            type="text"
                            name="address"
                            className="w-full text-gray-600 outline-none border-none bg-transparent focus-visible:ring-0 focus-visible:border-tr"
                            value={profileData.address}
                            onChange={changeHandler}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200">
                    <MapPin className="text-gray-500" />
                    <div className="w-full">
                        <Label className="text-gray-900">City</Label>
                        <input
                            type="text"
                            name="city"
                            className="w-full text-gray-600 outline-none border-none bg-transparent focus-visible:ring-0 focus-visible:border-tr"
                            value={profileData.city}
                            onChange={changeHandler}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-sm p-2 bg-gray-200">
                    <MapPinned className="text-gray-500" />
                    <div className="w-full">
                        <Label className="text-gray-900">Country</Label>
                        <input
                            type="text"
                            name="country"
                            className="w-full text-gray-600 outline-none border-none bg-transparent focus-visible:ring-0 focus-visible:border-tr"
                            value={profileData.country}
                            onChange={changeHandler}
                        />
                    </div>
                </div>
            </div>

            <div className="text-center">
                {isLoading ? (
                    <Button disabled className="bg-orange hover:bg-hoverOrange">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        please wait
                    </Button>
                ) : (
                    <Button type="submit" className="bg-orange hover:bg-hoverOrange cursor-pointer">
                        Update
                    </Button>
                )}
            </div>
        </form> 
    );
};

export default Profile;
