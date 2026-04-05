import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import MuiThemeProvider from "@/lib/MuiThemeProvider";
import { LocaleProvider } from "@/lib/locale";
import { StyleInspector } from "@/components/dev/StyleInspector";

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
    <html lang="th">
      <body className="antialiased">
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
