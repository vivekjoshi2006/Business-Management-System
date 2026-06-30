import './globals.css'; // This MUST be here to load Tailwind CSS globally
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Business Management System',
  description: 'Operations Dashboard Portal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-slate-50">
      <body className={`${inter.className} h-full antialiased text-slate-950`}>
        {/* DO NOT import or render <Sidebar /> here. Only render children. */}
        {children}
      </body>
    </html>
  );
}