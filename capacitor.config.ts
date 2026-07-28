import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'uz.tibbiyotted.journal',
  appName: 'Tibbiyot Texnikumi',
  webDir: 'out',
  server: {
    url: 'https://webjurnal.vercel.app', // <-- Bu yerga o'zingizning Vercel manzilingizni yozing (Masalan: https://webjurnal.vercel.app)
    cleartext: true
  }
};

export default config;
