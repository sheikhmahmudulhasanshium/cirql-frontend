import BasicPageProvider from "@/components/providers/basic-page-provider";
import Header from "../../components/header";
import Footer from "../../components/footer";
import BasicBodyProvider from "@/components/providers/basic-body-provider";
//no login-required
//see public user
const UserProfile = () => {
    return ( 
        <BasicPageProvider header={<Header/>} footer={<Footer/>}>
            <BasicBodyProvider>
                <div>
                    User Profile
                </div>
            </BasicBodyProvider>
        </BasicPageProvider>
     );
}
 
export default UserProfile;