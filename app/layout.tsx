import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Performance Review Generator | steeleprather.com",
  description:
    "Generate polished, professional performance reviews in seconds. Paste in bullet points, get a full review. $9 per review or $29/month unlimited.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
