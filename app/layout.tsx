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
  const themeScript = `
    try {
      const savedTheme = window.localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const theme = savedTheme === "dark" || savedTheme === "light"
        ? savedTheme
        : prefersDark
          ? "dark"
          : "light";
      document.documentElement.dataset.theme = theme;
    } catch {
      document.documentElement.dataset.theme = "light";
    }
  `;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
