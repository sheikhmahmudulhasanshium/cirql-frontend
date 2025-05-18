//import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { GoogleAnalytics } from "@next/third-parties/google";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

//export const metadata: Metadata = {
//  title: "CiRQL: Stay In the Loop.",
//  description: "A modern take on community and messaging, Cirql helps you stay connected through voice, chat, and private group networks — all in one private space.",
//};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //console.log()
  return (
    <html lang="en" suppressHydrationWarning>
      {/* This comment is OUTSIDE <head> and is fine */}
      <head>
        {/* NO JSX COMMENTS OR WHITESPACE NODES ALLOWED HERE AS DIRECT CHILDREN */}
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="cirql" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="google-site-verification" content="WRd30nYZYkPGTW-FtsbgzbgKSaB1d_bteLvzj-sA3YU" />
        {/* Any other valid <meta>, <link>, <script>, <style>, <title> tags go here,
            with no extra characters or comments between them. */}
      </head>
      <body suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col min-h-screen">
              {children}
            </div>
          </ThemeProvider>
      </body>
      {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && 
      <GoogleAnalytics gaId= {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}/>}
    </html>
  );
}