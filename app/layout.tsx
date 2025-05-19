// RootLayout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Script from 'next/script';
import type { Metadata } from 'next'; // Import Metadata type

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Define global/fallback metadata for the application
export const metadata: Metadata = {
  metadataBase: new URL('https://cirql.vercel.app'), // Important: Set your production URL base
  title: {
    default: 'CiRQL', // Default title for the site
    template: '%s | CiRQL', // Template for page titles, e.g., "About Us | CiRQL"
  },
  description: 'CiRQL: Your modern community platform for private group networks and seamless messaging. Stay in the loop!', // Default description
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      // '/favicon.ico' is often automatically picked up by Next.js if present in /public or /app
    ],
    shortcut: ['/favicon.ico'], // For older browsers or specific needs
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    title: 'cirql', // Name for "Add to Home Screen"
    statusBarStyle: 'default',
    capable: true,
  },
  verification: {
    google: "WRd30nYZYkPGTW-FtsbgzbgKSaB1d_bteLvzj-sA3YU", // Google Site Verification
  },
  // You can add default Open Graph properties here if desired
  // openGraph: {
  //   siteName: 'CiRQL',
  // },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Favicon links, manifest, apple-mobile-web-app-title, and google-site-verification
          are now handled by the `metadata` object exported above.
          Next.js will automatically inject them into the <head>.
          Manual tags for these are no longer needed here.
        */}

        {/* --- Google Analytics Snippet --- */}
         {gaId && (
          <>
            <Script strategy="afterInteractive" async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}></Script>
            <Script
              id="ga-inline-script" // Added an ID for the inline script
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        )}
        {/* --- End Google Analytics Snippet --- */}

        {/* --- Google Tag Manager - Head Snippet --- */}
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

      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <main className="flex flex-col min-h-screen">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}