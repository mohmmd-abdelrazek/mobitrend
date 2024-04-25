import { Link } from "@/src/navigation";
import { useTranslations } from "next-intl";
import HeaderClient from "./HeaderClient";
import { HeaderTextProps } from "../../types/textProps";

import { GrSearch } from "react-icons/gr";
import { FaShoppingCart } from "react-icons/fa";

export const Header = () => {
  const t = useTranslations("Index");

  const texts: HeaderTextProps = {
    home: t("home"),
    create: t("create"),
    myLeagues: t("myLeagues"),
    signIn: t("signIn"),
    signUp: t("signUp"),
    logOut: t("logOut"),
    close: t("close"),
  };

  return (
    <header className="responsive-container flex items-center bg-blue-950 justify-between shadow-sm py-2 md:sticky md:top-0 md:z-10">
      <Link
        href="/"
        className="text-md px-2 py-1 text-white font-extrabold transition-colors hover:text-gray-100"
      >
        {t("logo")}
      </Link>
      <div className="hidden w-full max-w-sm bg-white items-center justify-center rounded-full border border-slate-500 pl-4 focus-within:border-blue-500 focus-within:shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50 hover:border-blue-500 hover:shadow-sm hover:ring-2 hover:ring-blue-500 hover:ring-opacity-50 lg:flex">
        <input
          className="text-md w-full py-1 text-gray-700 focus:outline-none"
          type="text"
          placeholder="Search product here..."
        />
        <div className="text-semibold cursor-pointer flex h-8 min-w-10 items-center justify-center rounded-r-full bg-blue-600 text-lg text-white">
          <GrSearch />
        </div>
      </div>
      <div className="flex items-center gap-8 font-semibold">
        <div className="relative cursor-pointer text-xl text-white">
          <span>
            <FaShoppingCart />
          </span>
          <div className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 p-1 text-sm text-white">
            <p>0</p>
          </div>
        </div>
        <HeaderClient {...texts} />
      </div>
    </header>
  );
};

export default Header;
