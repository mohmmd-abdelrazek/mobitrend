"use client";
import { Link } from "@/src/navigation";
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

const Header = (texts: HeaderTextProps) => {
  const { data, isLoading, error, mutate } = useAuth();
  const router = useRouter();
  const { data: user } = useUser();

  if (isLoading) return <LoadingIndicator />;
  if (error)
    return (
      <div className="text-center text-red-600">Failed to load user data.</div>
    );

  const isLoggedIn = data?.isAuthenticated;

  const handleLogout = async () => {
    try {
      const result = await axiosInstance("/auth/logout");
      mutate();
      router.push("/signin");
      toast.success("logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {isLoggedIn && (
        <div className="relative flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex cursor-pointer items-center rounded-md p-1 text-2xl font-bold text-white transition-colors duration-200 ease-in-out focus:outline-none hover:bg-gray-200 hover:text-slate-900">
              <FaRegCircleUser aria-hidden="true" />
              <span className="hidden pl-2 text-xs capitalize sm:inline">
                {user?.name}
              </span>
              <span className="text-xs">
                <FaCaretDown />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex flex-col">
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
                  href="/admin/dashboard"
                  className="whitespace-nowrap px-4 py-3 hover:bg-slate-100"
                >
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="mx-2 my-4 rounded-full bg-red-600 px-3 py-1 justify-center text-white transition-colors hover:bg-red-700">
                <button
                  onClick={handleLogout}
                >
                  {texts.logOut}
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      {!isLoggedIn && (
        <Link
          href="/signin"
          className="rounded-full bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700"
        >
          {texts.signIn}
        </Link>
      )}
    </>
  );
};

export default Header;
