import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Pick<Props, "params">) {
  const { locale } = await params;
  return buildMetadata({
    title: "Contact",
    description: "ติดต่อ Mr.FOX — Business Inquiry, Partnership และ Support",
    path: "/contact",
    locale: locale as Locale,
  });
}

export default function ContactLayout({ children }: Pick<Props, "children">) {
  return children;
}
