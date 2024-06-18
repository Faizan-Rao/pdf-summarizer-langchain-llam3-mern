
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/store/storeProvider";
import type { Metadata } from "next";
import SocketProvider from "@/context/socketProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <StoreProvider>
        <SocketProvider>
          <body className={inter.className}>{children}</body>
        </SocketProvider>
      </StoreProvider>
    </html>
  );
}