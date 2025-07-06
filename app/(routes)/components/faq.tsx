'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const faqData = [
  {
    emoji: "💰",
    question: "Is CiRQL free to use?",
    answer: (
      <>
        Yes! CiRQL is currently in its beta phase and is completely free to use. 
        We are focused on building the best core experience for our community. For the latest updates, please check out the <Link href="/announcements" className="text-primary underline hover:text-primary/80">Announcements page</Link>.
      </>
    )
  },
  {
    emoji: "🛠️",
    question: "How do I get help or report a bug?",
    answer: (
      <>
        We value your feedback! The best way to securely contact our team is by visiting the <Link href="/contacts" className="text-primary underline hover:text-primary/80">Contacts page</Link> to create a support ticket. This ensures your message is tracked and addressed properly.
      </>
    )
  },
  {
    emoji: "🎨",
    question: "Can I customize my experience?",
    answer: (
      <>
        Yes, our Settings page is growing! You can currently customize your theme (light/dark), date and time formats, and other display preferences. We&apos;re adding more options all the time. <Link href="/settings" passHref><Button variant="link" className="p-0 h-auto">Visit your Settings</Button></Link> to personalize your view.
      </>
    )
  },
  {
    emoji: "🛡️",
    question: "How is my account kept secure?",
    answer: (
      <>
        Your security is our top priority. We secure accounts with robust password hashing and offer email-based Two-Factor Authentication (2FA) for an extra layer of protection. You can enable 2FA in your <Link href="/settings" className="text-primary underline hover:text-primary/80">account settings</Link>.
      </>
    )
  },
  {
    emoji: "🔒",
    question: "Does CiRQL sell my data?",
    answer: (
      <>
        Absolutely not. Our platform is built on privacy. We do not sell your personal data or track your activity across other websites. Your information is used solely to provide and improve the CiRQL service.
      </>
    )
  },
  {
    emoji: "🚀",
    question: "What happens when I log in?",
    answer: (
      <>
        To provide a seamless experience, the application will automatically take you back to the last page you were on. You can also see a &lsquo;Quick Access&rsquo; list of your most visited pages on your dashboard for easy navigation.
      </>
    )
  },
  {
    emoji: "👀",
    question: "Who can see my profile?",
    answer: (
      <>
        By default, your basic profile is visible to other users in public directories. However, you can make your account private at any time in your <Link href="/settings" className="text-primary underline hover:text-primary/80">Account Settings</Link>, which will remove you from public listings.
      </>
    )
  },
  {
    emoji: "🧪",
    question: "What is the &lsquo;Tester&rsquo; role?",
    answer: (
      <>
        The &lsquo;Tester&rsquo; role is assigned to users who help us test new features. Testers have access to a special dashboard with tools for viewing their submitted bug reports and providing detailed feedback, helping us build a better platform for everyone.
      </>
    )
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Default first item to be open

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full px-4 py-12 max-w-4xl mx-auto">
      <h2 className="font-bold mb-8 text-center text-3xl font-geistSans lg:text-6xl md:text-4xl sm:text-3xl bg-gradient-to-tl from-slate-500 to-yellow-100 dark:from-blue-500 dark:to-cyan-300 text-transparent bg-clip-text py-4 animate-accordion-down">
        Frequently Asked Questions
      </h2>

      <div className="border-t">
        {faqData.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="border-b">
              <button
                onClick={() => handleToggle(index)}
                className="flex justify-between items-start w-full py-5 text-left gap-4"
                aria-expanded={isOpen}
              >
                <span className="text-2xl pt-1">{faq.emoji}</span>
                <span className="flex-1 text-lg font-medium text-start">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    "h-6 w-6 text-muted-foreground transition-transform duration-300 flex-shrink-0 mt-1",
                    isOpen ? "rotate-180" : ""
                  )}
                />
              </button>
              
              <div
                className={cn(
                  "grid transition-all duration-300 ease-in-out",
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <div className="pl-[calc(1.5rem+1rem)] pr-4 pb-5 text-lg text-muted-foreground text-start">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQ;