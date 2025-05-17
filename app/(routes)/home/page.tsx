'use client'

import BasicPageProvider from "@/components/providers/basic-page-provider"
// Adjust these paths if your Home component is not in the root of `app`
// For example, if Home is in `app/(routes)/home/page.tsx` and Header/Footer are in `app/(routes)/components/`
// then the paths would be:
// Or, if Home is in app/(routes)/somepage/page.tsx and Header/Footer are in app/(routes)/components/
 import Header from "../components/header";
 import Footer from "../components/footer";


// Optional: For SEO and static generation, you can still export metadata from your page.
// This will be used for server rendering and search engines.
// BasicPageProvider will then update it client-side if needed.
/*
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Welcome To the community - CiRQL', // More specific title
  description: 'xcf btt thh - Join our amazing community and connect.',
  // icons: { icon: '/custom-home-icon.ico' } // If you have a very specific icon for this page
};
*/

export default function Home() {
  return (
    <BasicPageProvider
      title='Welcome To the community'
      description='xcf btt thh - A custom description for the home page.'
      icon='/custom-favicon-for-home.ico' // Provide a path to an actual icon, e.g., /favicon.ico or a custom one
      header={<Header/>}
      footer={<Footer/>}
    >
      {/* This is the main content of your page */}
      <div className="flex flex-col justify-center items-center text-center p-4">
        <h1>Body Element of the Home Page</h1>
        <p>This is where the specific content for the home page goes.</p>
        <p>The BasicPageProvider has wrapped this with a header, footer, and set the metadata.</p>
        {/*
          The `min-h-screen` was on this div, but it's better handled by RootLayout's
          `min-h-screen` on its main child div, and `flex-grow` on the <main> tag
          inside BasicPageProvider. This allows the header/footer to be part of the
          full height layout naturally.
        */}
      </div>
    </BasicPageProvider>
  )
}