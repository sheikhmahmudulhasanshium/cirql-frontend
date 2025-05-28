// Assuming this file is app/page.tsx or app/(routes)/some-route/page.tsx
// NO 'use client' here

import BasicPageProvider from "@/components/providers/basic-page-provider";
// Adjust paths as per your project structure.
// If this page is app/page.tsx and Header/Footer are in app/(routes)/components:
//import Header from "./(routes)/components/header"; // Example if in app/page.tsx
//import Footer from "./(routes)/components/footer"; // Example if in app/page.tsx
// If this page is app/(routes)/home/page.tsx and Header/Footer are in app/(routes)/components:
 import Header from "../components/header"; // This would be correct
 import Footer from "../components/footer"; // This would be correct

import type { Metadata } from 'next';
import Navbar from "./navbar";

export const metadata: Metadata = {
  title: 'Welcome to the CiRQL Community!', // Catchy and informative
  description: 'Join CiRQL, your vibrant private community platform. Connect, share, and stay in the loop. This is the home page.',
  // icons: { icon: '/custom-home-icon.ico' } // Optional: if this page has a specific icon
};

export default function Home() {
  return (
    <BasicPageProvider
      // title, description, and icon props are NOT passed here.
      // Metadata object above handles this.
      header={<Header />}
      footer={<Footer />}
    >
      <div className="flex flex-col justify-center items-center text-center p-4 flex-grow"> {/* Added flex-grow if needed */}
        <Navbar/>
        <h1 className="text-3xl font-bold mb-4">Welcome to the Home Page!</h1>
        <p className="mb-2">This is where the specific content for the home page goes.</p>
        <p>
          The BasicPageProvider wraps this content with a shared header and footer,
          and Next.js sets the page title and meta description based on the exported `metadata` object.
        </p>
      </div>
    </BasicPageProvider>
  );
}