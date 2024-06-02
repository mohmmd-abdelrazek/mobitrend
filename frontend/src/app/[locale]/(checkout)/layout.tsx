import CheckoutBreadcrumb from "@/src/components/CheckoutBreadCrump";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";

const AdminPanel = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="responsive-container flex flex-1 flex-col gap-8 py-8 items-center">
      <CheckoutBreadcrumb />
      <div className="flex flex-1 flex-col gap-8 overflow-hidden lg:flex-row lg:gap-24">
        {children}
      </div>
    </div>
  );
};

export default AdminPanel;
