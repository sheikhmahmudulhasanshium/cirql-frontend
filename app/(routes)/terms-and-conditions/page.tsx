import BasicPageProvider from "@/components/providers/basic-page-provider";
import Header from "@/app/(routes)/components/header-sign-out"; // Adjust path if necessary
import Footer from "@/app/(routes)/components/footer";           // Adjust path if necessary
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions - CiRQL',
  description: 'Please read the CiRQL Terms and Conditions carefully before using our services. Your access and use is conditioned on your acceptance of these terms.',
  robots: 'noindex, follow', // Good practice for legal pages
};

export default function TermsAndConditionsPage() {
  return (
    <BasicPageProvider
      header={<Header />}
      footer={<Footer />}
    >
      <div className="container mx-auto px-4 py-8 prose lg:prose-xl"> {/* Using Tailwind CSS prose for styling */}
        <h1>Terms and Conditions for CiRQL</h1>
        <p><strong>Last Updated: [Date - MAKE SURE TO FILL THIS IN]</strong></p>

        {/* Line 22 from error report */}
        <p>Please read these Terms and Conditions (&quot;Terms&quot;, &quot;Terms and Conditions&quot;) carefully before using the https://cirql.vercel.app/ (or your actual domain) website (the &quot;Service&quot;) operated by [Your Company Name/Your Name - FILL IN, e.g., &quot;CiRQL&quot; or &quot;Your Legal Entity Name&quot;] (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;).</p>
        <p>Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.</p>
        <p><strong>By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.</strong></p>

        <h2>1. ACCOUNTS</h2>
        <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
        <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service (e.g., if using social logins). You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>
        <p>You may not use as a username the name of another person or entity or that is not lawfully available for use, a name or trademark that is subject to any rights of another person or entity other than you without appropriate authorization, or a name that is otherwise offensive, vulgar or obscene.</p>

        <h2>2. INTELLECTUAL PROPERTY</h2>
        <p>The Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of [Your Company Name/Your Name - FILL IN] and its licensors. The Service is protected by copyright, trademark, and other laws of both [Your Country - FILL IN] and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of [Your Company Name/Your Name - FILL IN].</p>

        {/* User-Generated Content section (assuming it was uncommented for linting) */}
        {/* Error for line 36 (actual line 37 here) */}
        <h2>2A. USER-GENERATED CONTENT</h2>
        <p>Our Service may allow you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material (&quot;Content&quot;). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.</p>
        <p>By posting Content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service. You retain any and all of your rights to any Content you submit, post or display on or through the Service and you are responsible for protecting those rights. You agree that this license includes the right for us to make your Content available to other users of the Service, who may also use your Content subject to these Terms.</p>
        <p>You represent and warrant that: (i) the Content is yours (you own it) or you have the right to use it and grant us the rights and license as provided in these Terms, and (ii) the posting of your Content on or through the Service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person.</p>
        <p>We reserve the right to terminate the account of anyone found to be infringing on a copyright or other intellectual property rights.</p>
        <p>We reserve the right, but not the obligation, to monitor and edit all Content provided by users.</p>


        <h2>3. USE OF THE SERVICE / ACCEPTABLE USE</h2>
        <p>You agree not to use the Service:</p>
        <ul>
            <li>In any way that violates any applicable national or international law or regulation.</li>
            <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way by exposing them to inappropriate content or otherwise.</li>
            <li>To send, knowingly receive, upload, download, use, or re-use any material which does not comply with any content standards we may set out. [If you have content standards, link or describe them].</li>
            {/* Error for line 49 (actual line 48 here) */}
            <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent, including any &quot;junk mail,&quot; &quot;chain letter,&quot; &quot;spam,&quot; or any other similar solicitation.</li>
            <li>To impersonate or attempt to impersonate [Your Company Name/Your Name - FILL IN], a [Your Company Name/Your Name - FILL IN] employee, another user, or any other person or entity.</li>
            <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful, or in connection with any unlawful, illegal, fraudulent, or harmful purpose or activity.</li>
            {/* Error for line 52 (actual line 51 here) */}
            <li>To engage in any other conduct that restricts or inhibits anyone&apos;s use or enjoyment of the Service, or which, as determined by us, may harm or offend [Your Company Name/Your Name - FILL IN] or users of the Service or expose them to liability.</li>
        </ul>
        <p>Additionally, you agree not to:</p>
        <ul>
            {/* Error for line 56 (actual line 55 here) */}
            <li>Use the Service in any manner that could disable, overburden, damage, or impair the Service or interfere with any other party&apos;s use of the Service, including their ability to engage in real time activities through the Service.</li>
            <li>Use any robot, spider, or other automatic device, process, or means to access the Service for any purpose, including monitoring or copying any of the material on the Service.</li>
            <li>Use any manual process to monitor or copy any of the material on the Service or for any other unauthorized purpose without our prior written consent.</li>
            <li>Use any device, software, or routine that interferes with the proper working of the Service.</li>
            <li>Introduce any viruses, trojan horses, worms, logic bombs, or other material which is malicious or technologically harmful.</li>
            <li>Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Service, the server on which the Service is stored, or any server, computer, or database connected to the Service.</li>
            <li>Attack the Service via a denial-of-service attack or a distributed denial-of-service attack.</li>
            <li>Otherwise attempt to interfere with the proper working of the Service.</li>
        </ul>

        {/* Error for line 75 (actual line 65 here) - NOTE: No quotes found in provided text for this line. */}
        <h2>4. THIRD-PARTY SERVICES AND APIS</h2>
        <p>Our Service may utilize or integrate with third-party services, APIs (such as Google services for analytics and/or authentication, [Your Auth Provider Name - e.g., Clerk, NextAuth.js, Auth0 - FILL IN], [Other APIs you use - FILL IN]), and may contain links to third-party web sites or services that are not owned or controlled by [Your Company Name/Your Name - FILL IN].</p>
        <p>[Your Company Name/Your Name - FILL IN] has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that [Your Company Name/Your Name - FILL IN] shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.</p>
        <p>We strongly advise you to read the terms and conditions and privacy policies of any third-party web sites or services that you visit or utilize.</p>

        <h2>5. TERMINATION</h2>
        <p>We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.</p>
        {/* Error for line 79 (actual line 76 here) */}
        <p>If you wish to terminate your account, you may simply discontinue using the Service [or specify how users can delete their account if applicable - e.g., &quot;by contacting us at [Your Contact Email - FILL IN]&quot; or &quot;through your account settings page&quot;].</p>
        <p>All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.</p>

        <h2>6. DISCLAIMER OF WARRANTIES</h2>
        <p>THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS. [Your Company Name/Your Name - FILL IN] MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THEIR SERVICES, OR THE INFORMATION, CONTENT OR MATERIALS INCLUDED THEREIN. YOU EXPRESSLY AGREE THAT YOUR USE OF THE SERVICE, ITS CONTENT, AND ANY SERVICES OR ITEMS OBTAINED FROM US IS AT YOUR SOLE RISK.</p>
        <p>NEITHER [Your Company Name/Your Name - FILL IN] NOR ANY PERSON ASSOCIATED WITH [Your Company Name/Your Name - FILL IN] MAKES ANY WARRANTY OR REPRESENTATION WITH RESPECT TO THE COMPLETENESS, SECURITY, RELIABILITY, QUALITY, ACCURACY, OR AVAILABILITY OF THE SERVICES. WITHOUT LIMITING THE FOREGOING, NEITHER [Your Company Name/Your Name - FILL IN] NOR ANYONE ASSOCIATED WITH [Your Company Name/Your Name - FILL IN] REPRESENTS OR WARRANTS THAT THE SERVICES, THEIR CONTENT, OR ANY SERVICES OR ITEMS OBTAINED THROUGH THE SERVICES WILL BE ACCURATE, RELIABLE, ERROR-FREE, OR UNINTERRUPTED, THAT DEFECTS WILL BE CORRECTED, THAT THE SERVICES OR THE SERVER THAT MAKES THEM AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS OR THAT THE SERVICES OR ANY SERVICES OR ITEMS OBTAINED THROUGH THE SERVICES WILL OTHERWISE MEET YOUR NEEDS OR EXPECTATIONS.</p>
        <p>[Your Company Name/Your Name - FILL IN] HEREBY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT, AND FITNESS FOR PARTICULAR PURPOSE.</p>
        <p>THE FOREGOING DOES NOT AFFECT ANY WARRANTIES WHICH CANNOT BE EXCLUDED OR LIMITED UNDER APPLICABLE LAW.</p>

        <h2>7. LIMITATION OF LIABILITY</h2>
        {/* Error for line 85 (actual line 86 here) */}
        <p>EXCEPT AS PROHIBITED BY LAW, YOU WILL HOLD US AND OUR OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS HARMLESS FOR ANY INDIRECT, PUNITIVE, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGE, HOWEVER IT ARISES (INCLUDING ATTORNEYS&apos; FEES AND ALL RELATED COSTS AND EXPENSES OF LITIGATION AND ARBITRATION, OR AT TRIAL OR ON APPEAL, IF ANY, WHETHER OR NOT LITIGATION OR ARBITRATION IS INSTITUTED), WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE, OR OTHER TORTIOUS ACTION, OR ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT, INCLUDING WITHOUT LIMITATION ANY CLAIM FOR PERSONAL INJURY OR PROPERTY DAMAGE, ARISING FROM THIS AGREEMENT AND ANY VIOLATION BY YOU OF ANY FEDERAL, STATE, OR LOCAL LAWS, STATUTES, RULES, OR REGULATIONS, EVEN IF [Your Company Name/Your Name - FILL IN] HAS BEEN PREVIOUSLY ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. EXCEPT AS PROHIBITED BY LAW, IF THERE IS LIABILITY FOUND ON THE PART OF [Your Company Name/Your Name - FILL IN], IT WILL BE LIMITED TO THE AMOUNT PAID FOR THE PRODUCTS AND/OR SERVICES, AND UNDER NO CIRCUMSTANCES WILL THERE BE CONSEQUENTIAL OR PUNITIVE DAMAGES. SOME STATES DO NOT ALLOW THE EXCLUSION OR LIMITATION OF PUNITIVE, INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THE PRIOR LIMITATION OR EXCLUSION MAY NOT APPLY TO YOU.</p>

        <h2>8. INDEMNIFICATION</h2>
        {/* Error for line 88 (actual line 88 here) */}
        <p>You agree to defend, indemnify, and hold harmless [Your Company Name/Your Name - FILL IN] and its licensee and licensors, and their employees, contractors, agents, officers, and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney&apos;s fees), resulting from or arising out of a) your use and access of the Service, by you or any person using your account and password; b) a breach of these Terms, or c) Content posted on the Service.</p>

        <h2>9. GOVERNING LAW</h2>
        <p>These Terms shall be governed and construed in accordance with the laws of [Your Jurisdiction - e.g., State of California, USA / Your Country - FILL IN], without regard to its conflict of law provisions.</p>
        <p>Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service, and supersede and replace any prior agreements we might have had between us regarding the Service.</p>

        <h2>10. CHANGES TO TERMS</h2>
        {/* Error for line 95 (actual line 94 here) */}
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will make reasonable efforts to provide at least [e.g., 15 or 30] days&apos; notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
        <p>By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, in whole or in part, please stop using the website and the Service.</p>

        <h2>11. SEVERABILITY AND WAIVER</h2>
        <p><strong>Severability:</strong> If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.</p>
        {/* Error for line 100 (actual line 99 here) */}
        <p><strong>Waiver:</strong> Except as provided herein, the failure to exercise a right or to require performance of an obligation under these Terms shall not affect a party&apos;s ability to exercise such right or require such performance at any time thereafter nor shall the waiver of a breach constitute a waiver of any subsequent breach.</p>


        <h2>12. ENTIRE AGREEMENT</h2>
        <p>These Terms and our Privacy Policy constitute the entire agreement between you and [Your Company Name/Your Name - FILL IN] regarding your use of the Service and supersede all prior and contemporaneous written or oral agreements between you and [Your Company Name/Your Name - FILL IN].</p>
        <p>You may be subject to additional terms and conditions that apply when you use or purchase other services from us, which we will provide to you at that time.</p>

        <h2>13. CONTACT US</h2>
        <p>If you have any questions about these Terms, please contact us:</p>
        <ul>
            <li>By email: [Your Contact Email Address - FILL IN]</li>
            <li>By visiting this page on our website: <a href="/contacts">https://cirql.vercel.app/contacts</a> (or your actual contact page link)</li>
            <li>[Optionally add: By mail: Your Physical Address if applicable]</li>
        </ul>
      </div>
    </BasicPageProvider>
  );
}