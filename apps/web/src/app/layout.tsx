import type { Metadata } from "next";
import { DM_Sans, Literata } from "next/font/google";

import { getEditorialCourse } from "@/content/editorial-course";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import { EditorialProgressProvider } from "@/components/editorial/editorial-progress-provider";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const reading = Literata({
  subsets: ["latin"],
  variable: "--font-reading",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const course = getEditorialCourse();

  return (
    <html lang="en" className={`${sans.variable} ${reading.variable}`}>
      <body className="bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <PwaRegister />
        <EditorialProgressProvider course={course}>{children}</EditorialProgressProvider>
      </body>
    </html>
  );
}
