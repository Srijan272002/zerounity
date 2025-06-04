import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GameForge - Build Games with AI",
  description: "Create and manage your game projects with AI assistance",
};

// This is needed to suppress the hydration warning for Chrome DevTools extensions
export function generateStaticParams() {
  return [];
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#130d28]" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen bg-[#130d28] text-white`} suppressHydrationWarning>
        <div className="min-h-screen flex flex-col bg-[#130d28]">
          <main className="flex-1 bg-[#130d28]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
