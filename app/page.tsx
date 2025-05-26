// app/page.tsx (or your specific route for LandingPage)

import BasicPageProvider from "@/components/providers/basic-page-provider";
import Footer from "./(routes)/components/footer";
import Header from "./(routes)/components/header-sign-out";
import FAQ from "./(routes)/components/faq";
import About from "./(routes)/components/about";
import type { Metadata } from 'next';
import Welcome from "./(routes)/components/welcome";

const pageTitle = "CiRQL: Stay In the Loop.";
const pageDescription = "Discover Cirql, your modern community platform for private group networks and seamless messaging. Effortlessly connect with secure voice, dynamic chat, and dedicated groups—all in one private space. Join Cirql today!";
const siteUrl = "https://cirql.vercel.app";
const previewImageUrl = "/logo-full.svg"; // Or "/logo-full.svg"

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,

  openGraph: {
    type: "website",
    url: siteUrl,
    title: pageTitle,
    description: pageDescription,
    images: [
      {
        url: previewImageUrl, // Correct: OpenGraph uses an object with a 'url' property
        // width: 500, // Example
        // height: 500, // Example
        // alt: 'CiRQL Logo', // Example
      }
    ],
    siteName: 'CiRQL',
  },

  // ***** CORRECTED Twitter SECTION *****
  twitter: {
    card: "summary_large_image",
    // site: "@YourTwitterSiteHandle", // Optional
    // creator: "@YourTwitterCreatorHandle", // Optional
    title: pageTitle,
    description: pageDescription,
    // `images` for Twitter can be an array of strings (URLs)
    // or an array of objects with `url`, `alt`, `width`, `height`
    images: [previewImageUrl], // Correct: Direct array of image URLs or TwitterImage objects
    // If you want to provide alt text for Twitter images, you can do it like this:
    // images: [
    //   {
    //     url: previewImageUrl,
    //     alt: 'CiRQL Logo',
    //     // width: 500, // Optional
    //     // height: 500, // Optional
    //   }
    // ],
  },

  alternates: {
    canonical: siteUrl,
  },
};

export default function LandingPage() {
  return (
    <BasicPageProvider
      header={<Header />}
      footer={<Footer />}
    >
      <div className="flex flex-col justify-center items-center text-center p-4">
        <Welcome/>
        <About />
        <FAQ />
      </div>
    </BasicPageProvider>
  );
}