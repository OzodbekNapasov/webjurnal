import './globals.css';
import type { Metadata } from 'next';
import LogoutButton from '../components/LogoutButton';

export const metadata: Metadata = {
  title: 'Tibbiyot Texnikumlari — Elektron Dars Jurnali',
  description: 'Shahrisabz va Ibn Sino Tibbiyot Texnikumlari elektron dars jurnali platformasi',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Inter', sans-serif" }}>
        <LogoutButton />
        {children}
      </body>
    </html>
  );
}
