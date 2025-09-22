import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import LanguageToggle from "@/components/LanguageToggle";
import DarkModeToggle from "@/components/DarkModeToggle";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "tr" ? "İş Güvenliği Analizörü" : "Work Safety Analyzer",
    description:
      locale === "tr"
        ? "İş yeri güvenliği için AI destekli fotoğraf analizi"
        : "AI-powered photo-based risk analysis for workplace safety",
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  const locales = ["en", "tr"];
  if (!locales.includes(locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <LanguageToggle />
      <DarkModeToggle />
      {children}
    </NextIntlClientProvider>
  );
}
