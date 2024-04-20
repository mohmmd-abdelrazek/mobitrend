import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations("footer");
  return (
    <footer className="flex py-2 resposive-container items-center justify-between bg-black responsive-container text-white">
      <div className="text-sm">
      {t("copyright", { year: new Date().getFullYear() })}
      </div>
      {/* <nav>
        <ul className="flex space-x-4">
          <li>
            <a href="/terms" className="hover:underline">
              Terms of Service
            </a>
          </li>
          <li>
            <a href="/privacy" className="hover:underline">
              Privacy Policy
            </a>
          </li>
        </ul>
      </nav>  */}
    </footer>
  );
};

export default Footer;
