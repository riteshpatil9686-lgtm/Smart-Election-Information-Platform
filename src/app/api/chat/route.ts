import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `You are an expert Indian election information assistant powered by ECI data. 
Answer questions about voter eligibility, polling booths, registration deadlines, election schedules, 
and required documents. Always cite the relevant official rule. If unsure, direct users to voters.eci.gov.in. 
Respond in the user's chosen language. Be concise, factual, and helpful — never political.
Key facts: Voting age is 18. Citizens of India only. Voter ID, Aadhaar, PAN, Passport, 
MNREGA card, bank passbook with photo are accepted at booths. Register at voters.eci.gov.in.`;

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const systemWithContext = context
      ? `${SYSTEM_PROMPT}\n\nCurrent user context: ${JSON.stringify(context)}`
      : SYSTEM_PROMPT;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemWithContext
    });

    const formattedMessages = messages.slice(-10).map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const history = formattedMessages.slice(0, -1);
    const latestMessage = formattedMessages[formattedMessages.length - 1].parts[0].text;

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(latestMessage);
    const text = result.response.text();

    return NextResponse.json({ reply: text });
  } catch (e: any) {
    console.error("Chat Error:", e);
    return NextResponse.json({ error: e.message ?? "Chat failed" }, { status: 500 });
  }
}
