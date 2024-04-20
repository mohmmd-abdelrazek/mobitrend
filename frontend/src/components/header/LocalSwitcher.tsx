import { useLocale } from "next-intl";
import { locales } from "@/src/config";
import LocaleSwitcherSelect from "./LocaleSwitcherSelect";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const localeNames = {
    en: "EN",
    ar: "عربي",
  };

  return (
    <LocaleSwitcherSelect defaultValue={locale} label={locale}>
      {locales.map((cur) => (
        <option className="text-gray-500 text-md" key={cur} value={cur}>
          {localeNames[cur]}
        </option>
      ))}
    </LocaleSwitcherSelect>
  );
}
