// app/(routes)/announcements/page.tsx
// This file is now a simple Server Component.

import { Metadata } from "next";
import Body from "./body";
// Metadata is safe here. This page doesn't import Header or Footer anymore.
export const metadata: Metadata = {
  title: '📢 Announcements',
  description: 'Stay tuned for updates and announcements from the CiRQL team!',
};

// This page now only needs to render the client-side list.
// The Header, Footer, and BasicPageProvider are handled by the new layout.tsx.
export default function AnnouncementsPage() {
    return <Body />;
}