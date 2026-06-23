import { Prompt } from "next/font/google";
import { AppToaster } from "@/components/ui/app-toaster";
import { buildMetadata, SITE_NAME } from "@/lib/metadata";
import "./globals.css";

const prompt = Prompt({
  variable: "--font-sans",
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = buildMetadata({
  title: SITE_NAME,
  description:
    "Mr.FOX Ecosystem — Platform Showcase, Application Directory และ Download Hub สำหรับ Creator Economy",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${prompt.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
