import './globals.css';

export const metadata = {
  title: 'Personal Finance Management System',
  description: 'Sistem Pengelolaan Keuangan',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-gray-50 text-gray-800 antialiased">{children}</body>
    </html>
  );
}
