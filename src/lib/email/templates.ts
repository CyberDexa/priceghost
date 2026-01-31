// Email template components for PriceGhost

export const emailStyles = {
  body: `
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #1f2937;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #ffffff;
  `,
  header: `
    text-align: center;
    padding: 24px 0;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 24px;
  `,
  logo: `
    color: #10b981;
    font-size: 28px;
    font-weight: bold;
    margin: 0;
  `,
  card: `
    background: #f9fafb;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
  `,
  button: `
    display: inline-block;
    background: #10b981;
    color: white;
    padding: 14px 28px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    font-size: 16px;
  `,
  buttonSecondary: `
    display: inline-block;
    background: #f3f4f6;
    color: #374151;
    padding: 12px 24px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 500;
    font-size: 14px;
  `,
  footer: `
    font-size: 12px;
    color: #9ca3af;
    text-align: center;
    padding-top: 24px;
    border-top: 1px solid #e5e7eb;
    margin-top: 24px;
  `,
};

export function generateEmailWrapper(content: string, preheader?: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="light">
        <meta name="supported-color-schemes" content="light">
        ${preheader ? `<span style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</span>` : ''}
        <style>
          @media only screen and (max-width: 600px) {
            .container { padding: 12px !important; }
            .product-grid { display: block !important; }
            .product-item { width: 100% !important; margin-bottom: 16px !important; }
          }
        </style>
      </head>
      <body style="${emailStyles.body}">
        <div class="container">
          ${content}
        </div>
      </body>
    </html>
  `;
}

export function generateHeader(): string {
  return `
    <div style="${emailStyles.header}">
      <h1 style="${emailStyles.logo}">👻 PriceGhost</h1>
      <p style="color: #6b7280; margin: 8px 0 0 0; font-size: 14px;">Your personal price tracker</p>
    </div>
  `;
}

export function generateFooter(unsubscribeUrl?: string): string {
  return `
    <div style="${emailStyles.footer}">
      <p style="margin: 0 0 8px 0;">
        You're receiving this because you're tracking products on PriceGhost.
      </p>
      <p style="margin: 0;">
        ${unsubscribeUrl 
          ? `<a href="${unsubscribeUrl}" style="color: #9ca3af;">Unsubscribe</a> · `
          : ''
        }
        <a href="https://priceghost.app/settings" style="color: #9ca3af;">Manage preferences</a>
      </p>
      <p style="margin: 12px 0 0 0; font-size: 11px;">
        © ${new Date().getFullYear()} PriceGhost. All rights reserved.
      </p>
    </div>
  `;
}

interface ProductSummary {
  name: string;
  url: string;
  imageUrl?: string;
  currentPrice: number;
  previousPrice?: number;
  savings?: number;
  percentOff?: number;
}

export function generateProductCard(product: ProductSummary, highlight?: boolean): string {
  const hasDiscount = product.savings && product.savings > 0;
  
  return `
    <div style="
      ${emailStyles.card}
      ${highlight ? 'border: 2px solid #10b981; background: #ecfdf5;' : ''}
    ">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          ${product.imageUrl ? `
            <td width="80" valign="top" style="padding-right: 16px;">
              <img src="${product.imageUrl}" alt="" width="80" height="80" style="border-radius: 8px; object-fit: contain; background: #fff;">
            </td>
          ` : ''}
          <td valign="top">
            <h3 style="margin: 0 0 8px 0; font-size: 15px; color: #1f2937; line-height: 1.4;">
              ${product.name.length > 60 ? product.name.slice(0, 60) + '...' : product.name}
            </h3>
            <div style="margin-bottom: 12px;">
              ${product.previousPrice ? `
                <span style="text-decoration: line-through; color: #9ca3af; font-size: 14px; margin-right: 8px;">
                  $${product.previousPrice.toFixed(2)}
                </span>
              ` : ''}
              <span style="font-size: 20px; font-weight: bold; color: ${hasDiscount ? '#10b981' : '#1f2937'};">
                $${product.currentPrice.toFixed(2)}
              </span>
              ${hasDiscount && product.percentOff ? `
                <span style="
                  display: inline-block;
                  background: #dcfce7;
                  color: #166534;
                  padding: 2px 8px;
                  border-radius: 12px;
                  font-size: 12px;
                  font-weight: 600;
                  margin-left: 8px;
                ">
                  ${product.percentOff.toFixed(0)}% OFF
                </span>
              ` : ''}
            </div>
            <a href="${product.url}" style="${emailStyles.buttonSecondary}">
              View Deal →
            </a>
          </td>
        </tr>
      </table>
    </div>
  `;
}

export function generateStatsBar(stats: { label: string; value: string; color?: string }[]): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
      <tr>
        ${stats.map(stat => `
          <td style="text-align: center; padding: 16px; background: #f3f4f6; border-radius: 8px;">
            <div style="font-size: 24px; font-weight: bold; color: ${stat.color || '#1f2937'}; margin-bottom: 4px;">
              ${stat.value}
            </div>
            <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">
              ${stat.label}
            </div>
          </td>
        `).join('<td width="12"></td>')}
      </tr>
    </table>
  `;
}
