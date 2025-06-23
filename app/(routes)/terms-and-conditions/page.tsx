import BasicPageProvider from "@/components/providers/basic-page-provider";
import Header from "@/app/(routes)/components/header-sign-out"; // Adjust path if necessary
import Footer from "@/app/(routes)/components/footer";           // Adjust path if necessary
import type { Metadata } from 'next';
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Please read the CiRQL Terms and Conditions carefully before using our services. Your access and use is conditioned on your acceptance of these terms.',
 // robots: 'noindex, follow',
};

export default function TermsAndConditionsPage() {
  return (
    <BasicPageProvider
      header={<Header />}
      footer={<Footer />}
    >
      <div className="container mx-auto px-4 py-12 max-w-4xl prose dark:prose-invert">
        <h1>Terms and Conditions for CiRQL</h1>
        <p><strong>Last Updated: 22 JUNE 2025</strong></p>

        <p>Please read these Terms and Conditions (&ldquo;Terms&rdquo;, &ldquo;Terms and Conditions&rdquo;) carefully before using the https://cirql.vercel.app/ website (the &ldquo;Service&rdquo;) operated by CiRQL (&ldquo;us&rdquo;, &ldquo;we&rdquo;, or &ldquo;our&rdquo;).</p>
        <p>Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.</p>
        <p><strong>By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.</strong></p>

        <h2>1. ACCOUNTS</h2>
        <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
        <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>
        
        <h2>2. INTELLECTUAL PROPERTY & USER CONTENT</h2>
        <p>The Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of CiRQL and its licensors. Our trademarks may not be used in connection with any product or service without our prior written consent.</p>
        <p>Our Service may allow you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material (&ldquo;Content&rdquo;). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.</p>
        <p>By posting Content, you grant us the right and license to use, modify, display, and distribute such Content on and through the Service. You retain any and all of your rights to any Content you submit.</p>

        <h2>3. ACCEPTABLE USE</h2>
        <p>You agree not to use the Service:</p>
        <ul>
            <li>In any way that violates any applicable national or international law or regulation.</li>
            <li>To transmit, or procure the sending of, any advertising or promotional material, including any &ldquo;junk mail,&rdquo; &ldquo;chain letter,&rdquo; or &ldquo;spam.&rdquo;</li>
            <li>To impersonate or attempt to impersonate us, one of our employees, another user, or any other person or entity.</li>
            {/* FIX: Replaced ' with ' in "anyone's" */}
            <li>To engage in any other conduct that restricts or inhibits anyone&apos;s use or enjoyment of the Service, or which, as determined by us, may harm us or users of the Service.</li>
        </ul>
        <p>Additionally, you agree not to:</p>
        <ul>
            {/* FIX: Replaced ' with ' in "party's" */}
            <li>Use the Service in any manner that could disable, overburden, damage, or impair the Service or interfere with any other party&apos;s use of the Service.</li>
            <li>Use any robot, spider, or other automatic device to access the Service for any purpose.</li>
            <li>Introduce any viruses, trojan horses, worms, or other material which is malicious or technologically harmful.</li>
            <li>Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Service or its underlying infrastructure.</li>
        </ul>

        <h2>4. THIRD-PARTY SERVICES</h2>
        <p>Our Service may contain links to third-party web sites or services that are not owned or controlled by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party sites or services. We strongly advise you to read the terms and policies of any third-party sites you visit.</p>

        <h2>5. TERMINATION</h2>
        <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including if you breach the Terms.</p>
        {/* FIX: Replaced quotes inside the example text with " */}
        <p>If you wish to terminate your account, you may simply discontinue using the Service or specify how users can delete their account, for example, &ldquo;by contacting us at contact.cirql@gmail.com&rdquo; or &ldquo;through your account settings page.&rdquo;</p>

        <h2>6. DISCLAIMER OF WARRANTIES</h2>
        <p>THE SERVICE IS PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS. WE DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE.</p>

        <h2>7. LIMITATION OF LIABILITY</h2>
        {/* FIX: Replaced ' with ' in "ATTORNEYS'" */}
        <p>EXCEPT AS PROHIBITED BY LAW, YOU WILL HOLD US HARMLESS FOR ANY INDIRECT, PUNITIVE, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGE, HOWEVER IT ARISES (INCLUDING ATTORNEYS&apos; FEES), WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE, OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT.</p>

        <h2>8. INDEMNIFICATION</h2>
        {/* FIX: Replaced ' with ' in "attorney's" */}
        <p>You agree to defend, indemnify, and hold harmless us and our employees, contractors, and directors from and against any and all claims, damages, losses, and expenses (including but not limited to attorney&apos;s fees), resulting from or arising out of your use of the Service or your breach of these Terms.</p>

        <h2>9. GOVERNING LAW</h2>
        <p>These Terms shall be governed in accordance with the laws of [Your Jurisdiction - FILL IN], without regard to its conflict of law provisions.</p>
        
        <h2>10. CHANGES TO TERMS</h2>
        {/* FIX: Replaced ' with ' in "days'" */}
        <p>We reserve the right to modify or replace these Terms at any time. If a revision is material, we will make reasonable efforts to provide at least 30 days&apos; notice prior to any new terms taking effect.</p>

        <h2>11. SEVERABILITY AND WAIVER</h2>
        {/* FIX: Replaced ' with ' in "party's" */}
        <p><strong>Waiver:</strong> The failure to exercise a right or to require performance of an obligation under these Terms shall not affect a party&apos;s ability to exercise such right or require such performance at any time thereafter.</p>

        <h2>12. CONTACT US</h2>
        <p>If you have any questions about these Terms, please contact us:</p>
        <ul>
            {/* User's email details are preserved as requested */}
            <li>By email: contact.cirql@gmail.com</li>
            <li>By visiting this page on our website: <Link href="/contacts">https://cirql.vercel.app/contacts</Link></li>
        </ul>
      </div>
    </BasicPageProvider>
  );
}