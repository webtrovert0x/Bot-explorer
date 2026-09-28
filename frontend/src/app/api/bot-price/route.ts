import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 10; // Cache for 10 seconds

export async function GET() {
  try {
    const res = await fetch("https://api.coinstore.com/api/v1/ticker/price", {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BotExplorer/1.0)",
        Accept: "application/json",
      },
      next: { revalidate: 10 },
    });

    if (!res.ok) {
      throw new Error(`Coinstore API returned status ${res.status}`);
    }

    const json = await res.json();
    const botTicker = (json.data || []).find(
      (item: any) => item.symbol?.toUpperCase() === "BOTUSDT"
    );

    const price = botTicker?.price ? parseFloat(botTicker.price) : 12.399;

    return NextResponse.json({
      success: true,
      symbol: "BOTUSDT",
      price: price > 0 ? price : 12.399,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.warn("Coinstore BOT price fetch failed, using fallback:", error?.message);
    return NextResponse.json({
      success: false,
      symbol: "BOTUSDT",
      price: 12.399,
      fallback: true,
      timestamp: Date.now(),
    });
  }
}
