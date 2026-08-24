import { Suspense } from "react";
import type { Metadata } from "next";
import { Prompt, Open_Sans, Lora, Source_Code_Pro } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import "../globals.css";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

const loraHeading = Lora({ subsets: ["latin"], variable: "--font-heading" });

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const promptFont = Prompt({
  weight: ["400", "500", "600", "700"],
  subsets: ["thai"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ระบบ E-Commerce COSCI",
  description: "เรียนรู้การเขียน Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={cn(
        promptFont.className,
        "font-sans",
        openSans.variable,
        loraHeading.variable,
        sourceCodePro.variable
      )}
    >
      <body>
        <Suspense fallback={<div className="h-16 border-b bg-background" />}>
          <Navbar />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
