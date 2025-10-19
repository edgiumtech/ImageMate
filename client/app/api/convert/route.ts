import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Get query parameters from the request URL
    const searchParams = request.nextUrl.searchParams;

    // Get the image data from the request body
    const imageData = await request.arrayBuffer();

    // Get content type
    const contentType = request.headers.get("content-type") || "image/jpeg";

    // Forward to imaginary API
    const imaginaryUrl = new URL("http://localhost:9000/convert");
    searchParams.forEach((value, key) => {
      imaginaryUrl.searchParams.append(key, value);
    });

    const response = await fetch(imaginaryUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": contentType,
      },
      body: imageData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Conversion failed: ${errorText}` },
        { status: response.status }
      );
    }

    // Get the converted image
    const convertedImage = await response.arrayBuffer();

    // Return the image with appropriate headers
    return new NextResponse(convertedImage, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("content-type") || "image/webp",
        "Content-Length": convertedImage.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("Conversion error:", error);
    return NextResponse.json(
      {
        error: `Conversion failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}

