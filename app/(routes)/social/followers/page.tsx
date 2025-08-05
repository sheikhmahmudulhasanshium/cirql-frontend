'use client';

import BasicPageProvider from "@/components/providers/basic-page-provider";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { FollowersList } from "./body";

const FollowersListPage = () => {
  return ( 
    <BasicPageProvider header={<Header />} footer={<Footer />}>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Followers</h1>
        <FollowersList />
      </div>
    </BasicPageProvider>
   );
}
 
export default FollowersListPage;
