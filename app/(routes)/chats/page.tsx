// This is a Server Component. It cannot use hooks.

import BasicPageProvider from "@/components/providers/basic-page-provider";
import Header from "../components/header";
import Footer from "../components/footer";
import type { Metadata } from 'next';
import Body from "./body";

// --- FIX: DELETE THIS IMPORT ---
// import { useGetMySettings } from "@/components/hooks/settings/get-settings";

export const metadata: Metadata = {
  title: 'Chats',
  description: 'Send personal messages from here.',
};

export default function Chats() {
  // --- FIX: DELETE THIS HOOK CALL ---
  // const {}=useGetMySettings()

  return (
    <BasicPageProvider
      header={<Header />}
      footer={<Footer />}
    >
      <Body />
    </BasicPageProvider>
  );
}