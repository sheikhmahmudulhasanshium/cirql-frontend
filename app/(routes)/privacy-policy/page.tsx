import BasicPageProvider from "@/components/providers/basic-page-provider";
import Header from "@/app/(routes)/components/header-sign-out"; // Adjust path if necessary
import Footer from "@/app/(routes)/components/footer";           // Adjust path if necessary
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - CiRQL',
  description: 'Read the CiRQL Privacy Policy to understand how we collect, use, and protect your personal information when you use our services, including information about cookies and authentication tokens.',
 // robots: 'noindex, follow', // Good practice for legal pages not to be primary SEO targets
};

export default function PrivacyPolicyPage() {
  return (
    <BasicPageProvider
      header={<Header />}
      footer={<Footer />}
    >
      <div className="container mx-auto px-4 py-8 prose lg:prose-xl"> {/* Using Tailwind CSS prose for styling */}
        <h1>Privacy Policy for CiRQL</h1>
        <p><strong>Last Updated: 22 JUNE 2025</strong></p>

        {/* Line 22 from error report */}
        <p>Welcome to CiRQL (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), accessible at https://cirql.vercel.app/ . We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at contact.cirql@gmail.com.</p>

        <p>This Privacy Policy governs the privacy policies and practices of our Website. Please read this Privacy Policy carefully. By using our Website, you agree to the terms of this Privacy Policy.</p>

        <h2>1. INFORMATION WE COLLECT</h2>
        <p>We collect personal information that you voluntarily provide to us when you register on the Website, express an interest in obtaining information about us or our products and services, when you participate in activities on the Website or otherwise when you contact us.</p>
        <p>The personal information that we collect depends on the context of your interactions with us and the Website, the choices you make and the products and features you use. The personal information we collect may include the following:</p>
        <ul>
            <li><strong>Personal Information Provided by You:</strong> We may collect names; email addresses; usernames; passwords; contact preferences; contact or authentication data; and other similar information.</li>
            <li><strong>Usage Data:</strong> We may automatically collect information when you access and use the Website. This information may include your IP address, browser type, operating system, referring URLs, device information, pages viewed, and the dates/times of your visits.</li>
            <li>
                <strong>Information collected through Cookies and Similar Technologies:</strong> We use cookies and similar tracking technologies (like web beacons and pixels) to access or store information.
                <ul>
                    <li><strong>Google Tag Manager (GTM):</strong> We use Google Tag Manager to manage and deploy marketing tags (snippets of code or tracking pixels) on our website. GTM itself does not collect personal data but helps us manage other tags that might.</li>
                    {/* Line 36 from error report */}
                    <li><strong>Google Analytics (GA):</strong> We use Google Analytics to collect information about your use of the Website. Google Analytics collects information such as how often users visit the Website, what pages they visit when they do so, and what other sites they used prior to coming to the Website. We use the information we get from Google Analytics only to improve the Website. Google Analytics collects only the IP address assigned to you on the date you visit the Website, rather than your name or other identifying information. We do not combine the information collected through the use of Google Analytics with personally identifiable information. Google&apos;s ability to use and share information collected by Google Analytics about your visits to this site is restricted by the Google Analytics Terms of Use and the Google Privacy Policy. You can prevent Google Analytics from recognizing you on return visits to this site by disabling cookies on your browser.</li>
                    <li>
                        <strong>Authentication and Session Cookies/Tokens:</strong> To provide a secure and functional experience, we use essential cookies or tokens (e.g., JSON Web Tokens) when you log into our Service. These are necessary to:
                        <ul>
                            <li>Authenticate your identity and grant you access to your account.</li>
                            {/* Line 41 from error report */}
                            <li>Maintain your session while you are logged in, so you don&apos;t have to re-enter your credentials on every page.</li>
                            <li>Enhance the security of your account and our platform.</li>
                        </ul>
                        These cookies/tokens are strictly necessary for the operation of the authenticated parts of our Service and cannot be disabled if you wish to use these features. They are typically session-based or have a defined expiry to maintain your logged-in state.
                    </li>
                </ul>
            </li>
            <li><strong>Information from Third-Party Services:</strong> If you choose to register or log in to our services using a third-party account (e.g., Google, [Your Auth Provider Name - e.g., Clerk, NextAuth.js with a provider, Auth0 - FILL IN]), we may receive certain profile information about you from that third party. The information we receive varies and depends on the third party and your privacy settings with that provider.</li>
        </ul>

        <h2>2. HOW WE USE YOUR INFORMATION</h2>
        <p>We use personal information collected via our Website for a variety of business purposes described below:</p>
        <ul>
            <li>To provide, operate, and maintain our Website and its services.</li>
            <li>To manage your account, including facilitating account creation and logon process, and provide you with customer support.</li>
            <li>To send you administrative information, such as changes to our terms, conditions, and policies.</li>
            <li>To analyze usage and trends to improve your experience with our Website.</li>
            <li>To detect, prevent, and address technical issues and security vulnerabilities.</li>
            <li>To comply with legal obligations.</li>
            <li>For other business purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Website, products, services, marketing and your experience.</li>
        </ul>

        <h2>3. HOW WE SHARE YOUR INFORMATION</h2>
        <p>We may share your information with third parties in the following situations:</p>
        <ul>
            <li><strong>With Service Providers:</strong> We may share your personal information with third-party vendors, service providers, contractors or agents who perform services for us or on our behalf and require access to such information to do that work (e.g., data analytics [Google Analytics], user authentication [[Your Auth Provider Name - FILL IN]], hosting [Vercel], email delivery, customer service, [mention other APIs if they process personal data, e.g., payment processors]).</li>
            <li><strong>For Legal Reasons:</strong> We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.</li>
            <li><strong>To Protect Rights:</strong> We may disclose your information where we believe it is necessary to investigate, prevent, or take action regarding potential violations of our policies, suspected fraud, situations involving potential threats to the safety of any person and illegal activities, or as evidence in litigation in which we are involved.</li>
            <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
        </ul>

        <h2>4. COOKIES AND TRACKING TECHNOLOGIES</h2>
        <p>We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.</p>
        <p>This includes strictly necessary cookies (or tokens stored in cookies/local storage) for authentication and session management, which are essential for you to log in and use secure areas of our Website. Without these, services you have asked for, like accessing your account, cannot be provided.</p>
        {/* Line 75 from error report */}
        <p>We also use cookies for analytics and other purposes as described in Section 1. You can instruct your browser to refuse all non-essential cookies or to indicate when a non-essential cookie is being sent. However, if you do not accept certain cookies, you may not be able to use some portions of our Service or some features may not function as intended. For more information on how to manage cookies, check your browser or device&apos;s settings.</p>
        <p>[Consider adding a more detailed section or a separate Cookie Policy page if your cookie usage is extensive or complex. Link it here if you do.]</p>

        <h2>5. DATA RETENTION</h2>
        <p>We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy (e.g., to maintain your account, provide services) or as required by law. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.</p>

        <h2>6. DATA SECURITY</h2>
        <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. This includes measures for data in transit and at rest. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security, and improperly collect, access, steal, or modify your information.</p>

        <h2>7. YOUR DATA PROTECTION RIGHTS</h2>
        <p>Depending on your location (e.g., if you are in the EEA, UK, California), you may have the following data protection rights:</p>
        <ul>
            <li>The right to access, update or delete the information we have on you.</li>
            <li>The right of rectification.</li>
            <li>The right to object to processing.</li>
            <li>The right of restriction of processing.</li>
            <li>The right to data portability.</li>
            <li>The right to withdraw consent at any time where we relied on your consent to process your personal information.</li>
        </ul>
        <p>To exercise these rights, please contact us at [Your Contact Email Address - FILL IN]. We will respond to your request in accordance with applicable data protection laws.</p>
        {/* Line 95 from error report */}
        <p>[If applicable, mention how users can manage their data directly, e.g., &quot;You may also be able to view and update some of your information directly within your account settings.&quot;]</p>

        {/* Line 97 from error report */}
        <h2>8. CHILDREN&apos;S PRIVACY</h2>
        <p>Our Service does not address anyone under the age of 13 (or 16 in some European jurisdictions, or other applicable age). We do not knowingly collect personally identifiable information from children under this age. If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.</p>

        <h2>9. LINKS TO OTHER WEBSITES</h2>
        {/* Line 101 from error report */}
        <p>Our Website may contain links to other websites that are not operated by us. If you click on a third party link, you will be directed to that third party&apos;s site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.</p>

        <h2>10. CHANGES TO THIS PRIVACY POLICY</h2>
        {/* Line 104 from error report */}
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date at the top of this Privacy Policy. We may also notify you through email or a prominent notice on our Service, prior to the change becoming effective.</p>
        <p>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>

        <h2>11. CONTACT US</h2>
        <p>If you have any questions about this Privacy Policy, please contact us:</p>
        <ul>
            <li>By email: contact.cirql@gmail.com</li>
            <li>By visiting this page on our website: <a href="/contacts">https://cirql.vercel.app/contacts</a></li>
            <li>[Optionally add: By mail: Your Physical Address if applicable]</li>
        </ul>
      </div>
    </BasicPageProvider>
  );
}