// ./app/(routes)/about/page.tsx

import BasicPageProvider from "@/components/providers/basic-page-provider";
import Header from "@/app/(routes)/components/header-sign-out";
import Footer from "@/app/(routes)/components/footer";
import type { Metadata } from 'next';
import About from "../components/about";

export const metadata: Metadata = {
  title: 'About Us - CiRQL',
  description: 'Learn more about the CiRQL community, our mission, and what makes us unique. Join the conversation!',
};

export default function AboutPage() {
  return (
    <BasicPageProvider
      // NO title, description, or icon props here
      header={<Header />}
      footer={<Footer />}
    >
      <About/>
    </BasicPageProvider>
  );
}