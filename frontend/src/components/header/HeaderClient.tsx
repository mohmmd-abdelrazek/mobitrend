"use client";
import { Link } from "@/src/navigation";
import { useAuth, useUser } from "../../services/queries";
import LoadingIndicator from "../LoadingIndicator";
import { axiosInstance } from "../../services/fetcher";
import { HeaderTextProps } from "../../types/textProps";
import { useRouter } from "@/src/navigation";
import { FaArrowDown, FaCaretDown, FaRegCircleUser } from "react-icons/fa6";
import { useState } from "react";
import { mutate } from "swr";
import toast from "react-hot-toast";

const Header = (texts: HeaderTextProps) => {
  const { data, isLoading, error } = useAuth();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const { data: user } = useUser();

  if (isLoading) return <LoadingIndicator />;
  if (error)
    return (
      <div className="text-center text-red-600">Failed to load user data.</div>
    );

  const isLoggedIn = data?.isAuthenticated;

  const handleLogout = async () => {
    try {
      setShowMenu(false);
      const result = await axiosInstance("/auth/logout");
      mutate("/auth/status");
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
          <div
            onClick={() => setShowMenu((prev) => !prev)}
            className="flex cursor-pointer items-center font-bold rounded-md p-1 text-2xl text-white transition-colors duration-200 ease-in-out hover:bg-gray-200 hover:text-slate-900"
            role="button"
            aria-expanded="false"
            aria-label="Toggle user menu"
          >
            <FaRegCircleUser aria-hidden="true" />
            <span className="hidden pl-2 text-xs capitalize sm:inline">
              {user?.name}
            </span>
            <span className="text-xs">
              <FaCaretDown />
            </span>
          </div>

          {showMenu && (
            <div className="absolute right-0 top-10 h-fit rounded bg-white shadow-lg">
              <nav className="flex flex-col">
                <Link
                  onClick={() => setShowMenu(false)}
                  href="/me/profile"
                  className="whitespace-nowrap px-4 py-3 hover:bg-slate-100"
                >
                  Profile
                </Link>
                <Link
                  onClick={() => setShowMenu(false)}
                  href="/admin/dashboard"
                  className="whitespace-nowrap px-4 py-3 hover:bg-slate-100"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="mx-2 my-4 rounded-full bg-red-600 px-3 py-1 text-sm text-white transition-colors hover:bg-red-700"
                >
                  {texts.logOut}
                </button>
              </nav>
            </div>
          )}
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
