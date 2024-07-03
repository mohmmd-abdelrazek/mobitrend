import type { Metadata } from "next";
import "@/src/app/globals.css";
import Header from "@/src/components/header/Header";
import Footer from "@/src/components/Footer";
import { Toaster } from "react-hot-toast";
import { SWRProvider } from "./providers";

export const metadata: Metadata = {
  title: "MobiTrend",
  description: "MobiTrend mobile shop",
};

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="flex min-h-screen flex-col">
        <SWRProvider>
          <Toaster position="top-center" />
          <Header />
          {children}
          <Footer />
        </SWRProvider>
      </body>
    </html>
  );
}
