import type { Metadata } from "next";
import "./globals.css";
import MainLayout from "./components/Layout";

export const metadata: Metadata = {
  title: "Mini dashboard",
  description: "Mini dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
