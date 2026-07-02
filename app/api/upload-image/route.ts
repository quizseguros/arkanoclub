import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "IMGBB_API_KEY não configurada" }, { status: 500 });
  }

  const form = await req.formData();
  const file = form.get("image") as File | null;
  if (!file) {
    return NextResponse.json({ error: "Nenhuma imagem enviada" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");

  const body = new URLSearchParams();
  body.set("key", apiKey);
  body.set("image", base64);
  body.set("expiration", "604800"); // 7 dias

  const res = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    body,
  });

  const data = await res.json();

  if (!data.success) {
    return NextResponse.json({ error: "Falha no upload" }, { status: 502 });
  }

  return NextResponse.json({ url: data.data.url });
}
