import BasicPageProvider from "@/components/providers/basic-page-provider";
import Header from "../components/header-sign-out";
import Footer from "../components/footer";

const AnnouncementsPage = () => {
    return ( 
        <BasicPageProvider header={<Header/>} footer={<Footer/>}>
            <div>

            </div>
        </BasicPageProvider>
     );
}
 
export default AnnouncementsPage;