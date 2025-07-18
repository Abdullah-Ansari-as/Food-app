import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "./ui/menubar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
    HandPlatter,
    Loader2,
    Menu,
    Moon,
    PackageCheck,
    ShoppingCart,
    SquareMenu,
    Sun,
    User,
    UtensilsCrossed,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { useUserStore } from "@/store/useUserStore";
import { useCartStore } from "@/store/userCartStore";
import { useThemeStore } from "@/store/useThemeStore";

const Navbar = () => {
    const { user, loading, logout } = useUserStore();
    const { cart, clearCart } = useCartStore();
    const { setTheme } = useThemeStore();

    const handleLogout = () => {
        logout();
        clearCart();
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between h-14">
                <Link to="/">
                    <h1 className="font-bold md:font-extrabold text-2xl">
                        FsdFoods
                    </h1>
                </Link>
                <div className="hidden md:flex items-center gap-10">
                    <div className="hidden md:flex items-center gap-6">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive
                                    ? "underline dark:text-gray-100"
                                    : "dark:text-gray-300"
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/profile"
                            className={({ isActive }) =>
                                isActive
                                    ? "underline dark:text-gray-100"
                                    : "dark:text-gray-300"
                            }
                        >
                            Profile
                        </NavLink>
                        <NavLink
                            to="/order/status"
                            className={({ isActive }) =>
                                isActive
                                    ? "underline dark:text-gray-100"
                                    : "dark:text-gray-300"
                            }
                        >
                            Order
                        </NavLink>

                        {user?.admin && (
                            <Menubar>
                                <MenubarMenu>
                                    <MenubarTrigger>Dashboard</MenubarTrigger>
                                    <MenubarContent>
                                        <Link to="/admin/restaurant">
                                            <MenubarItem>
                                                Restaurant
                                            </MenubarItem>
                                        </Link>
                                        <Link to="/admin/menu">
                                            <MenubarItem>Menu</MenubarItem>
                                        </Link>
                                        <Link to="/admin/orders">
                                            <MenubarItem>Order</MenubarItem>
                                        </Link>
                                    </MenubarContent>
                                </MenubarMenu>
                            </Menubar>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                        <span className="sr-only">
                                            Toggle theme
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        onClick={() => setTheme("light")}
                                    >
                                        Light
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => setTheme("dark")}
                                    >
                                        Dark
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <Link to="/cart" className="relative cursor-pointer">
                            <ShoppingCart />
                            {cart.length > 0 && (
                                <Button
                                    size={"icon"}
                                    className="absolute -inset-y-3 left-2 text-xs rounded-full  h-4 w-4 bg-red-500 hover:bg-red-500"
                                >
                                    {cart.length}
                                </Button>
                            )}
                        </Link>
                        <Link to="/profile">
                            <div>
                                <Avatar>
                                    <AvatarImage
                                        src={user?.profilePicture}
                                        alt="Profile_photo"
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </div>
                        </Link>
                        <div>
                            {loading ? (
                                <Button
                                    disabled
                                    className="bg-orange hover:bg-hoverOrange"
                                >
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    please wait
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleLogout}
                                    className="bg-orange cursor-pointer hover:bg-hoverOrange"
                                >
                                    Logout
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="md:hidden lg:hidden">
                    {/* mobile responsive */}
                    <MobileNavbar />
                </div>
            </div>
        </div>
    );
};

export default Navbar;

const MobileNavbar = () => {

    const { user, loading, logout } = useUserStore();
    const { cart } = useCartStore();
    const [open, setOpen] = useState<boolean>(false);
    const { setTheme } = useThemeStore();

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    size={"icon"}
                    className="rounded-full cursor-pointer bg-gray-200 hover:bg-gray-200"
                    variant="outline"
                >
                    <Menu size={"18"} />
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader className="flex flex-row items-center justify-between mt-2 pt-9">
                    <SheetTitle>FsdFoods</SheetTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                                Light
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                Dark
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SheetHeader>
                <Separator className="my-2" />
                <SheetDescription className="flex-1">
                    <Link
                        onClick={() => setOpen(false)}
                        to="/profile"
                        className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
                    >
                        <User />
                        <span>Profile</span>
                    </Link>
                    <Link
                        onClick={() => setOpen(false)}
                        to="/order/status"
                        className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
                    >
                        <HandPlatter />
                        <span>Order</span>
                    </Link>
                    <Link
                        onClick={() => setOpen(false)}
                        to="/cart"
                        className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
                    >
                        <ShoppingCart />
                        <span>Cart ({cart.length})</span>
                    </Link>

                    {user?.admin && (
                        <>
                            <Link
                                onClick={() => setOpen(false)}
                                to="/admin/menu"
                                className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
                            >
                                <SquareMenu />
                                <span>Menu</span>
                            </Link>
                            <Link
                                onClick={() => setOpen(false)}
                                to="/admin/restaurant"
                                className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
                            >
                                <UtensilsCrossed />
                                <span>Restaurant</span>
                            </Link>
                            <Link
                                onClick={() => setOpen(false)}
                                to="/admin/orders"
                                className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
                            >
                                <PackageCheck />
                                <span>Restaurant Orders</span>
                            </Link>
                        </>
                    )}
                </SheetDescription>
                <SheetFooter>
                    <Link to="/profile" onClick={() => setOpen(false)}>
                        <div className="flex flex-row items-center gap-2">
                        <Avatar>
                            <AvatarImage
                                src={user?.profilePicture}
                                alt="Profile_photo"
                            />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <h1 className="font-bold">Abdullah Ansari</h1>
                    </div>
                    </Link>

                    <SheetClose asChild>
                        {loading ? (
                            <Button
                                disabled
                                className="bg-orange hover:bg-hoverOrange"
                            >
                                <Loader2 className="w-4 h-4 animate-spin" />
                                please wait
                            </Button>
                        ) : (
                            <Button
                                onClick={logout}
                                className="bg-orange cursor-pointer hover:bg-hoverOrange"
                            >
                                Logout
                            </Button>
                        )}
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};
