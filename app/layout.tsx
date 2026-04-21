import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DataSync | Portal do Cliente",
  description: "Portal B2B de PrivacyOps e DPOaaS para gestão de conformidade e riscos.",
};

import { DataSyncProvider } from "@/context/DataContext";
import { DPOCopilot } from "@/components/shared/DPOCopilot";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrains.variable}`}>
      <body>
        <DataSyncProvider>
          {children}
          <DPOCopilot />
        </DataSyncProvider>
      </body>
    </html>
  );
}
