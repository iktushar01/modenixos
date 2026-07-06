import { APP_NAME } from "@/lib/app-config";
import { Toaster } from "@/components/ui/sonner";
import QueryProviders from "@/providers/QueryProvider";
import { NavigationProgress } from "@/components/shared/NavigationProgress";
import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
// @ts-ignore: side-effect CSS import
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Full-stack project starter with role-based auth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <QueryProviders>
          <TooltipProvider>
            <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NavigationProgress />
            {children}
            <Toaster position="top-center" richColors />
          </ThemeProvider>
          </TooltipProvider>
        </QueryProviders>
      </body>
    </html>
  );
}