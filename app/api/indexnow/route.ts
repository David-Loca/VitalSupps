import { NextRequest, NextResponse } from "next/server";
import { submitToIndexNow } from "@/lib/indexnow";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const urlList = Array.isArray(body?.urlList) ? body.urlList : [];

    const result = await submitToIndexNow(urlList);
    return NextResponse.json(result, { status: result.ok ? 200 : result.status });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, status: 500, error: error?.message || "IndexNow submission failed" },
      { status: 500 }
    );
  }
}

