// src/app/about/page.tsx
'use client'

import BasicPageProvider from "@/components/providers/basic-page-provider"
import Header from "../components/header" // Adjust path as needed
import Footer from "../components/footer" // Adjust path as needed
import About from "../components/about"

// Optional: export const metadata for SEO for this page
// export const metadata = { title: "About Us - CiRQL" };


export default function AboutPage() {
  return (
    <BasicPageProvider
      title='About Us - CiRQL'
      description='Learn more about the CiRQL community.'
      // icon='/about-icon.png' // Optional: if this page has a unique icon
      header={<Header />}
      footer={<Footer />}
    >
      <div className="p-4">
        <About/>
      </div>
    </BasicPageProvider>
  )
}