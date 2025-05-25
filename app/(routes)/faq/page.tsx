
import BasicPageProvider from "@/components/providers/basic-page-provider";
import Header from "@/app/(routes)/components/header-sign-out";
import Footer from "@/app/(routes)/components/footer";
import type { Metadata } from 'next';
import FAQ from "../components/faq"; 

export const metadata: Metadata = {
  title: 'Frequently Asked Questions - CiRQL',
  description: 'Find answers to your Frequently Asked Questions (FAQ) about CiRQL. Get quick information on our community, how to get started, platform features, and more.',
};

export default function FAQPage() {
  return (
    <BasicPageProvider
      // NO title, description, or icon props here because metadata object handles it
      header={<Header />}
      footer={<Footer />}
    >
      <FAQ/>
    </BasicPageProvider>
  );
}