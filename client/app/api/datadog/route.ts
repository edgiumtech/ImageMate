export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const IS_PROD = process.env.NODE_ENV === "production";
const SITE = process.env.NEXT_PUBLIC_DATADOG_SITE || "datadoghq.com";

// Map site to intake URL
const INTAKE_MAP: Record<string, string> = {
  "datadoghq.com": "https://browser-intake-datadoghq.com",
  "us3.datadoghq.com": "https://browser-intake-us3-datadoghq.com",
  "us5.datadoghq.com": "https://browser-intake-us5-datadoghq.com",
  "datadoghq.eu": "https://browser-intake-datadoghq.eu",
  "ddog-gov.com": "https://browser-intake-ddog-gov.com",
};

const INTAKE = INTAKE_MAP[SITE] || "https://browser-intake-datadoghq.com";

function sanitizeHeaders(incoming: Headers) {
  const out = new Headers();
  for (const [k, v] of incoming.entries()) {
    const key = k.toLowerCase();
    if (key === "cookie" || key === "host" || key === "content-length")
      continue;
    out.set(k, v);
  }

  if (!out.has("content-type")) out.set("content-type", "text/plain");
  return out;
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "POST,OPTIONS",
      "access-control-allow-headers": "content-type,x-requested-with",
      "access-control-max-age": "86400",
    },
  });
}

export async function POST(req: Request) {
  const diag = {
    step: "start" as string,
    site: SITE,
    intake: INTAKE,
    ddforward: "",
    forwardUrl: "",
    bodyBytes: 0,
    err: "",
  };

  try {
    const url = new URL(req.url);
    const ddforward = url.searchParams.get("ddforward") || "";
    diag.step = "ddforward-check";
    diag.ddforward = ddforward;

    if (!ddforward || !ddforward.startsWith("/")) {
      return debugResponse(400, "Missing or invalid ddforward", diag);
    }

    const forwardUrl = new URL(ddforward, INTAKE).toString();
    diag.step = "url-built";
    diag.forwardUrl = forwardUrl;

    const buf = await req.arrayBuffer();
    diag.step = "body-read";
    diag.bodyBytes = buf.byteLength;

    const headers = sanitizeHeaders(req.headers);

    const xfwd = req.headers.get("x-forwarded-for") ?? "";
    const xreal = (req.headers.get("x-real-ip") ?? "").trim();
    const chain = [xfwd, xreal].filter(Boolean).join(", ");
    if (chain) headers.set("x-forwarded-for", chain);

    const fetchInit: RequestInit & { duplex?: "half" } = {
      method: "POST",
      headers,
      body: Buffer.from(buf),
    };

    fetchInit.duplex = "half";

    diag.step = "fetch";
    const ddResp = await fetch(forwardUrl, fetchInit);

    if (!ddResp.ok && !IS_PROD) {
      const text = await safeReadText(ddResp);
      return debugResponse(ddResp.status, `Upstream error: ${text}`, {
        ...diag,
        upstreamStatus: ddResp.status,
      });
    }

    return new Response(ddResp.body, {
      status: ddResp.status,
      headers: {
        "content-type": ddResp.headers.get("content-type") ?? "text/plain",

        "access-control-allow-origin": "*",
      },
    });
  } catch (err: any) {
    diag.step = "catch";
    diag.err = `${err?.name || "Error"}: ${err?.message || err}`;
    return debugResponse(502, "Proxy error", diag);
  }
}

async function safeReadText(r: Response) {
  try {
    return await r.text();
  } catch {
    return "<unreadable body>";
  }
}

function debugResponse(status: number, message: string, details: any) {
  if (IS_PROD) return new Response(message, { status });
  return new Response(JSON.stringify({ message, ...details }, null, 2), {
    status,
    headers: { "content-type": "application/json" },
  });
}
