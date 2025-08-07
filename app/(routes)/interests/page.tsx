// src/app/(routes)/interests/page.tsx
import type { Metadata } from 'next';
import BasicPageProvider from '@/components/providers/basic-page-provider';
import Header from '@/app/(routes)/components/header';
import Body from './body';
import Footer from '../components/footer-with-design';

export const metadata: Metadata = {
  title: 'Select Your Interests',
  description: 'Choose your interests to get personalized recommendations and connect with like-minded people on Cirql.',
};

const InterestsPage = () => {
  return (
    <BasicPageProvider header={<Header />} footer={<Footer />}>
      <Body />
    </BasicPageProvider>
  );
};

export default InterestsPage;