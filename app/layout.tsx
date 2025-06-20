import { Geist, Geist_Mono } from "next/font/google"; // Corrected import for next/font/google
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Script from 'next/script';
import type { Metadata } from 'next';
import { AuthProvider } from "../components/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner"
import { AuthInitializer } from "@/components/providers/AuthInitializer";
const geistSans = Geist({ // Corrected invocation
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({ // Corrected invocation
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- START: JSON-LD Structured Data ---
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "name": "CiRQL", // Using the name from your metadata for consistency
      "url": "https://cirql.vercel.app/",
      "description": "CiRQL: Your modern community platform for private group networks and seamless messaging. Stay in the loop!", // Using description from metadata
      "publisher": {
        "@type": "Person",
        "name": "Sheikh Mahmudul Hasan Shium",
        "url": "https://github.com/sheikhmahmudulhasanshium"
      },
      "logo": {
        "@type": "ImageObject",
        "url": "https://cirql.vercel.app/logo.png" // Ensure this path is correct relative to your public folder or a full URL
      },
      "image": {
        "@type": "ImageObject",
        "url": "https://cirql.vercel.app/logo-full.svg" // Ensure this path is correct
      }
    },
    {
      "@type": "SoftwareApplication",
      "name": "CiRQL", // Using the name from your metadata for consistency
      "applicationCategory": ["DesignApplication", "WebApplication", "MultimediaApplication", "UtilityApplication", "SocialNetworkingApplication"], // Added SocialNetworkingApplication based on description
      "operatingSystem": "Web Browser",
      "description": "CiRQL is a modern community platform for private group networks and seamless messaging. It helps users stay in the loop and connect within their private groups.", // Slightly adapted for SoftwareApplication
      "url": "https://cirql.vercel.app/",
      "author": {
        "@type": "Person",
        "name": "Sheikh Mahmudul Hasan Shium",
        "url": "https://github.com/sheikhmahmudulhasanshium"
      },
      "creator": {
        "@type": "Person",
        "name": "Sheikh Mahmudul Hasan Shium",
        "url": "https://github.com/sheikhmahmudulhasanshium"
      },
      "logo": {
        "@type": "ImageObject",
        "url": "https://cirql.vercel.app/logo.png" // Ensure this path is correct
      },
      "image": {
        "@type": "ImageObject",
        "url": "https://cirql.vercel.app/logo-full.svg" // Ensure this path is correct
      },
      "offers": {
        "@type": "Offer",
        "price": "0", // Assuming it's free to use
        "priceCurrency": "USD"
      },
      "isAccessibleForFree": true, // Assuming it's free
      "keywords": "community platform, private groups, messaging, social networking, CiRQL, group network, collaboration tool", // Updated keywords
      // featureList can be added if specific features are highlighted
      // "featureList": [
      //   "Private group creation",
      //   "Seamless messaging",
      //   "Community networking"
      // ]
    }
  ]
};
// --- END: JSON-LD Structured Data ---

export const metadata: Metadata = {
  metadataBase: new URL('https://cirql.vercel.app'),
  title: {
    default: 'CiRQL',
    template: '%s | CiRQL',
  },
  description: 'CiRQL: Your modern community platform for private group networks and seamless messaging. Stay in the loop!',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    title: 'CiRQL', // Changed to match title
    statusBarStyle: 'default',
    capable: true,
  },
  verification: {
    google: "WRd30nYZYkPGTW-FtsbgzbgKSaB1d_bteLvzj-sA3YU", // Google Site Verification
  },
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
        {/* --- Google Analytics Snippet --- */}
         {gaId && (
          <>
            <Script strategy="afterInteractive" async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}></Script>
            <Script
              id="ga-inline-script"
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

        {/* --- START: JSON-LD Structured Data Script --- */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* --- END: JSON-LD Structured Data Script --- */}

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
        > <AuthProvider>            
          <AuthInitializer>

          <main className="flex flex-col min-h-screen">{children}</main>             </AuthInitializer>
</AuthProvider>
        </ThemeProvider>        
        <Toaster />

      </body>
    </html>
  );
}