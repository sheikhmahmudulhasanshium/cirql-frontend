'use client';

import BasicPageProvider from "@/components/providers/basic-page-provider";
import Header from "../../components/header";
import Footer from "../../components/footer";
import BasicBodyProvider from "@/components/providers/basic-body-provider";
import { SentFriendRequestList } from "./body";

const SentRequestsPage = () => {
  return (
    <BasicPageProvider header={<Header />} footer={<Footer />}>
      <BasicBodyProvider>
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Sent Friend Requests</h1>
          <SentFriendRequestList />
        </div>
      </BasicBodyProvider>
    </BasicPageProvider>
  );
};

export default SentRequestsPage;
