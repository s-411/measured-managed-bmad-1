import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from '@/lib/context';
import { AppShell } from '@/components/Navigation';

export const metadata: Metadata = {
  title: "MM Health Tracker",
  description: "Comprehensive health tracking application with calorie, exercise, and injection management",
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-mm-dark text-mm-white" suppressHydrationWarning>
        <AppProvider>
          <AppShell>
            {children}
          </AppShell>
        </AppProvider>
      </body>
    </html>
  );
}