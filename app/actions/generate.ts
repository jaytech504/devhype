"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { fetchCommitDiffs } from "./github";

const PLATFORM_FORMATS = {
  linkedin:
    "Hook + Bullet Points + Question. Professional tone, value-focused.",
  twitter: "Under 280 characters. Punchy, concise, memorable.",
  thread:
    "3-5 tweets separated by '---'. Each tweet under 280 chars. Build a narrative across tweets.",
  script:
    "Markdown table format with two columns: | Visual | Audio |. Describe what appears on screen and what is said.",
} as const;

function buildSystemPrompt(): string {
  return `You are an expert Developer Advocate turning code into content.

Rules:
- NEVER reveal secrets, API keys, credentials, or sensitive data. Redact or generalize if needed.
- Focus on the value and the "why" — what problem this solves, what it enables, why it matters.
- Use the requested style (professional, hype, or story) consistently.
- Output only the post content. No meta-commentary or "Here's your post:" preamble.

Platform formats:
- LinkedIn: ${PLATFORM_FORMATS.linkedin}
- Twitter: ${PLATFORM_FORMATS.twitter}
- Thread: ${PLATFORM_FORMATS.thread}
- Script: ${PLATFORM_FORMATS.script}`;
}

export async function generatePost(
  repoName: string,
  commitShas: string[],
  platform: "linkedin" | "twitter" | "thread" | "script",
  style: "professional" | "hype" | "story",
  additionalContext?: string
): Promise<string> {
  if (!process.env.GOOGLE_API_KEY?.trim()) {
    throw new Error(
      "GOOGLE_API_KEY is not set. Please add it to your environment variables."
    );
  }

  try {
    const [owner, repo] = repoName.split("/");
    if (!owner?.trim() || !repo?.trim()) {
      throw new Error(
        "Invalid repository name format. Expected 'owner/repo'."
      );
    }
    if (commitShas.length === 0) {
      throw new Error("At least one commit must be selected.");
    }

    // Step A: Fetch code diffs
    const codeDiffs = await fetchCommitDiffs(owner, repo, commitShas);

    // Step B & C: Initialize Gemini client and get model
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: buildSystemPrompt(),
    });

    // Step D & E: Build user prompt and generate
    const userPrompt = [
      `Repository: ${repoName}`,
      `Platform: ${platform}`,
      `Style: ${style}`,
      additionalContext?.trim()
        ? `Additional context / angle: ${additionalContext.trim()}`
        : "",
      "",
      "Code changes (diffs) to turn into content:",
      "---",
      codeDiffs,
    ]
      .filter(Boolean)
      .join("\n");

    const result = await model.generateContent(userPrompt);
    const response = result.response;

    if (!response.text) {
      throw new Error(
        "Gemini returned no text. The response may have been blocked or empty."
      );
    }

    return response.text();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to generate post");
  }
}
