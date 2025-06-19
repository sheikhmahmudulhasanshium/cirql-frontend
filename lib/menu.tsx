

// @/lib/menu.tsx

import { BellIcon, HomeIcon, MessageSquareIcon, PhoneIcon,  } from "lucide-react";
import { NavMenu } from "./types";


export const navbarMenu: NavMenu[] = [
    { href: '/home', label: 'Home', icon: <HomeIcon /> },
    { href: '/chats', label: 'Chats', icon: <MessageSquareIcon /> },
    { href: '/calls', label: 'Calls', icon: <PhoneIcon /> },

    { href: '/notifications', label: 'Notifications', icon: <BellIcon /> },

   // { href: '/settings', label: 'Settings', icon: <SettingsIcon /> },
];


export const footerLinks = [
        { href: "/about", label: "About" },
        { href: "/faq", label: "FAQs" },
        { href: "/terms-and-conditions", label: "Terms & Conditions" },
        { href: "/privacy-policy", label: "Privacy Policy" },
        { href: "/sitemap.xml", label: "Sitemap" },
        { href:"/contacts", label: "Contacts"}
    ];
