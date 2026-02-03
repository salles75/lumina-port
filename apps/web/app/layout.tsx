import type { Metadata } from 'next';
import { Bricolage_Grotesque, Fira_Code } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { Toaster } from '@/components/ui/toaster';
import '@/app/globals.css';

const bricolage = Bricolage_Grotesque({ 
  subsets: ['latin'], 
  variable: '--font-sans',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Lumina | Análise de Sentimento com IA',
    template: '%s | Lumina',
  },
  description:
    'Transforme feedbacks em insights acionáveis. Analise sentimentos de avaliações de clientes com inteligência artificial.',
  keywords: [
    'análise de sentimento',
    'NLP',
    'inteligência artificial',
    'feedback',
    'avaliações',
    'machine learning',
  ],
  authors: [{ name: 'Lumina' }],
  creator: 'Lumina',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://lumina.com',
    title: 'Lumina | Análise de Sentimento com IA',
    description:
      'Transforme feedbacks em insights acionáveis. Analise sentimentos de avaliações de clientes com inteligência artificial.',
    siteName: 'Lumina',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lumina | Análise de Sentimento com IA',
    description: 'Transforme feedbacks em insights acionáveis.',
    creator: '@lumina',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="pt-BR" suppressHydrationWarning>
        <body
          className={`${bricolage.variable} ${firaCode.variable} font-sans antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              {children}
              <Toaster />
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
