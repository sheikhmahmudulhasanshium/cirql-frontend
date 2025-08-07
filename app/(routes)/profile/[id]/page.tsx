import BasicPageProvider from "@/components/providers/basic-page-provider";
import Body from "./body";
import Header from "../../components/header";
import Footer from "../../components/footer-with-design";
const ProfilePage = () => {
  return ( 
    <BasicPageProvider header={<Header/>} footer={<Footer/>}>
      <Body/>
    </BasicPageProvider>
   );
}
 
export default ProfilePage;