import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'SolBundler - Solana Stealth Bundle & Launch Suite',
  description: 'Production-grade Solana Web3 SaaS platform for stealth bundling, wallet catalog pooling, multi-wallet launch distribution, automated volume bots, and pump.fun token management.',
  openGraph: {
    title: 'SolBundler - Solana Stealth Bundle & Launch Suite',
    description: 'Production-grade Solana Web3 SaaS platform for stealth bundling, wallet catalog pooling, multi-wallet launch distribution, automated volume bots, and pump.fun token management.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SolBundler - Solana Stealth Bundle & Launch Suite',
    description: 'Production-grade Solana Web3 SaaS platform for stealth bundling, wallet catalog pooling, multi-wallet launch distribution, automated volume bots, and pump.fun token management.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
