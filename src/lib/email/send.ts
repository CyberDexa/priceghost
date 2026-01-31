import { Resend } from "resend";
import {
  generateEmailWrapper,
  generateHeader,
  generateFooter,
  generateProductCard,
  generateStatsBar,
  emailStyles,
} from "./templates";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = "PriceGhost <alerts@priceghost.app>";

// ============================================
// PRICE DROP EMAIL
// ============================================

interface PriceDropEmailProps {
  to: string;
  productName: string;
  productUrl: string;
  oldPrice: number;
  newPrice: number;
  imageUrl?: string;
}

export async function sendPriceDropEmail({
  to,
  productName,
  productUrl,
  oldPrice,
  newPrice,
  imageUrl,
}: PriceDropEmailProps) {
  if (!resend) {
    console.log("Resend not configured, skipping email");
    return { success: false, error: "Email service not configured" };
  }

  const savings = oldPrice - newPrice;
  const percentOff = (savings / oldPrice) * 100;

  const content = `
    ${generateHeader()}
    
    <div style="
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      margin-bottom: 24px;
    ">
      <p style="font-size: 14px; color: #059669; margin: 0 0 8px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
        🎉 PRICE DROP ALERT
      </p>
      <p style="font-size: 36px; font-weight: bold; color: #047857; margin: 0;">
        Save $${savings.toFixed(2)}
      </p>
      <p style="font-size: 16px; color: #059669; margin: 8px 0 0 0;">
        That's ${percentOff.toFixed(0)}% off!
      </p>
    </div>
    
    ${generateProductCard({
      name: productName,
      url: productUrl,
      imageUrl,
      currentPrice: newPrice,
      previousPrice: oldPrice,
      savings,
      percentOff,
    }, true)}
    
    <div style="text-align: center; margin: 24px 0;">
      <a href="${productUrl}" style="${emailStyles.button}">
        View Deal Now →
      </a>
    </div>
    
    <p style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 24px;">
      ⏰ Prices can change quickly. Don't miss out!
    </p>
    
    ${generateFooter()}
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `🎉 Price Drop: Save $${savings.toFixed(2)} on ${productName.slice(0, 40)}...`,
      html: generateEmailWrapper(content, `Save $${savings.toFixed(2)} (${percentOff.toFixed(0)}% off) on ${productName}`),
    });

    if (error) {
      console.error("Failed to send email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}

// ============================================
// TARGET PRICE REACHED EMAIL
// ============================================

interface TargetReachedEmailProps {
  to: string;
  productName: string;
  productUrl: string;
  targetPrice: number;
  currentPrice: number;
  imageUrl?: string;
}

export async function sendTargetReachedEmail({
  to,
  productName,
  productUrl,
  targetPrice,
  currentPrice,
  imageUrl,
}: TargetReachedEmailProps) {
  if (!resend) {
    console.log("Resend not configured, skipping email");
    return { success: false, error: "Email service not configured" };
  }

  const content = `
    ${generateHeader()}
    
    <div style="
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      margin-bottom: 24px;
    ">
      <p style="font-size: 14px; color: #2563eb; margin: 0 0 8px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
        🎯 TARGET PRICE REACHED
      </p>
      <p style="font-size: 28px; font-weight: bold; color: #1d4ed8; margin: 0;">
        Your target of $${targetPrice.toFixed(2)} has been hit!
      </p>
    </div>
    
    ${generateProductCard({
      name: productName,
      url: productUrl,
      imageUrl,
      currentPrice,
    }, true)}
    
    <div style="text-align: center; margin: 24px 0;">
      <a href="${productUrl}" style="
        display: inline-block;
        background: #2563eb;
        color: white;
        padding: 14px 28px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        font-size: 16px;
      ">
        Buy Now →
      </a>
    </div>
    
    <p style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 24px;">
      🎉 Congrats! You've been waiting for this price.
    </p>
    
    ${generateFooter()}
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `🎯 Target Price Reached: ${productName.slice(0, 40)}...`,
      html: generateEmailWrapper(content, `Your target price of $${targetPrice.toFixed(2)} has been reached!`),
    });

    if (error) {
      console.error("Failed to send email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}

// ============================================
// WEEKLY DIGEST EMAIL
// ============================================

interface WeeklyDigestProduct {
  name: string;
  url: string;
  imageUrl?: string;
  currentPrice: number;
  weekStartPrice: number;
  priceChange: number;
  percentChange: number;
}

interface WeeklyDigestEmailProps {
  to: string;
  userName?: string;
  totalProducts: number;
  totalSavings: number;
  priceDrops: WeeklyDigestProduct[];
  priceIncreases: WeeklyDigestProduct[];
  topDeal?: WeeklyDigestProduct;
}

export async function sendWeeklyDigestEmail({
  to,
  userName,
  totalProducts,
  totalSavings,
  priceDrops,
  priceIncreases,
  topDeal,
}: WeeklyDigestEmailProps) {
  if (!resend) {
    console.log("Resend not configured, skipping email");
    return { success: false, error: "Email service not configured" };
  }

  const greeting = userName ? `Hey ${userName}` : "Hey there";
  const weekDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const content = `
    ${generateHeader()}
    
    <h2 style="font-size: 20px; color: #1f2937; margin: 0 0 8px 0;">
      ${greeting}! 👋
    </h2>
    <p style="color: #6b7280; margin: 0 0 24px 0;">
      Here's your weekly price tracking summary for the week of ${weekDate}
    </p>
    
    ${generateStatsBar([
      { label: 'Products', value: totalProducts.toString(), color: '#3b82f6' },
      { label: 'Price Drops', value: priceDrops.length.toString(), color: '#10b981' },
      { label: 'Potential Savings', value: `$${totalSavings.toFixed(0)}`, color: '#10b981' },
    ])}
    
    ${topDeal ? `
      <div style="
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 24px;
        text-align: center;
      ">
        <p style="font-size: 12px; color: #92400e; margin: 0 0 8px 0; font-weight: 600; text-transform: uppercase;">
          🏆 DEAL OF THE WEEK
        </p>
        <h3 style="font-size: 16px; color: #1f2937; margin: 0 0 8px 0;">
          ${topDeal.name.slice(0, 50)}${topDeal.name.length > 50 ? '...' : ''}
        </h3>
        <p style="font-size: 24px; font-weight: bold; color: #047857; margin: 0;">
          Save $${Math.abs(topDeal.priceChange).toFixed(2)} (${Math.abs(topDeal.percentChange).toFixed(0)}% off)
        </p>
        <a href="${topDeal.url}" style="${emailStyles.button}; margin-top: 12px;">
          View Deal →
        </a>
      </div>
    ` : ''}
    
    ${priceDrops.length > 0 ? `
      <h3 style="font-size: 16px; color: #1f2937; margin: 24px 0 16px 0; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb;">
        📉 Price Drops This Week (${priceDrops.length})
      </h3>
      ${priceDrops.slice(0, 5).map(product => generateProductCard({
        name: product.name,
        url: product.url,
        imageUrl: product.imageUrl,
        currentPrice: product.currentPrice,
        previousPrice: product.weekStartPrice,
        savings: Math.abs(product.priceChange),
        percentOff: Math.abs(product.percentChange),
      })).join('')}
      ${priceDrops.length > 5 ? `
        <p style="text-align: center; color: #6b7280; font-size: 14px;">
          <a href="https://priceghost.app/price-drops" style="color: #10b981;">View all ${priceDrops.length} price drops →</a>
        </p>
      ` : ''}
    ` : `
      <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 16px; text-align: center;">
        <p style="color: #6b7280; margin: 0;">No price drops this week. We'll keep watching! 👀</p>
      </div>
    `}
    
    ${priceIncreases.length > 0 ? `
      <h3 style="font-size: 16px; color: #1f2937; margin: 24px 0 16px 0; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb;">
        📈 Prices Increased (${priceIncreases.length})
      </h3>
      <p style="color: #6b7280; font-size: 14px; margin-bottom: 16px;">
        These items went up in price. Glad you're tracking them!
      </p>
      ${priceIncreases.slice(0, 3).map(product => `
        <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
          <span style="font-size: 14px; color: #1f2937;">${product.name.slice(0, 50)}...</span>
          <span style="float: right; color: #dc2626; font-weight: 600;">
            +$${product.priceChange.toFixed(2)}
          </span>
        </div>
      `).join('')}
    ` : ''}
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="https://priceghost.app/dashboard" style="${emailStyles.button}">
        View Dashboard →
      </a>
    </div>
    
    ${generateFooter()}
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `📊 Your Weekly Price Report: ${priceDrops.length} drops, $${totalSavings.toFixed(0)} savings`,
      html: generateEmailWrapper(content, `${priceDrops.length} price drops found. Total potential savings: $${totalSavings.toFixed(0)}`),
    });

    if (error) {
      console.error("Failed to send email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}

// ============================================
// WELCOME EMAIL
// ============================================

interface WelcomeEmailProps {
  to: string;
  userName?: string;
}

export async function sendWelcomeEmail({ to, userName }: WelcomeEmailProps) {
  if (!resend) {
    console.log("Resend not configured, skipping email");
    return { success: false, error: "Email service not configured" };
  }

  const greeting = userName ? `Welcome, ${userName}!` : "Welcome to PriceGhost!";

  const content = `
    ${generateHeader()}
    
    <h2 style="font-size: 24px; color: #1f2937; margin: 0 0 16px 0; text-align: center;">
      ${greeting} 🎉
    </h2>
    
    <p style="color: #6b7280; font-size: 16px; text-align: center; margin-bottom: 32px;">
      You're all set to start tracking prices and saving money!
    </p>
    
    <div style="background: #f0fdf4; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h3 style="font-size: 16px; color: #1f2937; margin: 0 0 16px 0;">
        🚀 Get started in 3 easy steps:
      </h3>
      
      <div style="margin-bottom: 16px;">
        <span style="
          display: inline-block;
          width: 24px;
          height: 24px;
          background: #10b981;
          color: white;
          border-radius: 50%;
          text-align: center;
          line-height: 24px;
          font-size: 14px;
          font-weight: bold;
          margin-right: 12px;
        ">1</span>
        <strong>Add a product</strong> - Paste any product URL from Amazon, Walmart, Best Buy, or Target
      </div>
      
      <div style="margin-bottom: 16px;">
        <span style="
          display: inline-block;
          width: 24px;
          height: 24px;
          background: #10b981;
          color: white;
          border-radius: 50%;
          text-align: center;
          line-height: 24px;
          font-size: 14px;
          font-weight: bold;
          margin-right: 12px;
        ">2</span>
        <strong>Set your target price</strong> - We'll alert you when it drops below
      </div>
      
      <div>
        <span style="
          display: inline-block;
          width: 24px;
          height: 24px;
          background: #10b981;
          color: white;
          border-radius: 50%;
          text-align: center;
          line-height: 24px;
          font-size: 14px;
          font-weight: bold;
          margin-right: 12px;
        ">3</span>
        <strong>Save money!</strong> - Get notified instantly when prices drop
      </div>
    </div>
    
    <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
      <h4 style="margin: 0 0 12px 0; font-size: 14px; color: #1f2937;">
        💡 Pro tip: Install our browser extension!
      </h4>
      <p style="color: #6b7280; font-size: 14px; margin: 0;">
        Track products with one click while you shop. Available for Chrome.
      </p>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="https://priceghost.app/dashboard" style="${emailStyles.button}">
        Start Tracking Prices →
      </a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px; text-align: center;">
      Questions? Just reply to this email - we're here to help! 
    </p>
    
    ${generateFooter()}
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: "👻 Welcome to PriceGhost - Let's save some money!",
      html: generateEmailWrapper(content, "Welcome to PriceGhost! Start tracking prices and never miss a deal."),
    });

    if (error) {
      console.error("Failed to send email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}
