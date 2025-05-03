import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import EditMenu from "./EditMenu";
import { MenuFormSchema, menuSchema } from "@/schema/menuSchema";
import { useMenuStore } from "@/store/useMenuStore";
import { useRestaurantStore } from "@/store/useRestaurantStore";


const AddMenu = () => {
    const [input, setInput] = useState<MenuFormSchema>({
        name: "",
        description: "",
        price: 0,
        image: undefined,
    });

    const [open, setOpen] = useState<boolean>(false);
    const [editOpen, setEditOpen] = useState<boolean>(false);
    const [selectedMenu, setSelectedMenu] = useState<any>();
    const [errors, setErrors] = useState<Partial<MenuFormSchema>>({});

    const { loading, createMenu } = useMenuStore();
    const { restaurant } = useRestaurantStore(); 

    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setInput({
            ...input,
            [name]: type === "number" ? Number(value) : value,
        });
    };

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = menuSchema.safeParse(input);
        if (!result.success) {
            const fieldError = result.error.formErrors.fieldErrors;
            setErrors(fieldError as Partial<MenuFormSchema>);
            return;
        }

        // api implementation here
        try {
            const formData = new FormData();
            formData.append("name", input.name);
            formData.append("description", input.description);
            formData.append("price", input.price.toString());
            if (input.image) {
                formData.append("image", input.image);
            }

            await createMenu(formData);
        } catch (error) {
            console.log(error);
        }
    };
 
    
    return (
        <div className="max-w-6xl mx-auto my-10">
            <div className="flex justify-between">
                <h1 className="font-bold md:font-extrabold text-lg md:text-2xl">
                    Available Menus
                </h1>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger>
                        <Button className="bg-orange hover:bg-hoverOrange cursor-pointer">
                            <Plus />
                            Add Menus
                        </Button>
                    </DialogTrigger>
                    <DialogContent onInteractOutside={() => setOpen(false)}>
                        <DialogHeader>
                            <DialogTitle>Add A New Menu</DialogTitle>
                            <DialogDescription>
                                Create a menu that will make your restaurant
                                stand out.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submitHandler} className="space-y-4">
                            <div>
                                <Label className="mb-1">Name</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    placeholder="Enter menu name"
                                    value={input.name}
                                    onChange={changeEventHandler}
                                />
                                {errors && (
                                    <span className="text-xs text-red-500 font-medium">
                                        {errors.name}
                                    </span>
                                )}
                            </div>
                            <div>
                                <Label className="mb-1">Description</Label>
                                <Input
                                    type="text"
                                    name="description"
                                    placeholder="Enter menu description"
                                    value={input.description}
                                    onChange={changeEventHandler}
                                />
                                {errors && (
                                    <span className="text-xs text-red-500 font-medium">
                                        {errors.description}
                                    </span>
                                )}
                            </div>
                            <div>
                                <Label className="mb-1">Price in Rs.</Label>
                                <Input
                                    type="number"
                                    name="price"
                                    placeholder="Enter menu price"
                                    value={input.price}
                                    onChange={changeEventHandler}
                                />
                                {errors && (
                                    <span className="text-xs text-red-500 font-medium">
                                        {errors.price}
                                    </span>
                                )}
                            </div>
                            <div>
                                <Label className="mb-1">
                                    Upload menu image
                                </Label>
                                <Input
                                    type="file"
                                    name="image"
                                    onChange={(e) =>
                                        setInput({
                                            ...input,
                                            image:
                                                e.target.files?.[0] ||
                                                undefined,
                                        })
                                    }
                                />
                                {errors && (
                                    <span className="text-xs text-red-500 font-medium">
                                        {errors.image?.name}
                                    </span>
                                )}
                            </div>
                            <DialogFooter className="mt-5">
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
                                        Submit
                                    </Button>
                                )}
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {restaurant?.menus.map((menu: any) => (
                <div key={menu._id} className="mt-6 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 md:p-4 p-2 shadow-md rounded-lg border">
                        <img
                            src={menu.image}
                            alt="res_image"
                            className="md:h-24 md:w-24 h-16 w-full object-cover rounded-lg "
                        />
                        <div className="flex-1">
                            <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-400">
                                {menu.name}
                            </h1>
                            <p className="text-sm font-semibold mt-1">
                                {menu.description}
                            </p>
                            <h2 className="text-md font-semibold mt-2">
                                Price:{" "}
                                <span className="text-[#D19254]">
                                    {menu.price}
                                </span>
                            </h2>
                        </div>
                        <Button
                            onClick={() => {
                                setSelectedMenu(menu);
                                setEditOpen(true);
                            }}
                            size={"sm"}
                            className="bg-orange hover:bg-hoverOrange cursor-pointer mt-2"
                        >
                            Edit
                        </Button>
                    </div>
                </div>
            ))}

            <EditMenu
                selectedMenu={selectedMenu}
                editOpen={editOpen}
                setEditOpen={setEditOpen}
            />
        </div>
    );
};

export default AddMenu;
