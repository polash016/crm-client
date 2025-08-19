import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./lib/Providers/Providers";
import ClientProviders from "./lib/Providers/ClientProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Digital Sheba CRM - Modern Customer Relationship Management",
  description: "Professional CRM solution for modern businesses. Manage customers, track orders, and grow your business with our comprehensive platform.",
  keywords: "CRM, Customer Relationship Management, Business Management, Sales, Marketing, Digital Sheba",
  authors: [{ name: "Digital Sheba" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#3b82f6",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className={inter.className}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
