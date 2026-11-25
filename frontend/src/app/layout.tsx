import type { Metadata } from 'next';
import '@/styles/globals.css';
import { I18nProvider } from '@/lib/i18n';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { SessionProvider } from '@/components/auth/SessionProvider';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'NyayaSetu — Legal Aid & Rights Awareness Portal',
  description:
    'A secure, multilingual portal helping Indian citizens understand their legal rights and access free, genuine government legal aid under NALSA.',
  keywords: [
    'Legal Aid India',
    'NALSA 15100',
    'Free Legal Aid',
    'Right to Information',
    'Consumer Protection India',
    'District Legal Services Authority',
    'Legal Rights Portal',
  ],
  authors: [{ name: 'NyayaSetu Initiative' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-base text-text-primary flex flex-col antialiased selection:bg-accent/30 selection:text-text-primary">
        <Script id="theme-preference" strategy="beforeInteractive">
          {`(function () {
            try {
              if (window.localStorage.getItem('nyaya_theme') === 'dark') {
                document.documentElement.classList.add('dark');
              }
            } catch (_) {}
          })();`}
        </Script>
        <Script id="chunk-load-recovery" strategy="beforeInteractive">
          {`(function () {
            var recoveryKey = 'nyayasetu:chunk-load-recovery';
            function recover(error) {
              var message = typeof error === 'string' ? error : error && error.message ? error.message : '';
              if (!/ChunkLoadError|Loading (?:CSS )?chunk .* failed|chunk .* timed out/i.test(message)) return;
              try {
                if (window.sessionStorage.getItem(recoveryKey) === '1') return;
                window.sessionStorage.setItem(recoveryKey, '1');
              } catch (_) {
                return;
              }
              window.location.reload();
            }
            window.addEventListener('unhandledrejection', function (event) {
              recover(event.reason);
            });
            window.addEventListener('error', function (event) {
              var target = event.target;
              if (target instanceof HTMLScriptElement && target.src.indexOf('/_next/static/chunks/') !== -1) {
                recover('ChunkLoadError');
              } else {
                recover(event.message);
              }
            }, true);
          })();`}
        </Script>
        <I18nProvider>
          <SessionProvider>
            <Header />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
            <ChatWidget />
          </SessionProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
