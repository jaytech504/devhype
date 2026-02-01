"use server";

import { createClient } from "@/lib/supabase/server";
import { Octokit } from "octokit";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  default_branch: string;
}

interface GitHubCommit {
  sha: string;
  message: string;
  date: string;
  author_name: string;
  html_url: string;
}

/**
 * Get an authenticated Octokit client using the user's GitHub access token
 */
async function getGitHubClient() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("No active session. Please sign in.");
  }

  // Extract provider_token from the session
  const providerToken = session.provider_token;

  if (!providerToken) {
    throw new Error(
      "GitHub access token not found. Please sign out and sign in again to refresh GitHub access."
    );
  }

  // Initialize Octokit with the GitHub access token
  const octokit = new Octokit({
    auth: providerToken,
  });

  return octokit;
}

/**
 * Fetch all repositories for the authenticated user
 */
export async function fetchUserRepos(): Promise<GitHubRepo[]> {
  try {
    const octokit = await getGitHubClient();

    const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: "updated",
      direction: "desc",
      per_page: 100,
    });

    return repos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      default_branch: repo.default_branch || "main",
    }));
  } catch (error) {
    console.error("Error fetching repos:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch repositories");
  }
}

/**
 * Fetch commits for a specific repository
 */
export async function fetchRepoCommits(
  owner: string,
  repo: string
): Promise<GitHubCommit[]> {
  try {
    const octokit = await getGitHubClient();

    const { data: commits } = await octokit.rest.repos.listCommits({
      owner,
      repo,
      per_page: 20,
    });

    return commits.map((commit) => ({
      sha: commit.sha.substring(0, 7),
      message: commit.commit.message.split("\n")[0], // First line only
      date: commit.commit.author?.date || commit.commit.committer?.date || "",
      author_name: commit.commit.author?.name || commit.commit.committer?.name || "Unknown",
      html_url: commit.html_url,
    }));
  } catch (error) {
    console.error("Error fetching commits:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch commits");
  }
}

/**
 * Fetch commit diffs for multiple commits
 * Returns formatted string with code changes for AI processing
 */
export async function fetchCommitDiffs(
  owner: string,
  repo: string,
  commitShas: string[]
): Promise<string> {
  try {
    const octokit = await getGitHubClient();
    const lockFilePatterns = [
      /package-lock\.json$/i,
      /yarn\.lock$/i,
      /pnpm-lock\.yaml$/i,
      /\.lock$/i,
    ];

    const formattedDiffs: string[] = [];

    for (const sha of commitShas) {
      try {
        const { data: commit } = await octokit.rest.repos.getCommit({
          owner,
          repo,
          ref: sha,
        });

        const commitMessage = commit.commit.message.split("\n")[0];
        formattedDiffs.push(`Commit: ${commitMessage}`);
        formattedDiffs.push(`SHA: ${sha}`);
        formattedDiffs.push("");

        if (commit.files && commit.files.length > 0) {
          for (const file of commit.files) {
            // Skip lock files
            const isLockFile = lockFilePatterns.some((pattern) =>
              pattern.test(file.filename)
            );
            if (isLockFile) {
              continue;
            }

            formattedDiffs.push(`File: ${file.filename}`);
            formattedDiffs.push(`Status: ${file.status}`);

            if (file.patch) {
              let patch = file.patch;

              // Truncate if patch is too large (> 2000 characters)
              if (patch.length > 2000) {
                patch = patch.substring(0, 2000);
                patch += "\n[...Diff Truncated]";
              }

              formattedDiffs.push("Diff:");
              formattedDiffs.push(patch);
            } else {
              formattedDiffs.push("Diff: [No patch available - likely binary file or too large]");
            }

            formattedDiffs.push("");
          }
        } else {
          formattedDiffs.push("No files changed in this commit.");
          formattedDiffs.push("");
        }

        formattedDiffs.push("---");
        formattedDiffs.push("");
      } catch (commitError) {
        console.error(`Error fetching commit ${sha}:`, commitError);
        formattedDiffs.push(`Commit: ${sha}`);
        formattedDiffs.push(`Error: Failed to fetch commit details`);
        formattedDiffs.push("");
      }
    }

    return formattedDiffs.join("\n");
  } catch (error) {
    console.error("Error fetching commit diffs:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch commit diffs");
  }
}

