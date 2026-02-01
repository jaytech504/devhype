"use server";

import { fetchCommitDiffs } from "./github";

type Platform = "linkedin" | "twitter" | "thread" | "script";
type Style = "professional" | "hype" | "story";

interface GeneratePostParams {
  repoName: string;
  platform: Platform;
  commitShas: string[];
  style: Style;
  angle?: string;
}

/**
 * Generate social media post content from GitHub commits
 * Currently a placeholder that fetches and logs commit diffs
 */
export async function generatePost({
  repoName,
  platform,
  commitShas,
  style,
  angle,
}: GeneratePostParams): Promise<string> {
  try {
    // Parse repo name (format: "owner/repo")
    const [owner, repo] = repoName.split("/");
    
    if (!owner || !repo) {
      throw new Error("Invalid repository name format. Expected 'owner/repo'");
    }

    if (commitShas.length === 0) {
      throw new Error("At least one commit must be selected");
    }

    // Fetch commit diffs
    console.log("Fetching commit diffs...");
    console.log(`Repository: ${repoName}`);
    console.log(`Platform: ${platform}`);
    console.log(`Style: ${style}`);
    console.log(`Angle: ${angle || "None"}`);
    console.log(`Commits: ${commitShas.join(", ")}`);
    console.log("");

    const commitDiffs = await fetchCommitDiffs(owner, repo, commitShas);

    console.log("=== COMMIT DIFFS ===");
    console.log(commitDiffs);
    console.log("=== END DIFFS ===");

    // TODO: Integrate with AI/LLM service to generate actual content
    // For now, return a placeholder message
    return `Content generation placeholder. Diffs have been logged to console.\n\nPlatform: ${platform}\nStyle: ${style}\nAngle: ${angle || "None"}\nCommits: ${commitShas.length}`;
  } catch (error) {
    console.error("Error generating post:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to generate post");
  }
}

