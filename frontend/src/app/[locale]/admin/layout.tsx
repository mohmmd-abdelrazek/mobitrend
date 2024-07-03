import AdminSide from "@/src/components/admin-layout/AdminSide";
import { ReactNode } from "react";

const AdminPanel = ({ children }: { children: ReactNode }) => {
  const links = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "🏠" },
    { href: "/admin/product/new", label: "New Product", icon: "➕" },
    { href: "/admin/products", label: "Products", icon: "📦" },
    { href: "/admin/orders", label: "Orders", icon: "📑" },
    { href: "/admin/users", label: "Users", icon: "👥" },
    { href: "/admin/reviews", label: "Reviews", icon: "⭐" },
  ];
  return (
    <div className="large-container flex flex-1 flex-col gap-8">
      <h2 className="text-center">
        Admin Dashboard
      </h2>
      <div className="flex flex-col lg:flex-row flex-1 gap-8 lg:gap-24 overflow-hidden">
        <aside className="lg:w-40 w-full">
            <AdminSide links={links} />
        </aside>
        <main className="flex-1 flex justify-center overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
