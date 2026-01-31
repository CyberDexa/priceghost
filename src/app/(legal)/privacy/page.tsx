import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'PriceGhost Privacy Policy - Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <article className="prose prose-gray max-w-none">
      <h1>Privacy Policy</h1>
      <p className="text-gray-500 text-sm">Last updated: January 31, 2026</p>
      
      <h2>1. Introduction</h2>
      <p>
        At PriceGhost, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
        disclose, and safeguard your information when you use our price tracking service.
      </p>

      <h2>2. Information We Collect</h2>
      
      <h3>2.1 Information You Provide</h3>
      <ul>
        <li><strong>Account Information:</strong> Email address and password when you create an account</li>
        <li><strong>Product URLs:</strong> Links to products you want to track</li>
        <li><strong>Alert Preferences:</strong> Your notification settings and price thresholds</li>
        <li><strong>Communication:</strong> Any messages or feedback you send to us</li>
      </ul>

      <h3>2.2 Information Collected Automatically</h3>
      <ul>
        <li><strong>Usage Data:</strong> How you interact with the Service, features used, pages visited</li>
        <li><strong>Device Information:</strong> Browser type, operating system, device identifiers</li>
        <li><strong>Log Data:</strong> IP address, access times, referring URLs</li>
        <li><strong>Cookies:</strong> Session and preference cookies for functionality</li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <p>We use the collected information to:</p>
      <ul>
        <li>Provide and maintain the Service</li>
        <li>Send price drop alerts and notifications</li>
        <li>Track product prices on your behalf</li>
        <li>Improve and personalize your experience</li>
        <li>Send service-related communications</li>
        <li>Detect and prevent fraud or abuse</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2>4. Information Sharing</h2>
      <p>We do not sell your personal information. We may share your information with:</p>
      <ul>
        <li><strong>Service Providers:</strong> Third-party services that help us operate (e.g., email delivery, hosting)</li>
        <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
        <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
      </ul>

      <h3>4.1 Third-Party Services We Use</h3>
      <ul>
        <li><strong>Supabase:</strong> Database and authentication</li>
        <li><strong>Resend:</strong> Email delivery</li>
        <li><strong>Vercel:</strong> Hosting and analytics</li>
      </ul>

      <h2>5. Data Security</h2>
      <p>
        We implement appropriate technical and organizational measures to protect your information, including:
      </p>
      <ul>
        <li>Encryption of data in transit (HTTPS)</li>
        <li>Secure password hashing</li>
        <li>Regular security audits</li>
        <li>Access controls and authentication</li>
      </ul>
      <p>
        However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
      </p>

      <h2>6. Data Retention</h2>
      <p>
        We retain your information for as long as your account is active or as needed to provide the Service. 
        You can request deletion of your account and data at any time.
      </p>

      <h2>7. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li><strong>Access:</strong> Request a copy of your personal data</li>
        <li><strong>Correction:</strong> Update or correct inaccurate information</li>
        <li><strong>Deletion:</strong> Request deletion of your account and data</li>
        <li><strong>Export:</strong> Export your tracked products and data</li>
        <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
      </ul>

      <h2>8. Cookies and Tracking</h2>
      <p>
        We use essential cookies to maintain your session and remember your preferences. 
        We do not use third-party tracking cookies for advertising purposes.
      </p>

      <h2>9. Children&apos;s Privacy</h2>
      <p>
        The Service is not intended for children under 13 years of age. We do not knowingly collect 
        personal information from children under 13.
      </p>

      <h2>10. International Data Transfers</h2>
      <p>
        Your information may be transferred to and processed in countries other than your country of residence. 
        We ensure appropriate safeguards are in place to protect your information.
      </p>

      <h2>11. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
        the new policy on this page and updating the &quot;Last updated&quot; date.
      </p>

      <h2>12. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy or your data, please contact us at:
      </p>
      <ul>
        <li>Email: privacy@priceghost.app</li>
      </ul>
    </article>
  );
}
