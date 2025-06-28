import BasicPageProvider from "@/components/providers/basic-page-provider";
import Body from "./body";
import type { Metadata } from 'next';   
import Header from "../components/header";
import Footer from "../components/footer";
export const metadata: Metadata = {
  title: 'Notifications',
  description: 'Stay updated with the latest announcements and notifications from the CiRQL community.',
};
const Notifications = () => {
  return ( 
    <BasicPageProvider  header={<Header />} footer={<Footer />}>
      
        <Body/>
    </BasicPageProvider>
   );
}
 
export default Notifications;