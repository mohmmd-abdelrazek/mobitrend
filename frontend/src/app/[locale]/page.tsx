import { useTranslations } from "next-intl";
import { HomeTextProps } from "@/src/types/textProps";
import HomeClient from "@/src/components/home/HomeClient";

const LandingPage = () => {
  const t = useTranslations("Index");
  
  const texts: HomeTextProps = {
    homeGreeting: t("homeGreeting"),
    createPage: t("createPage"),
    myPages: t("myPages"),
    join: t("join"),
    league: t("league"),
    signIn: t("signIn"),
    signUp: t("signUp"),
    startCreating: t("startCreating"),
    signInToCreate: t("signInToCreate"),
    easyManage: t("easyManage"),
  };
  
  return (
    <div className="w-full flex-1 flex justify-center items-center responsive-container">
      <HomeClient  {...texts}/>
    </div>
  );
};

export default LandingPage;
