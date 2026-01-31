import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'PriceGhost Terms of Service - Read our terms and conditions for using the price tracking service.',
};

export default function TermsPage() {
  return (
    <article className="prose prose-gray max-w-none">
      <h1>Terms of Service</h1>
      <p className="text-gray-500 text-sm">Last updated: January 31, 2026</p>
      
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing and using PriceGhost (&quot;the Service&quot;), you accept and agree to be bound by the terms 
        and provisions of this agreement. If you do not agree to abide by these terms, please do not use this Service.
      </p>

      <h2>2. Description of Service</h2>
      <p>
        PriceGhost provides a price tracking service that monitors product prices across various online retailers. 
        Users can add product URLs, set price alerts, and receive notifications when prices change. The Service 
        includes:
      </p>
      <ul>
        <li>Price monitoring and tracking</li>
        <li>Email notifications for price changes</li>
        <li>Price history charts and analytics</li>
        <li>Browser extension for easy product addition</li>
        <li>Export functionality for tracked products</li>
      </ul>

      <h2>3. User Accounts</h2>
      <p>
        To use certain features of the Service, you must register for an account. You agree to:
      </p>
      <ul>
        <li>Provide accurate and complete registration information</li>
        <li>Maintain the security of your password</li>
        <li>Promptly update any changes to your information</li>
        <li>Accept responsibility for all activities under your account</li>
      </ul>

      <h2>4. Acceptable Use</h2>
      <p>You agree not to use the Service to:</p>
      <ul>
        <li>Violate any applicable laws or regulations</li>
        <li>Infringe upon the rights of others</li>
        <li>Attempt to gain unauthorized access to the Service</li>
        <li>Interfere with the proper functioning of the Service</li>
        <li>Use automated systems to scrape or extract data beyond normal use</li>
        <li>Resell or commercially exploit the Service without authorization</li>
      </ul>

      <h2>5. Price Data Accuracy</h2>
      <p>
        While we strive to provide accurate price information, PriceGhost does not guarantee the accuracy, 
        completeness, or timeliness of price data. Prices displayed may differ from actual prices at retailers 
        due to various factors including:
      </p>
      <ul>
        <li>Timing delays in price updates</li>
        <li>Regional pricing variations</li>
        <li>Retailer website changes</li>
        <li>Technical limitations</li>
      </ul>
      <p>
        Always verify prices directly with the retailer before making a purchase.
      </p>

      <h2>6. Intellectual Property</h2>
      <p>
        The Service and its original content, features, and functionality are owned by PriceGhost and are 
        protected by international copyright, trademark, and other intellectual property laws.
      </p>

      <h2>7. Third-Party Links</h2>
      <p>
        The Service contains links to third-party websites (retailers). We are not responsible for the content, 
        privacy policies, or practices of these third-party sites.
      </p>

      <h2>8. Limitation of Liability</h2>
      <p>
        In no event shall PriceGhost be liable for any indirect, incidental, special, consequential, or 
        punitive damages, including but not limited to loss of profits, data, or other intangible losses 
        resulting from your use of the Service.
      </p>

      <h2>9. Service Modifications</h2>
      <p>
        We reserve the right to modify or discontinue the Service at any time, with or without notice. 
        We shall not be liable to you or any third party for any modification, suspension, or discontinuance 
        of the Service.
      </p>

      <h2>10. Changes to Terms</h2>
      <p>
        We may update these Terms from time to time. We will notify you of any changes by posting the new 
        Terms on this page and updating the &quot;Last updated&quot; date.
      </p>

      <h2>11. Contact Us</h2>
      <p>
        If you have any questions about these Terms, please contact us at:
      </p>
      <ul>
        <li>Email: support@priceghost.app</li>
      </ul>
    </article>
  );
}
