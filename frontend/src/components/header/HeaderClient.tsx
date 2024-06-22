"use client";
import { Link } from "@/src/navigation";
import Image from "next/legacy/image";
import { useAuth, useUser } from "../../services/queries";
import LoadingIndicator from "../LoadingIndicator";
import { axiosInstance } from "../../services/fetcher";
import { HeaderTextProps } from "../../types/textProps";
import { useRouter } from "@/src/navigation";
import { FaCaretDown, FaRegCircleUser } from "react-icons/fa6";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { mutate } from "swr";

const Header = (texts: HeaderTextProps) => {
  const { data, isLoading, error, mutate: mutateAuth } = useAuth();
  const router = useRouter();
  const { data: user, mutate: mutateUser } = useUser();

  if (isLoading) return <LoadingIndicator w={32} ws={20} d={4} />;
  if (error)
    return (
      <div className="text-center text-red-600">Failed to load user data.</div>
    );

  const isLoggedIn = data?.isAuthenticated;

  const handleLogout = async () => {
    try {
      await axiosInstance("/auth/logout");
      await mutateAuth();
      await mutateUser();
      await mutate("/cart");
      router.push("/signin");
      toast.success("logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {isLoggedIn && (
        <div className="relative flex w-20 sm:w-32 justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex cursor-pointer items-center rounded-md p-1 text-2xl font-bold text-white transition-colors duration-200 ease-in-out hover:bg-gray-200 hover:text-slate-900 focus:outline-none">
              {user?.profile_picture_url ? (
                <Image
                  src={user.profile_picture_url}
                  alt="Avatar"
                  width={24}
                  height={24}
                  className="mr-4 rounded-full"
                />
              ) : (
                <FaRegCircleUser aria-hidden="true" />
              )}
              <span className="hidden pl-2 text-xs capitalize sm:inline">
                {user?.name.split(" ")[0]}
              </span>
              <span className="text-xs">
                <FaCaretDown />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex flex-col">
              <DropdownMenuItem asChild>
                <Link
                  href="/admin/dashboard"
                  className="whitespace-nowrap px-4 py-3 hover:bg-slate-100"
                >
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/me/profile"
                  className="whitespace-nowrap px-4 py-3 hover:bg-slate-100"
                >
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/me/orders"
                  className="whitespace-nowrap px-4 py-3 hover:bg-slate-100"
                >
                  Orders
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="mx-2 my-4 justify-center rounded-full bg-red-600 px-3 py-1 text-white transition-colors hover:bg-red-700"
              >
                <button onClick={handleLogout}>{texts.logOut}</button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      {!isLoggedIn && (
        <div className="flex w-20 sm:w-32 justify-center">
          <Link
            href="/signin"
            className="rounded-full bg-orange-600 px-3 py-1 text-sm text-white transition-colors hover:bg-orange-700"
          >
            {texts.signIn}
          </Link>
        </div>
      )}
    </>
  );
};

export default Header;
