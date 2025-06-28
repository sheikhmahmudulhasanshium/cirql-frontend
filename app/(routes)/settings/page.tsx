// src/app/(routes)/settings/page.tsx
import type { Metadata } from 'next';
import BasicPageProvider from "@/components/providers/basic-page-provider";
import Header from "@/app/(routes)/components/header";
import Footer from "@/app/(routes)/components/footer";
import Body from './body';
import { SettingsProvider } from '@/components/hooks/settings/get-settings';

export const metadata: Metadata = {
  title: 'Account Settings',
  description: 'Manage your CiRQL account settings, notifications, privacy, and data preferences.',
};

export default function SettingsPage() {
  return (
    <SettingsProvider>
      <BasicPageProvider
        header={<Header />}
        footer={<Footer />}
      >
        <Body />
      </BasicPageProvider>
    </SettingsProvider>
  );
}