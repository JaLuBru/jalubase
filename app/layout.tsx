import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Personal Dashboard",
  description: "A low-friction capture and memory dashboard."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
