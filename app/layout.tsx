import './globals.css';
import type { Metadata } from 'next';
import LogoutButton from '../components/LogoutButton';

export const metadata: Metadata = {
  title: 'Tibbiyot Texnikumlari — Elektron Dars Jurnali',
  description: 'Shahrisabz va Ibn Sino Tibbiyot Texnikumlari elektron dars jurnali platformasi',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(reg) {
                    console.log('ServiceWorker registered successfully');
                  }).catch(function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
              }
            `
          }}
        />
      </head>
      <body style={{ fontFamily: "'Inter', sans-serif" }}>
        <LogoutButton />
        {children}
      </body>
    </html>
  );
}
