// This is a SERVER COMPONENT.

import type { Metadata } from 'next';
import Body from './body'; // The Client Component that will handle all logic
import BasicPageProvider from '@/components/providers/basic-page-provider';
import Header from '../../components/header';
import Footer from '../../components/footer';

// Static metadata for this specific page.
export const metadata: Metadata = {
  title: 'My Profile',
  description: 'View and manage your personal profile information.',
};

/**
 * The page component is simple. It sets up the static layout and
 * delegates all dynamic content rendering to the <Body /> component.
 */
export default function MyProfilePage() {
  return (
    <BasicPageProvider header={<Header />} footer={<Footer />}>
      <Body />
    </BasicPageProvider>
  );
}