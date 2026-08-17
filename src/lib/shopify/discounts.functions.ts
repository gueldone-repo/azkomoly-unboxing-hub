// Server function: lee price_rules del Admin API (BoxSpinner, feature en
// pausa — ver comentario en routes/index.tsx).
import { createServerFn } from "@tanstack/react-start";

const STORE = "ipqptg-19.myshopify.com";
const API_VERSION = "2025-07";

export interface DiscountCode {
  code: string;
  title: string;
}

export const fetchShopifyDiscountCodes = createServerFn({ method: "GET" }).handler(
  async (): Promise<DiscountCode[]> => {
    const token = process.env.SHOPIFY_ADMIN_TOKEN;
    if (!token) {
      console.warn("[Shopify] SHOPIFY_ADMIN_TOKEN not set — using fallback codes");
      return [];
    }

    try {
      const rulesRes = await fetch(
        `https://${STORE}/admin/api/${API_VERSION}/price_rules.json?limit=10&status=enabled`,
        { headers: { "X-Shopify-Access-Token": token } },
      );
      if (!rulesRes.ok) return [];
      const { price_rules } = await rulesRes.json();
      if (!price_rules?.length) return [];

      const codes = await Promise.all(
        price_rules.slice(0, 6).map(async (rule: any) => {
          const codesRes = await fetch(
            `https://${STORE}/admin/api/${API_VERSION}/price_rules/${rule.id}/discount_codes.json?limit=1`,
            { headers: { "X-Shopify-Access-Token": token } },
          );
          if (!codesRes.ok) return null;
          const { discount_codes } = await codesRes.json();
          const code = discount_codes?.[0]?.code;
          return code ? { code, title: rule.title as string } : null;
        }),
      );

      return codes.filter((c): c is DiscountCode => c !== null);
    } catch (e) {
      console.error("[Shopify] fetchDiscountCodes failed", e);
      return [];
    }
  },
);
