# <img src='https://raw.githubusercontent.com/sheikhmahmudulhasanshium/cirql-frontend/main/public/logo-full.svg' alt='Cirql Logo' width='120' style='vertical-align: middle;' /> - Cirql Frontend: Stay In the Loop.

Cirql is a modern social media and communication platform designed for Gen Z, millennials, creators, and tech-savvy professionals to connect and stay informed. It aims to be a friendly, trustworthy, and tech-forward space, offering a user experience that's clean, minimal, and intuitive.

This project is the frontend for Cirql, bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

**Live Frontend:** [https://cirql.vercel.app/](https://cirql.vercel.app/)
**Backend Repository:** [cirql-backend](https://github.com/sheikhmahmudulhasanshium/cirql-backend/)

## Core Concepts

The development of Cirql is guided by the following principles:

*   **Connection & Community:** Facilitating seamless user connections and the formation of 'loops' or groups for shared interests and discussions.
*   **Modern & Minimal UI/UX:** A clean, intuitive interface that is both aesthetically pleasing and easy to navigate, leveraging modern UI components.
*   **Trust & Presence:** Building a trustworthy platform where users feel connected and aware of their network's activity.

## Tech Stack & Key Features

*   **Framework:** [Next.js](https://nextjs.org) (App Router)
*   **Language:** TypeScript
*   **UI Components:** [shadcn/ui](https://ui.shadcn.com/) - A collection of re-usable UI components.
*   **Styling:** Tailwind CSS
*   **Font:** [Geist](https://vercel.com/font) (via `next/font`)
*   **State Management:** React Context API for:
    *   Authentication (`AuthContext`)
    *   User Settings (`SettingsContext`)
    *   Notifications (`NotificationContext`)
*   **API Communication:** Axios (via a configured `lib/apiClient.ts` instance with interceptors)
*   **Authentication:**
    *   Integrates with the Cirql Backend for Google OAuth 2.0 and email-based 2FA.
    *   Handles JWTs for session management with a robust silent token refresh strategy planned to ensure long-lived, secure user sessions.
    *   Secure client-side token storage in `localStorage`.
*   **Key User-Facing Features:**
    *   **Smart Navigation:** Automatically resumes a user's session on their last visited page and provides a "Quick Access" panel of their most visited pages.
    *   **Dedicated Tester Panel:** A unique dashboard for users with the `Tester` role, featuring infographics and tools for submitting structured bug reports.
    *   **Full Personalization:** Users can control themes, date/time formats, fonts, and more via a comprehensive Settings page.
    *   **Activity & Analytics:** Users can view their own activity logs, and Admins have access to a system-wide analytics dashboard.
*   **Analytics:** Google Analytics & Google Tag Manager integration.

## Environment Variables

Create a `.env.local` file in the root of the project for local development. For production, these variables should be set in your Vercel project settings.

**Local Development (`.env.local`):**
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

# Optional, for local analytics testing if needed
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-YOUR_GA_ID_FOR_DEV
NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=GTM-YOUR_GTM_ID_FOR_DEV