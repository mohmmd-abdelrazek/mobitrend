import {createLocalizedPathnamesNavigation} from 'next-intl/navigation';
import {locales, pathnames, localePrefix} from './config';

export const {Link, redirect, usePathname, useRouter} =
  createLocalizedPathnamesNavigation({
    locales,
    pathnames: pathnames as typeof pathnames & Record<string & {}, string>,
    localePrefix
  });