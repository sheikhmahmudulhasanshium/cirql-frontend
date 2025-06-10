// This is a Server Component. It cannot use hooks.

import BasicPageProvider from "@/components/providers/basic-page-provider";
import Header from "../components/header";
import Footer from "../components/footer";
import type { Metadata } from 'next';
import Body from "./body";

// --- FIX: DELETE THIS IMPORT ---
// import { useGetMySettings } from "@/components/hooks/settings/get-settings";

export const metadata: Metadata = {
  title: 'Calls',
  description: 'See Call history from here',
};

export default function Calls() {
  // --- FIX: DELETE THIS HOOK CALL. It's not allowed in a Server Component. ---
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