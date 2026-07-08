import type { Metadata } from "next";
import { Inter, DM_Sans, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const dmSans = DM_Sans({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"], 
  variable: "--font-body" 
});

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  weight: ["500", "600", "700", "800"], 
  variable: "--font-heading" 
});

export const metadata: Metadata = {
  title: "Q4Queue — Digital Queue Management & Smart Token System",
  description: "Transform your waiting experience with Q4Queue. Premium digital queue management for clinics, retail, and service counters.",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.className} ${dmSans.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
