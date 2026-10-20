import type { Metadata } from "next";

import "./globals.css";

import { LanguageProvider } from "@/components/jjm/language-provider";

export const metadata: Metadata = {
  title: "Jal Jeevan Mission",
  description:
    "Jal Jeevan Mission — water access, quality and citizen services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
