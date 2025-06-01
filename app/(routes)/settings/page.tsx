// app/(routes)/settings/page.tsx
// NO 'use client' at the top of THIS file. This file is a Server Component.

import type { Metadata } from 'next';
import BasicPageProvider from "@/components/providers/basic-page-provider";
// Adjust these paths based on your actual project structure for Header and Footer
import Header from "../components/header";
import Footer from "../components/footer";
import Body from './body'; // Import the Body component from the co-located file

// --- Metadata for the Settings Page (Server Component part) ---
export const metadata: Metadata = {
  title: 'Account Settings', // Will become "Account Settings | CiRQL" due to RootLayout template
  description: 'Manage your CiRQL account settings, notifications, privacy, and data preferences.',
};

// --- Main Page Component (Server Component part) ---
export default function SettingsPage() {
  return (
    <BasicPageProvider
      header={<Header />}
      footer={<Footer />}
    >
      {/* Render the Body component which is the Client Component UI */}
      <Body />
    </BasicPageProvider>
  );
}