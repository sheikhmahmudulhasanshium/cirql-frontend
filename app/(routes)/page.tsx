'use client'

import BasicPageProvider from "@/components/providers/basic-page-provider"
import Footer from "./components/footer"; 
import Header from "./components/header-sign-out";
import FAQ from "./components/faq";
import About from "./components/about";
//export const metadata: Metadata = {
//  title: "CiRQL: Stay In the Loop.",
//  description: "A modern take on community and messaging, Cirql helps you stay connected through voice, chat, and private group networks — all in one private space.",
//};

export default function LandingPage() {
  return (
    <BasicPageProvider
      header={<Header/>}
      footer={<Footer/>}
      title= "CiRQL: Stay In the Loop."
  description= "A modern take on community and messaging, Cirql helps you stay connected through voice, chat, and private group networks — all in one private space."
    >
      {/* This is the main content of your page */}
      <div className="flex flex-col justify-center items-center text-center p-4">
        <About/>
        <FAQ/>
      </div>
    </BasicPageProvider>
  )
}