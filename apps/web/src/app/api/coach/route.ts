import OpenAI from "openai";
import { NextResponse } from "next/server";

import { getCoachContext } from "@/content/course";

function buildFallbackResponse(
  question: string,
  coachContext: ReturnType<typeof getCoachContext>,
) {
  if (!coachContext) {
    return "I could not find course context for that request. Pick a module or objective and try again.";
  }

  if ("objective" in coachContext && coachContext.objective) {
    const { objective } = coachContext;
    return [
      `Focus on **${objective.title}**.`,
      objective.learn.conciseExplanation,
      `Exam clue: ${objective.learn.examClue}`,
      `Compare/contrast: ${objective.learn.compareContrast}`,
      `Your question was: "${question}"`,
    ].join("\n\n");
  }

  return [
    `You are in **${coachContext.module.title}**.`,
    coachContext.module.description,
    "Ask about a specific objective to get tighter coaching tied to published content only.",
    `Your question was: "${question}"`,
  ].join("\n\n");
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    moduleId?: string;
    objectiveId?: string;
    question?: string;
  };

  if (!body.moduleId || !body.question) {
    return NextResponse.json(
      { error: "moduleId and question are required." },
      { status: 400 },
    );
  }

  const coachContext = getCoachContext(body.moduleId, body.objectiveId);

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      reply: buildFallbackResponse(body.question, coachContext),
      mode: "local-fallback",
    });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await client.responses.create({
    model: "gpt-5-mini",
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text:
              "You are a private CLEP Humanities study coach. Answer only from the supplied course context. Keep the answer concise, practical, and study-focused. Do not introduce unsupported facts or raw-source claims.",
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: JSON.stringify(
              {
                question: body.question,
                courseContext: coachContext,
              },
              null,
              2,
            ),
          },
        ],
      },
    ],
  });

  return NextResponse.json({
    reply: response.output_text || buildFallbackResponse(body.question, coachContext),
    mode: "openai",
  });
}
