// This is a Server Component. It cannot use hooks.

import BasicPageProvider from "@/components/providers/basic-page-provider";
import Header from "../components/header";
import Footer from "../components/footer";
import type { Metadata } from 'next';

// --- FIX: DELETE THIS IMPORT ---
// import { useGetMySettings } from "@/components/hooks/settings/get-settings";

export const metadata: Metadata = {
  title: 'Welcome to the CiRQL Community!',
  description: 'Join CiRQL, your vibrant private community platform. Connect, share, and stay in the loop. This is the home page.',
};

export default function Home() {
  // --- FIX: DELETE THIS HOOK CALL ---
  // const {}=useGetMySettings()

  return (
    <BasicPageProvider
      header={<Header />}
      footer={<Footer />}
    >
      <div className="flex flex-col justify-center items-center text-center p-4 flex-grow">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Home Page!</h1>
        <p>The `AuthProvider` is now responsible for applying your settings globally.</p>
      </div>
    </BasicPageProvider>
  );
}