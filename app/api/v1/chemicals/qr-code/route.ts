import { type NextRequest, NextResponse } from "next/server";
import { generateQRCode } from "@/lib/qr-generator";

export async function POST(request: NextRequest) {
  try {
    const { chemicalId } = await request.json();

    const qrData = `${process.env.NEXT_PUBLIC_APP_URL}/chemicals/${chemicalId}`;
    const qrCode = await generateQRCode(qrData);

    return NextResponse.json({ qrCode });
  } catch (error) {
    console.error("QR code generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 }
    );
  }
}
