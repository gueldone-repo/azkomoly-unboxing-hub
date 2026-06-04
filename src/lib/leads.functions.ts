import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SPREADSHEET_ID = "1Sjiu96kxdSbvGeZM-kWNUd2O9iWl_gdgG-mpqTO2aC8";
const RANGE = "Azkomoly_waiting_list!A:E";

const inputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  countryCode: z.string().trim().max(8).optional().nullable(),
  phone: z.string().trim().max(32).optional().nullable(),
});

export const appendLeadToSheet = createServerFn({ method: "POST" })
  .inputValidator((input) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const lovableKey = process.env.LOVABLE_API_KEY;
    const connKey = process.env.GOOGLE_SHEETS_API_KEY;
    if (!lovableKey) throw new Error("Missing LOVABLE_API_KEY");
    if (!connKey) throw new Error("Missing GOOGLE_SHEETS_API_KEY");

    const url = `https://connector-gateway.lovable.dev/google_sheets/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

    const timestamp = new Date().toISOString();
    const row = [
      timestamp,
      data.name,
      data.email,
      data.countryCode ?? "",
      data.phone ?? "",
    ];

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": connKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [row] }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Google Sheets append failed", res.status, text);
      return { ok: false as const, status: res.status };
    }
    return { ok: true as const };
  });
