import BasicPageProvider from '@/components/providers/basic-page-provider';
import Body from './body';
import { Metadata } from 'next';
import Header from '../components/header';
import Footer from '../components/footer';

export const metadata: Metadata = {
  title: 'Social Hub',
  description: 'Manage your friends, followers, and social requests on CiRQL.',
};

const SocialPage = () => {
  return (
    <BasicPageProvider header={<Header />} footer={<Footer />}>
      <Body />
    </BasicPageProvider>
  );
};

export default SocialPage;