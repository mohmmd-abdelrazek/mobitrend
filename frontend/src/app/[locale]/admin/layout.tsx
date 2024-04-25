import AdminSide from "@/src/components/admin-layout/AdminSide";
import { ReactNode } from "react";

const AdminPanel = ({ children }: { children: ReactNode }) => {
  return (
    <div className="responsive-container flex flex-1 flex-col gap-8">
      <h2 className="text-center">
        Admin Dashboard
      </h2>
      <div className="flex flex-col lg:flex-row flex-1 gap-10 overflow-hidden">
        <aside className="lg:w-52 w-full">
            <AdminSide />
        </aside>
        <main className="flex-1 flex justify-center overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
