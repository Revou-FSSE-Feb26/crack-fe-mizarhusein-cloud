import { NextRequest, NextResponse } from "next/server";

interface OrderLine {
  name?: string;
  quantity?: number;
  notes?: string;
  price?: number;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    lines?: OrderLine[];
    subtotal?: number;
    tax?: number;
    total?: number;
  };

  const { lines, subtotal, tax, total } = body;

  if (!Array.isArray(lines) || lines.length === 0) {
    return NextResponse.json(
      { error: "Pesanan tidak boleh kosong." },
      { status: 400 }
    );
  }

  console.log(
    `[Order] ${new Date().toISOString()} — ${lines.length} item(s), subtotal=${subtotal}, tax=${tax}, total=${total}`
  );
  lines.forEach((line) => {
    console.log(`  - ${line.quantity}x ${line.name}${line.notes ? ` (${line.notes})` : ""}`);
  });

  return NextResponse.json({ success: true, message: "Pesanan berhasil diterima!" });
}
