// app/(routes)/home/page.tsx
import BasicPageProvider from "@/components/providers/basic-page-provider";
import Header from "../components/header";
import type { Metadata } from 'next';
import Body from "./body";
import Footer from "../components/footer-with-design";

export const metadata: Metadata = {
  title: 'Welcome to the CiRQL Community!',
  description: 'Join CiRQL, your vibrant private community platform. Connect, share, and stay in the loop. This is the home page.',
};

export default function Home() {
  return (
    <BasicPageProvider
      header={<Header />}
      footer={<Footer />}
    >
      <Body />
    </BasicPageProvider>
  );
}