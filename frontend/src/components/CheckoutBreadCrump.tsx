"use client";

import { cn } from "../lib/utils";
import { usePathname } from "../navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "./ui/breadcrumb";

const CheckoutBreadcrumb = () => {
  const pathname = usePathname();

  const steps = [
    { label: "Shipping", href: "/shipping" },
    { label: "Confirm Order", href: "/confirm-order" },
    { label: "Payment", href: "/payment" },
  ];

  return (
    <Breadcrumb className="">
      <BreadcrumbList>
        {steps.map((step, index) => {
          const isHighlighted =
            index <= steps.findIndex((step) => step.href === pathname);
          return (
            <BreadcrumbItem
              key={index}
              className={cn(
                "relative flex items-center px-4 py-2",
                isHighlighted
                  ? "bg-orange-500 text-white"
                  : "bg-gray-300 text-gray-500",
                "after:absolute after:right-[-10px] after:top-0 after:h-full after:w-5 after:border-b-[20px] after:border-t-[20px] after:border-transparent after:content-['']",
                isHighlighted
                  ? "after:border-l-orange-500"
                  : "after:border-l-gray-300",
                index === steps.length - 1 && "after:hidden",
                "first:rounded-l-md last:rounded-r-md",
              )}
              style={{
                zIndex: steps.length - index,
              }}
            >
              <BreadcrumbLink href={ step.href } className={cn(
                "font-medium",
                !isHighlighted && "pointer-events-none cursor-none"
              )}>
                {step.label}
              </BreadcrumbLink>
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CheckoutBreadcrumb;
