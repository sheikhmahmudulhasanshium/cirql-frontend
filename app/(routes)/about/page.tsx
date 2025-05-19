// ./app/(routes)/about/page.tsx

import BasicPageProvider from "@/components/providers/basic-page-provider";
import Header from "@/app/(routes)/components/header-sign-out";
import Footer from "@/app/(routes)/components/footer";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - CiRQL',
  description: 'Learn more about the CiRQL community, our mission, and what makes us unique. Join the conversation!',
};

export default function AboutPage() {
  return (
    <BasicPageProvider
      // NO title, description, or icon props here
      header={<Header />}
      footer={<Footer />}
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-center">About CiRQL</h1>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            At CiRQL, our mission is to foster genuine connections and build vibrant, private communities.
            We believe in the power of focused groups and seamless communication to help people stay in the loop
            with what matters most to them.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">What is CiRQL?</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            CiRQL is a modern platform designed for creating and managing private group networks.
            Whether it&apos;s for your hobbies, professional circles, study groups, or family and friends,
            CiRQL provides a dedicated, secure space. We offer:
          </p>
          <ul className="list-disc list-inside mt-2 text-lg text-gray-700 dark:text-gray-300">
            <li>Secure Voice Channels: Connect with clear, reliable voice chat.</li>
            <li>Dynamic Text Chat: Engage in real-time messaging with rich features.</li>
            <li>Dedicated Groups: Organize conversations and communities effortlessly.</li>
            <li>Privacy Focused: Your groups are your own, free from the noise of public platforms.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">Join Us</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Ready to create your own private space or join an existing one? CiRQL is continuously evolving,
            and we&apos;re excited to have you be a part of our journey. Stay connected, stay informed, stay in the loop with CiRQL.
          </p>
        </section>
      </div>
    </BasicPageProvider>
  );
}