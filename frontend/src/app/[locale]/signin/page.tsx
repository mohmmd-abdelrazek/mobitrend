import SigninForm from "@/src/components/signin/signinForm";
import { SigninTextProps } from "@/src/types/textProps";
import { useTranslations } from "next-intl";
import Image from "next/legacy/image";
import signinIcon from "@/src/assest/signin.gif";
import { Link } from "@/src/navigation";

function Signin() {
  const t = useTranslations("SignIn");
  const texts: SigninTextProps = {
    email: t("email"),
    emailPlaceholder: t("emailPlaceholder"),
    password: t("password"),
    passwordPlaceholder: t("passwordPlaceholder"),
    signIn: t("signIn"),
    signingIn: t("signingIn"),
    error: t("error"),
    donotHaveAccount: t("donotHaveAccount"),
    createAccount: t("createAccount"),
  };

  return (
    <div className="responsive-container flex flex-1 items-center justify-center bg-gray-100 py-6">
      <div className="w-full max-w-sm space-y-4 rounded-md bg-white p-6 shadow-md sm:max-w-md sm:p-8">
        <h2 className="text-center text-xl font-semibold text-gray-800 sm:text-2xl">
          {texts.signIn}
        </h2>
        <div className="mx-auto h-16 w-16 rounded-full">
          <Image
            className="rounded-full"
            src={signinIcon}
            alt={"signin icon"}
          ></Image>
        </div>
        <SigninForm {...texts} />
        <p className="mt-6 flex items-center justify-center gap-2 text-center text-sm text-gray-600">
          {texts.donotHaveAccount}
          <Link
            href="/signup"
            className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
          >
            {texts.createAccount}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signin;
