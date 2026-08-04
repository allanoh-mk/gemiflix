import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'GemiFlix — Premium Media Center',
  description: 'A localhost, premium media center with liquid glass design. Stream, discover, and enjoy your favorite movies and series.',
  keywords: ['GemiFlix', 'media center', 'streaming', 'movies', 'series', 'glassmorphism'],
  authors: [{ name: 'GemiFlix' }],
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground overflow-x-hidden`}
      >
        {/* Aurora animated background */}
        <div className="aurora-bg" aria-hidden="true">
          <div className="aurora-orb" />
          <div className="aurora-orb" />
          <div className="aurora-orb" />
        </div>
        {/* Liquid morphing blobs */}
        <div className="liquid-blob" aria-hidden="true" style={{ top: '20%', left: '10%', width: '400px', height: '400px' }} />
        <div className="liquid-blob liquid-blob-secondary" aria-hidden="true" style={{ bottom: '10%', right: '5%', width: '350px', height: '350px' }} />
        {/* Subtle mesh grid pattern */}
        <div className="mesh-bg" aria-hidden="true" />
        {/* Dot matrix pattern */}
        <div className="dot-matrix-bg" aria-hidden="true" />
        {/* Noise texture overlay */}
        <div className="noise-overlay" aria-hidden="true" />
        {/* Main content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {children}
        </div>
        <Toaster
          theme="dark"
          richColors
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(15, 15, 15, 0.9)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              color: '#f5f5f5',
            },
          }}
        />
      </body>
    </html>
  );
}
