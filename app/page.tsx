'use client'

import BasicPageProvider from "@/components/providers/basic-page-provider"
import Footer from "./(routes)/components/footer"; 
import Header from "./(routes)/components/header-sign-out";
import FAQ from "./(routes)/components/faq";
import About from "./(routes)/components/about";
//export const metadata: Metadata = {
//  title: "CiRQL: Stay In the Loop.",
//  description: "A modern take on community and messaging, Cirql helps you stay connected through voice, chat, and private group networks — all in one private space.",
//};

export default function LandingPage() {
  return (
    <BasicPageProvider
      header={<Header/>}
      footer={<Footer/>}
      icon="/favicon.ico"
      title= "CiRQL: Stay In the Loop."
      description= "Discover Cirql, your modern **community** platform for **private group networks** and seamless **messaging**. Effortlessly connect with secure voice, dynamic chat, and dedicated groups—all in one private space. Join Cirql today!"
    >
      {/* This is the main content of your page */}
      <div className="flex flex-col justify-center items-center text-center p-4">
        <About/>
        <FAQ/>
      </div>
    </BasicPageProvider>
  )
}