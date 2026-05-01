"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { fetchCommitDiffs } from "./github";
import { createClient } from "@/lib/supabase/server";

const PLATFORM_FORMATS = {
  linkedin:
    "Hook + Bullet Points + Question. Professional tone, value-focused.",
  twitter: "Under 280 characters. Punchy, concise, memorable.",
  thread:
    "3-5 tweets separated by '---'. Each tweet under 280 chars. Build a narrative across tweets.",
  script:
    "Markdown table format with two columns: | Visual | Audio |. Describe what appears on screen and what is said.",
} as const;

function isMissingPostsTableError(message: string) {
  return message.includes("Could not find the table 'public.posts' in the schema cache");
}

function isPostsProfileForeignKeyError(message: string) {
  return (
    message.includes("generated_posts_user_id_fkey") ||
    (message.includes("foreign key constraint") && message.includes("user_id"))
  );
}

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

    const generatedText = response.text();

    // Track successful generations for per-user dashboard analytics.
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const basePayload = {
          user_id: user.id,
          content: generatedText,
          platform,
          style,
          repo_name: repoName,
          commit_count: commitShas.length,
        };

        // Prefer rich history payload; gracefully degrade if table is minimal.
        let { error: insertError } = await supabase.from("posts").insert(basePayload);

        // Compatibility path for legacy schema where posts.user_id references profiles(id).
        if (insertError && isPostsProfileForeignKeyError(insertError.message)) {
          const { error: profileUpsertError } = await supabase.from("profiles").upsert(
            {
              id: user.id,
              email: user.email ?? null,
            },
            { onConflict: "id" }
          );

          if (!profileUpsertError) {
            const retryInsert = await supabase.from("posts").insert(basePayload);
            insertError = retryInsert.error;
          }
        }

        if (insertError) {
          const fallbackInsert = await supabase.from("posts").insert({
            user_id: user.id,
          });
          insertError = fallbackInsert.error;
        }

        if (insertError) {
          if (!isMissingPostsTableError(insertError.message)) {
            console.warn("Failed to record generated post analytics:", insertError.message);
          }
        }
      }
    } catch (trackingError) {
      console.warn("Error while tracking generated post analytics:", trackingError);
    }

    return generatedText;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to generate post");
  }
}
