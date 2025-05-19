// RootLayout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Script from 'next/script';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      {/* THE <head> ELEMENT STARTS HERE. SCRIPTS MUST BE INSIDE IT. */}
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="cirql" />
        <link rel="manifest" href="/site.webmanifest" />

        <meta name="google-site-verification" content="WRd30nYZYkPGTW-FtsbgzbgKSaB1d_bteLvzj-sA3YU" />

        {/* --- Google Analytics Snippet (for GA verification) --- */}
        {/* This block MUST render within the <head> tags of your final HTML */}
        {gaId && (
          <>
            <Script
              strategy="afterInteractive" // This strategy is generally fine.
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script
              id="google-analytics-config"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}'); {/* Removed page_path for simplicity during verification */}
                `,
              }}
            />
          </>
        )}
        {/* --- End Google Analytics Snippet --- */}


        {/* --- Google Tag Manager - Head Snippet --- */}
        {/* This block MUST also render within the <head> tags */}
        {gtmId && (
          <Script
            id="google-tag-manager-head"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              `,
            }}
          />
        )}
        {/* --- End Google Tag Manager - Head Snippet --- */}
      </head>
      {/* THE <head> ELEMENT ENDS HERE. */}

      <body /* ... */ >
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
              title="Google Tag Manager noscript"
            ></iframe>
          </noscript>
        )}
        <ThemeProvider /* ... */ >
          <main className="flex flex-col min-h-screen">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}