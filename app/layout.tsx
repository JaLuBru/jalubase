import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./styles.css";

export const metadata: Metadata = {
  title: "Personal Dashboard",
  description: "A low-friction capture and memory dashboard."
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const savedTheme = cookieStore.get("theme")?.value;
  const theme = savedTheme === "dark" || savedTheme === "light" ? savedTheme : "dark";
  const themeScript = `
    try {
      const cookieTheme = document.cookie
        .split("; ")
        .find((row) => row.startsWith("theme="))
        ?.split("=")[1];
      const storedTheme = window.localStorage.getItem("theme");
      const theme = cookieTheme === "dark" || cookieTheme === "light"
        ? cookieTheme
        : storedTheme === "dark" || storedTheme === "light"
          ? storedTheme
          : "${theme}";
      document.documentElement.dataset.theme = theme;
    } catch {
      document.documentElement.dataset.theme = "${theme}";
    }
  `;

  return (
    <html lang="en" data-theme={theme} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
