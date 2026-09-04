import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const poppinsBold = Poppins({
  weight: '700',
  subsets: ['latin'],
  variable: '--font-poppins-bold',
  display: 'swap',
});

const poppinsMedium = Poppins({
  weight: '500',
  subsets: ['latin'],
  variable: '--font-poppins-medium',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ShareBytes — Share Food, Spread Kindness',
  description: 'India\'s community food sharing platform connecting restaurants, donors, customers, NGOs and trusts to rescue surplus food.',
  icons: {
    icon: '/logo.png',
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
      className={`${poppinsBold.variable} ${poppinsMedium.variable}`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="bg-surface font-body text-on-surface antialiased min-h-screen flex flex-col">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
