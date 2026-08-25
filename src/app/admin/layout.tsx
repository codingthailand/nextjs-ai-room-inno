import type { Metadata } from "next";
import { Prompt, Open_Sans, Lora, Source_Code_Pro } from "next/font/google";
import { connection } from "next/server";
import { cn } from "@/lib/utils";
import "../globals.css";
import AdminShell from "./components/admin-shell";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

const loraHeading = Lora({ subsets: ["latin"], variable: "--font-heading" });

const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-sans" });

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-mono",
});

const promptFont = Prompt({
  weight: ["400", "500", "600", "700"],
  subsets: ["thai"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "ระบบจัดการร้านค้า",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connection();

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
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
