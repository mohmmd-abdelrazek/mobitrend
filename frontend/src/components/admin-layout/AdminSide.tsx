"use client";
import Link from "next/link";
import { usePathname } from "@/src/navigation";
import clsx from "clsx";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/admin/product/new", label: "New Product", icon: "➕" },
  { href: "/admin/products", label: "Products", icon: "📦" },
  { href: "/admin/orders", label: "Orders", icon: "📑" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/reviews", label: "Reviews", icon: "⭐" },
];

const AdminSide = () => {
  const pathname = usePathname();

  return (
    <ul className="flex justify-center text-gray-700 lg:flex-col">
      {links.map((link) => (
        <li key={link.href} className="flex-1">
          <Link
            href={link.href}
            className={clsx(
              "flex justify-center gap-2 text-ellipsis text-nowrap rounded-sm px-2 py-1 text-sm font-bold md:justify-normal",
              pathname.split("/")[2] === link.href.split("/")[2]
                ? "bg-blue-200 text-blue-600"
                : "hover:bg-gray-100",
            )}
          >
            {link.icon} <span className="hidden md:inline">{link.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};
export default AdminSide;
