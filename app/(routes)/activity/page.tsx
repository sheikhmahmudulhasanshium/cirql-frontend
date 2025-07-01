import type { Metadata } from 'next';
import BasicPageProvider from "@/components/providers/basic-page-provider";
import Header from "@/app/(routes)/components/header";
import Footer from "@/app/(routes)/components/footer";
import Body from './body';

export const metadata: Metadata = {
  title: 'My Activity',
  description: 'Review your recent activity and engagement on the platform.',
};

export default function MyActivityPage() {
  return (
    <BasicPageProvider
      header={<Header />}
      footer={<Footer />}
    >
      <Body />
    </BasicPageProvider>
  );
}