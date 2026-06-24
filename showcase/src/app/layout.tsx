import { AppToaster } from "@/components/ui/app-toaster";
import { lineSeedSansTH } from "@/lib/fonts/line-seed-sans-th";
import { buildMetadata, SITE_NAME } from "@/lib/metadata";
import "./globals.css";

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
    <html
      lang="th"
      className={`${lineSeedSansTH.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
