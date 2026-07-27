import './globals.css';
import type { Metadata } from 'next';
import LogoutButton from '../components/LogoutButton';
import NavigationLayout from '../components/NavigationLayout';

export const metadata: Metadata = {
  title: 'Tibbiyot Texnikumlari — Elektron Dars Jurnali',
  description: 'Shahrisabz va Ibn Sino Tibbiyot Texnikumlari elektron dars jurnali platformasi',
  manifest: '/manifest.json',
  icons: {
    icon: '/images/Logo.png',
    shortcut: '/images/Logo.png',
    apple: '/images/Logo.png',
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
                  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    // Unregister in development to prevent caching conflicts with Next.js dev server
                    navigator.serviceWorker.getRegistrations().then(function(regs) {
                      for (let reg of regs) {
                        reg.unregister().then(function() {
                          console.log('ServiceWorker unregistered in development');
                        });
                      }
                    });
                  } else {
                    navigator.serviceWorker.register('/sw.js').then(function(reg) {
                      console.log('ServiceWorker registered successfully');
                    }).catch(function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    });
                  }
                });
              }
            `
          }}
        />
      </head>
      <body style={{ fontFamily: "'Inter', sans-serif" }}>
        <LogoutButton />
        <NavigationLayout>{children}</NavigationLayout>
      </body>
    </html>
  );
}


