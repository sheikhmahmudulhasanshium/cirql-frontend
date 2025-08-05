import BasicPageProvider from "@/components/providers/basic-page-provider";
import Header from "../../components/header";
import Footer from "../../components/footer";
import BasicBodyProvider from "@/components/providers/basic-body-provider";
import { FriendRequestList } from "./body";

const FriendRequestsPage = () => {
    return ( 
        <BasicPageProvider header={<Header />} footer={<Footer />}>
            <BasicBodyProvider>
                <FriendRequestList />
            </BasicBodyProvider>
        </BasicPageProvider>
     );
}
 
export default FriendRequestsPage;
