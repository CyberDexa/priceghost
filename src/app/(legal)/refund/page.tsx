import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'PriceGhost Refund Policy - Our policy on refunds and cancellations for paid subscriptions.',
};

export default function RefundPage() {
  return (
    <article className="prose prose-gray max-w-none">
      <h1>Refund Policy</h1>
      <p className="text-gray-500 text-sm">Last updated: January 31, 2026</p>
      
      <h2>1. Free Tier</h2>
      <p>
        PriceGhost offers a free tier with basic features. No payment is required for the free tier, 
        therefore no refunds are applicable.
      </p>

      <h2>2. Paid Subscriptions</h2>
      <p>
        For paid subscriptions (when available), we offer the following refund policy:
      </p>

      <h3>2.1 Monthly Subscriptions</h3>
      <ul>
        <li>You may request a full refund within 7 days of your initial subscription</li>
        <li>After 7 days, refunds are prorated based on unused time</li>
        <li>You may cancel anytime; your subscription continues until the end of the billing period</li>
      </ul>

      <h3>2.2 Annual Subscriptions</h3>
      <ul>
        <li>Full refund available within 14 days of purchase</li>
        <li>After 14 days, prorated refunds may be available on a case-by-case basis</li>
        <li>No refunds for annual subscriptions after 30 days</li>
      </ul>

      <h2>3. How to Request a Refund</h2>
      <p>To request a refund:</p>
      <ol>
        <li>Email us at support@priceghost.app</li>
        <li>Include your account email address</li>
        <li>Provide your reason for requesting a refund</li>
        <li>We will respond within 2-3 business days</li>
      </ol>

      <h2>4. Refund Processing</h2>
      <p>
        Approved refunds will be processed within 5-10 business days. Refunds are issued to the 
        original payment method.
      </p>

      <h2>5. Exceptions</h2>
      <p>Refunds may not be available in the following cases:</p>
      <ul>
        <li>Violation of our Terms of Service</li>
        <li>Fraudulent use of the Service</li>
        <li>Chargebacks or payment disputes in progress</li>
      </ul>

      <h2>6. Cancellation</h2>
      <p>
        You can cancel your subscription at any time from your account settings. Upon cancellation:
      </p>
      <ul>
        <li>Your subscription remains active until the end of the current billing period</li>
        <li>You will not be charged for the next billing period</li>
        <li>Your tracked products and data remain accessible until the subscription ends</li>
        <li>After subscription ends, your account reverts to the free tier</li>
      </ul>

      <h2>7. Service Credits</h2>
      <p>
        In some cases, we may offer service credits instead of refunds. Service credits can be 
        used toward future subscription payments.
      </p>

      <h2>8. Changes to This Policy</h2>
      <p>
        We reserve the right to modify this refund policy at any time. Changes will not affect 
        refund requests made before the policy change.
      </p>

      <h2>9. Contact Us</h2>
      <p>
        For refund-related questions or requests, please contact us at:
      </p>
      <ul>
        <li>Email: support@priceghost.app</li>
      </ul>
    </article>
  );
}
