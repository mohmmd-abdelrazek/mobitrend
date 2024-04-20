import { Link } from "@/src/navigation";
import { useTranslations } from "next-intl";
import HeaderClient from "./HeaderClient";
import { HeaderTextProps } from "../../types/textProps";
import LocaleSwitcher from "./LocalSwitcher";
import Sidebar from "./Sidebar";
import { CiSearch } from "react-icons/ci";
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
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
    <header className="responsive-container flex items-center justify-between bg-white py-4 text-gray-800 shadow-md md:sticky md:top-0 md:z-10">
      <Link
        href="/"
        className="text-md px-2 py-1 font-bold transition-colors hover:text-gray-600"
      >
        {t("logo")}
      </Link>
      <div className="hidden w-full max-w-sm items-center justify-center rounded-full border border-slate-500 pl-4 focus-within:border-blue-500 focus-within:shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50 lg:flex">
        <input
          className="text-md w-full py-1 text-gray-700 focus:outline-none"
          type="text"
          placeholder="Search product here..."
        />
        <div className="text-semibold flex h-8 min-w-10 items-center justify-center rounded-r-full bg-blue-600 text-lg text-white">
          <GrSearch />
        </div>
      </div>
      <div className="text-md flex items-center gap-8 font-bold">
        
        <div className="relative text-2xl">
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
