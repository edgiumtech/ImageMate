import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:9000";

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch backend version");
    }

    const data = await response.json();

    return NextResponse.json({
      imaginary: data.imaginary || "unknown",
      bimg: data.bimg || "unknown",
      libvips: data.libvips || "unknown",
    });
  } catch (error) {
    console.error("Error fetching backend version:", error);
    return NextResponse.json(
      { imaginary: "unavailable", bimg: "unavailable", libvips: "unavailable" },
      { status: 503 }
    );
  }
}
