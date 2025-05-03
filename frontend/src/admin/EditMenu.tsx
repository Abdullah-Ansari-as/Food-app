import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MenuFormSchema, menuSchema } from "@/schema/menuSchema";
import { useMenuStore } from "@/store/useMenuStore";
import { MenuItem } from "@/types/restaurantTypes";
import { Loader2 } from "lucide-react";
import React, {
    ChangeEvent,
    Dispatch,
    FormEvent,
    SetStateAction,
    useEffect,
    useState,
} from "react";

const EditMenu = ({
    selectedMenu,
    editOpen,
    setEditOpen,
}: {
    selectedMenu: MenuItem;
    editOpen: boolean;
    setEditOpen: Dispatch<SetStateAction<boolean>>;
}) => {
    const [input, setInput] = useState<MenuFormSchema>({
        name: "",
        description: "",
        price: 0,
        image: undefined,
    });

    const [errors, setErrors] = useState<Partial<MenuFormSchema>>({});
    const { loading, editMenu } = useMenuStore();

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

        try {
            const formData = new FormData();
            formData.append("name", input.name);
            formData.append("description", input.description);
            formData.append("price", input.price.toString());
            if (input.image) {
                formData.append("image", input.image);
            }

            await editMenu(selectedMenu._id, formData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setInput({
            name: selectedMenu?.name || "",
            description: selectedMenu?.description || "",
            price: selectedMenu?.price || 0,
            image: undefined,
        });
    }, [selectedMenu]);

    return (
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent onInteractOutside={() => setEditOpen(false)}>
                <DialogHeader>
                    <DialogTitle>Edit Menu</DialogTitle>
                    <DialogDescription>
                        Update your menu to keep your offerings fresh and
                        exciting!
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
                            <span className="text-xs font-medium text-red-500">
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
                            <span className="text-xs font-medium text-red-500">
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
                            <span className="text-xs font-medium text-red-500">
                                {errors.price}
                            </span>
                        )}
                    </div>
                    <div>
                        <Label className="mb-1">Upload menu image</Label>
                        <Input
                            type="file"
                            name="image"
                            onChange={(e) =>
                                setInput({
                                    ...input,
                                    image: e.target.files?.[0] || undefined,
                                })
                            }
                        />
                        {errors && (
                            <span className="text-xs font-medium text-red-500">
                                {errors.image?.name}
                            </span>
                        )}
                    </div>
                    <DialogFooter className="mt-5">
                        {loading ? (
                            <Button disabled className="bg-orange hover:bg-hoverOrange">
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
    );
};

export default EditMenu;
