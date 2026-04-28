import type { Metadata } from 'next';
import { Instrument_Serif, Inter, Inter_Tight } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Healthscore AI - Understand Your Biomarkers',
  description: 'AI-powered insights from your lab results',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${interTight.variable} ${instrumentSerif.variable} ${inter.className} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
