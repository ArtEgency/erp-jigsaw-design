import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import MuiThemeProvider from "@/lib/MuiThemeProvider";
import { LocaleProvider } from "@/lib/locale";
import { StyleInspector } from "@/components/dev/StyleInspector";

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sarabun",
});

export const metadata: Metadata = {
  title: "Jigsaw Master Design",
  description: "Jigsaw ERP — Component Showcase & Design System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={sarabun.variable}>
      <body className={sarabun.className}>
        <MuiThemeProvider>
          <LocaleProvider>
            <ToastProvider>
              {children}
              <StyleInspector />
            </ToastProvider>
          </LocaleProvider>
        </MuiThemeProvider>
      </body>
    </html>
  );
}
