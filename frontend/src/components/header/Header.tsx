import { Link } from "@/src/navigation";
import { useTranslations } from "next-intl";
import HeaderClient from "./HeaderClient";
import { HeaderTextProps } from "../../types/textProps";
import SearchBar from "../SearchBar";
import CartIcon from "./CartIcon";
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
      <SearchBar />
      <div className="flex items-center gap-8 font-semibold">
      <Link href="/cart" className="relative cursor-pointer text-xl text-white">
          <span>
            <FaShoppingCart />
          </span>
          <div className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 p-1 text-sm text-white">
            <CartIcon />
          </div>
        </Link>
        <HeaderClient {...texts} />
      </div>
    </header>
  );
};

export default Header;
