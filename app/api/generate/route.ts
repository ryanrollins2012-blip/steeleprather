import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert HR professional and manager coach. Generate a polished, professional performance review based on the inputs provided. The review should:
- Be 3-4 paragraphs long
- Sound human and specific, not like a template
- Use the employee's name throughout
- Balance strengths with constructive growth areas
- End with a forward-looking statement about the next review period
- Match the requested tone
Never use corporate jargon like "synergize", "leverage", or "utilize". Write like a thoughtful manager who knows this person well.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { employeeName, jobTitle, results, superpowers, opportunities, tone } = body;

    if (!employeeName || !jobTitle || !results) {
      return NextResponse.json(
        { error: "Missing required fields: employeeName, jobTitle, results" },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "API not configured. Please add your ANTHROPIC_API_KEY." },
        { status: 500 }
      );
    }

    const userPrompt = `Please write a performance review for the following employee:

Name: ${employeeName}
Job Title: ${jobTitle}
Requested Tone: ${tone}

Top 3 Results (what they delivered and the value it drove):
${results}

Top 3 Superpowers (strengths and how they used them to drive results):
${superpowers || "Not provided — infer strengths from their results."}

Top 3 Opportunities to Improve:
${opportunities || "Not provided — focus primarily on strengths and forward-looking goals."}

Write the full performance review now.`;

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const reviewText = message.content
      .filter((block) => block.type === "text")
      .map((block) => (block as Anthropic.TextBlock).text)
      .join("\n");

    return NextResponse.json({ review: reviewText });
  } catch (err) {
    console.error("Generate error:", err);
    if (err instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `AI service error: ${err.message}` },
        { status: err.status ?? 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to generate review. Please try again." },
      { status: 500 }
    );
  }
}
