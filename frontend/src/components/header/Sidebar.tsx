"use client";
import Link from "next/link";
import LocaleSwitcher from "./LocalSwitcher";
import clsx from "clsx";
import { axiosInstance } from "../../services/fetcher";
import { useAuth } from "@/src/services/queries";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { SidebarButton } from "./SidebarButton";
import { HeaderTextProps } from "@/src/types/textProps";
import { useRouter } from "@/src/navigation";

const Sidebar = (texts: HeaderTextProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, error } = useAuth();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const router = useRouter();

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    },

    [],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  if (!isOpen) return <SidebarButton onClick={() => setIsOpen(!isOpen)} />;
  if (error)
    return (
      <div className="text-center text-red-600">Failed to load user data</div>
    );

  const isLoggedIn = data?.isAuthenticated;

  const handleLogout = async () => {
    try {
      const result = await axiosInstance("/auth/logout");
      router.refresh();
      setIsOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      ref={sidebarRef}
      className={clsx(
        "fixed top-0 z-50 h-screen w-3/5 bg-gray-700 p-4 text-white shadow-lg md:hidden",
        locale === "ar" ? "left-0" : "right-0",
      )}
    >
      <nav className="mt-12 flex flex-col items-center justify-start gap-6">
        <Link
          onClick={() => setIsOpen(false)}
          href="/"
          className="transition-colors hover:text-gray-300"
        >
          {texts.home}
        </Link>
        {isLoggedIn ? (
          <>
            <Link
              onClick={() => setIsOpen(false)}
              href="/create"
              className="transition-colors hover:text-gray-300"
            >
              {texts.create}
            </Link>
            <Link
              onClick={() => setIsOpen(false)}
              href="/my-leagues"
              className="transition-colors hover:text-gray-300"
            >
              {texts.myLeagues}
            </Link>
            <button
              onClick={handleLogout}
              className="focus:shadow-outline w-full rounded bg-red-500 px-4 py-2 text-center font-bold text-white transition-colors hover:bg-red-700 focus:outline-none"
            >
              {texts.logOut}
            </button>
          </>
        ) : (
          <>
            <Link
              onClick={() => setIsOpen(false)}
              href="/signin"
              className="transition-colors hover:text-gray-300"
            >
              {texts.signIn}
            </Link>
            <Link
              onClick={() => setIsOpen(false)}
              href="/signup"
              className="transition-colors hover:text-gray-300"
            >
              {texts.signUp}
            </Link>
          </>
        )}
        <LocaleSwitcher />
        <button
          onClick={() => setIsOpen(false)}
          className="focus:shadow-outline mt-12 rounded bg-gray-800 px-4 py-2 font-bold text-white transition-colors hover:bg-gray-600 focus:outline-none"
        >
          {texts.close}
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
