import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '분실물 찾기',
  description: '분실물 관리 시스템',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}