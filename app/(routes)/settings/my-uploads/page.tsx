// src/app/(routes)/settings/my-uploads/page.tsx
import type { Metadata } from 'next';
import BasicPageProvider from "@/components/providers/basic-page-provider";
import Header from "@/app/(routes)/components/header";
import Footer from "@/app/(routes)/components/footer";
import Body from './body';

export const metadata: Metadata = {
  title: 'My Uploads',
  description: 'View and manage all of your uploaded files.',
};

export default function MyUploadsPage() {
  return (
    <BasicPageProvider
      header={<Header />}
      footer={<Footer />}
    >
      <Body />
    </BasicPageProvider>
  );
}