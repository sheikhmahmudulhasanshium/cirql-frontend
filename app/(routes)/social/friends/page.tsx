'use client';

import BasicPageProvider from "@/components/providers/basic-page-provider";
import Footer from "../../components/footer";
import Header from "../../components/header";
import BasicBodyProvider from "@/components/providers/basic-body-provider";
import { FriendsList } from "./body";

const FriendsListPage = () => {
  return ( 
    <BasicPageProvider header={<Header />} footer={<Footer />}  >
      <BasicBodyProvider>
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Your Friends</h1>
          <FriendsList />
        </div>
      </BasicBodyProvider>
    </BasicPageProvider>
  );
}
 
export default FriendsListPage;
