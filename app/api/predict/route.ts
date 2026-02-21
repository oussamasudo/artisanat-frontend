export const runtime = "nodejs"; // important sur Vercel

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // ✅ URL HF Space (backend)
    const backendUrl = "https://imad2-artisanat-api.hf.space";

    const response = await fetch(`${backendUrl}/predict`, {
      method: "POST",
      body: formData,
      // pas besoin de headers, fetch met le bon multipart automatiquement
    });

    const text = await response.text();
    if (!response.ok) {
      return Response.json({ error: text || "Backend prediction failed" }, { status: 500 });
    }

    // HF renvoie du JSON, donc:
    const data = JSON.parse(text);
    return Response.json(data);
  } catch (error) {
    console.error("Prediction error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Prediction failed" },
      { status: 500 }
    );
  }
}