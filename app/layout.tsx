import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "eInk HMI Dashboard - reTerminal 1001",
  description: "Good looking HMI dashboard for reTerminal 1001 eInk display",
  viewport: "width=800, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
};

export const viewport: Viewport = {
  width: "800",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
        {children}
      </body>
    </html>
  );
}
