import { NextResponse } from "next/server";
import { z } from "zod";

const payloadSchema = z.object({
  email: z.email(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = payloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Enter a valid email address." },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true, email: parsed.data.email });
}
