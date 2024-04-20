"use client";
import { Link } from "@/src/navigation";
import { useAuth } from "../../services/queries";
import LoadingIndicator from "../LoadingIndicator";
import { axiosInstance } from "../../services/fetcher";
import { HeaderTextProps } from "../../types/textProps";
import { useRouter } from "@/src/navigation";
import { FaRegCircleUser } from "react-icons/fa6";
import { useState } from "react";

const Header = (texts: HeaderTextProps) => {
  const { data, isLoading, error } = useAuth();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  if (isLoading) return <LoadingIndicator />;
  if (error)
    return (
      <div className="text-center text-red-600">Failed to load user data.</div>
    );

  const isLoggedIn = data?.isAuthenticated;

  const handleLogout = async () => {
    try {
      const result = await axiosInstance("/auth/logout");
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <div className="relative flex justify-center">
        <div
          onClick={() => setShowMenu(prev => !prev)}
          className="cursor-pointer text-3xl"
        >
          <FaRegCircleUser />
        </div>
        {showMenu && (
          <div className="absolute top-11 h-fit rounded bg-white p-2 shadow-lg">
            <nav>
              <Link onClick={() => setShowMenu(false)} href="/admin-panel" className="whitespace-nowrap p-2 hover:bg-slate-100">Profile</Link>
            </nav>
          </div>
        )}
      </div>
      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          className="rounded-full bg-red-600 px-3 py-1 text-sm text-white transition-colors hover:bg-red-700"
        >
          {texts.logOut}
        </button>
      ) : (
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
