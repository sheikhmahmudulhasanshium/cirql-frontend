import BasicPageProvider from "@/components/providers/basic-page-provider";
import Footer from "../../components/footer";
import Header from "../../components/header-sign-out";

const AnnouncementPage = () => {
    return ( 
        <BasicPageProvider header={<Header/>} footer={<Footer/>}>
            <div>

            </div>
        </BasicPageProvider>
     );
}
 
export default AnnouncementPage;