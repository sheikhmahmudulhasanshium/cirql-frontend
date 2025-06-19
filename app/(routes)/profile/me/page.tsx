import BasicBodyProvider from "@/components/providers/basic-body-provider";
import BasicPageProvider from "@/components/providers/basic-page-provider";
import Header from "../../components/header";
import Footer from "../../components/footer";
//own profile
const MyProfile = () => {
    return ( 
        <BasicPageProvider header={<Header/>} footer={<Footer/>}>
            <BasicBodyProvider>
                <div>
                    My Profile
                </div>
            </BasicBodyProvider>
        </BasicPageProvider>
     );
}
 
export default MyProfile;