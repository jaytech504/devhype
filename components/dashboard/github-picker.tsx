"use client";

import { useState, useEffect } from "react";
import { GitCommit, GitBranch, Loader2, AlertCircle } from "lucide-react";
import { Select } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchUserRepos, fetchRepoCommits } from "@/app/actions/github";
import { cn } from "@/lib/utils";

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

interface GitHubPickerProps {
  onSelectionChange: (repoName: string, selectedCommits: string[]) => void;
}

export default function GitHubPicker({ onSelectionChange }: GitHubPickerProps) {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [selectedCommits, setSelectedCommits] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(false);
  const [loadingCommits, setLoadingCommits] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commitError, setCommitError] = useState<string | null>(null);

  // Load repos on mount
  useEffect(() => {
    const loadRepos = async () => {
      setLoading(true);
      setError(null);
      try {
        const reposData = await fetchUserRepos();
        setRepos(reposData);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load repositories";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadRepos();
  }, []);

  // Load commits when repo is selected
  useEffect(() => {
    if (!selectedRepo) {
      setCommits([]);
      setSelectedCommits(new Set());
      onSelectionChange("", []);
      return;
    }

    let cancelled = false;

    const loadCommits = async () => {
      setLoadingCommits(true);
      setCommitError(null);
      try {
        const [owner, repo] = selectedRepo.split("/");
        if (!owner || !repo) {
          throw new Error("Invalid repository format");
        }

        const commitsData = await fetchRepoCommits(owner, repo);

        if (!cancelled) {
          setCommits(commitsData);
          setSelectedCommits(new Set());
          onSelectionChange(selectedRepo, []);
        }
      } catch (err) {
        if (!cancelled) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to load commits";
          setCommitError(errorMessage);
          setCommits([]);
          console.error("Error loading commits:", err);
        }
      } finally {
        if (!cancelled) {
          setLoadingCommits(false);
        }
      }
    };

    loadCommits();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRepo]);

  // Handle commit selection
  const handleCommitToggle = (sha: string) => {
    const newSelection = new Set(selectedCommits);
    if (newSelection.has(sha)) {
      newSelection.delete(sha);
    } else {
      newSelection.add(sha);
    }
    setSelectedCommits(newSelection);
    onSelectionChange(selectedRepo, Array.from(newSelection));
  };

  // Format date to relative time
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {/* Repo Selector */}
      <div>
        <label className="mb-3 block text-sm font-medium text-slate-700">
          Repository
        </label>
        {loading ? (
          <div className="flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
            <span className="ml-2 text-sm text-slate-500">Loading repos...</span>
          </div>
        ) : error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-3">
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </div>
        ) : (
          <Select
            value={selectedRepo}
            onChange={(e) => setSelectedRepo(e.target.value)}
            className="w-full"
            placeholder="Select a repository"
          >
            <option value="" disabled>
              Select a repository
            </option>
            {repos.map((repo) => (
              <option key={repo.id} value={repo.full_name}>
                {repo.full_name}
              </option>
            ))}
          </Select>
        )}
      </div>

      {/* Commit List */}
      {selectedRepo && (
        <div>
          <label className="mb-3 block text-sm font-medium text-slate-700">
            Select Commits
          </label>
          {commitError ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-3">
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{commitError}</span>
              </div>
            </div>
          ) : loadingCommits ? (
            <div className="flex h-[300px] items-center justify-center rounded-md border border-slate-200 bg-white shadow-sm">
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
              <span className="ml-2 text-sm text-slate-400">
                Loading commits...
              </span>
            </div>
          ) : commits.length === 0 ? (
            <div className="flex h-[300px] items-center justify-center rounded-md border border-slate-200 bg-white shadow-sm">
              <p className="text-sm text-slate-500">No commits found</p>
            </div>
          ) : (
            <ScrollArea className="h-[300px] rounded-md border border-slate-200 bg-white p-4 shadow-sm">
              <div className="space-y-2">
                {commits.map((commit) => {
                  const isSelected = selectedCommits.has(commit.sha);
                  return (
                    <div
                      key={commit.sha}
                      className={cn(
                        "flex items-start gap-3 rounded-lg border p-3 transition-colors cursor-pointer",
                        isSelected
                          ? "border-indigo-200 bg-indigo-50"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      )}
                      onClick={() => handleCommitToggle(commit.sha)}
                    >
                      <div onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleCommitToggle(commit.sha)}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="mb-1 flex items-center gap-2">
                          <GitCommit className="h-3 w-3 flex-shrink-0 text-slate-400" />
                          <span className="text-xs font-mono text-slate-500">
                            {commit.sha}
                          </span>
                          <span className="text-xs text-slate-400">
                            {formatDate(commit.date)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-900 truncate">
                          {commit.message}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full bg-slate-900" />
                          <span className="text-xs text-slate-500">
                            {commit.author_name}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
          {selectedCommits.size > 0 && (
            <p className="mt-2 text-xs text-slate-500">
              {selectedCommits.size} commit{selectedCommits.size !== 1 ? "s" : ""}{" "}
              selected
            </p>
          )}
        </div>
      )}
    </div>
  );
}

