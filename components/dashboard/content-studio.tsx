"use client";

import { useState, useCallback } from "react";
import {
  Linkedin,
  Twitter,
  MessageSquare,
  FileText,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import GitHubPicker from "@/components/dashboard/github-picker";
import { generatePost } from "@/app/actions/generate";

type ContentType = "linkedin" | "twitter" | "thread" | "script";
type Style = "professional" | "hype" | "story";

export default function ContentStudio() {
  const [contentType, setContentType] = useState<ContentType>("linkedin");
  const [selectedRepo, setSelectedRepo] = useState("");
  const [selectedCommits, setSelectedCommits] = useState<string[]>([]);
  const [style, setStyle] = useState<Style>("professional");
  const [angle, setAngle] = useState("");
  const [content, setContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const styles = [
    { value: "professional", label: "Professional" },
    { value: "hype", label: "Hype" },
    { value: "story", label: "Story" },
  ];

  const formatButtons = [
    {
      type: "linkedin" as ContentType,
      label: "LinkedIn",
      icon: Linkedin,
      color: "from-blue-500 to-blue-600",
    },
    {
      type: "twitter" as ContentType,
      label: "Twitter",
      icon: Twitter,
      color: "from-cyan-500 to-cyan-600",
    },
    {
      type: "thread" as ContentType,
      label: "Thread",
      icon: MessageSquare,
      color: "from-purple-500 to-purple-600",
    },
    {
      type: "script" as ContentType,
      label: "Script",
      icon: FileText,
      color: "from-green-500 to-green-600",
    },
  ];

  const handleGenerate = async () => {
    if (!selectedRepo || selectedCommits.length === 0) {
      alert("Please select a repository and at least one commit.");
      return;
    }

    setIsGenerating(true);
    setContent("");

    try {
      const generatedContent = await generatePost(
        selectedRepo,
        selectedCommits,
        contentType,
        style,
        angle.trim() || undefined
      );

      setContent(generatedContent);
    } catch (error) {
      console.error("Error generating content:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to generate content. Please try again.";
      alert(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGitHubSelection = useCallback((repoName: string, commits: string[]) => {
    setSelectedRepo(repoName);
    setSelectedCommits(commits);
  }, []);

  const renderPreview = () => {
    switch (contentType) {
      case "linkedin":
        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600" />
                <div>
                  <div className="h-3 w-24 rounded bg-slate-700" />
                  <div className="mt-1 h-2 w-16 rounded bg-slate-800" />
                </div>
              </div>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Your LinkedIn post content..."
                className="min-h-[200px] bg-slate-950/50 border-slate-700"
              />
              <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                <span>0 likes</span>
                <span>0 comments</span>
              </div>
            </div>
          </div>
        );

      case "twitter":
        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600" />
                <div>
                  <div className="h-3 w-24 rounded bg-slate-700" />
                  <div className="mt-1 h-2 w-16 rounded bg-slate-800" />
                </div>
              </div>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Your tweet..."
                className="min-h-[120px] bg-slate-950/50 border-slate-700"
                maxLength={280}
              />
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  {content.length} / 280 characters
                </span>
                <span className="text-cyan-400">Tweet</span>
              </div>
            </div>
          </div>
        );

      case "thread":
        const threadPosts = content.split("\n\n").filter((p) => p.trim());
        return (
          <div className="space-y-3">
            {threadPosts.length > 0 ? (
              threadPosts.map((post, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-slate-800 bg-slate-900/50 p-4"
                >
                  <div className="mb-2 text-xs font-semibold text-purple-400">
                    {index + 1}/{threadPosts.length}
                  </div>
                  <p className="text-sm text-slate-200">{post}</p>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 text-center text-slate-500">
                Generate content to see thread preview
              </div>
            )}
          </div>
        );

      case "script":
        const [visual, audio] = content.split("\n\n");
        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-green-400">
                    Visual
                  </h4>
                  <div className="rounded border border-slate-700 bg-slate-950/50 p-3 text-sm text-slate-300">
                    {visual || "Visual cues and transitions..."}
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-green-400">
                    Audio
                  </h4>
                  <div className="rounded border border-slate-700 bg-slate-950/50 p-3 text-sm text-slate-300">
                    {audio || "Narration and voiceover..."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="border-slate-800">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-200">
          Content Studio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {/* Format Selector */}
            <div>
              <label className="mb-3 block text-sm font-medium text-slate-400">
                Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                {formatButtons.map((format) => {
                  const Icon = format.icon;
                  const isActive = contentType === format.type;
                  return (
                    <Button
                      key={format.type}
                      onClick={() => setContentType(format.type)}
                      variant={isActive ? "default" : "outline"}
                      className={`h-auto flex-col gap-2 py-4 ${isActive
                        ? `bg-gradient-to-r ${format.color} text-white`
                        : "border-slate-700 text-slate-300 hover:border-purple-500/50"
                        }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs">{format.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* GitHub Picker */}
            <GitHubPicker onSelectionChange={handleGitHubSelection} />

            {/* Style Selector */}
            <div>
              <label className="mb-3 block text-sm font-medium text-slate-400">
                Style
              </label>
              <Select
                value={style}
                onChange={(e) => setStyle(e.target.value as Style)}
                className="w-full"
              >
                {styles.map((styleOption) => (
                  <option key={styleOption.value} value={styleOption.value}>
                    {styleOption.label}
                  </option>
                ))}
              </Select>
            </div>

            {/* Angle Text Input */}
            <div>
              <label className="mb-3 block text-sm font-medium text-slate-400">
                Angle (Optional)
              </label>
              <input
                type="text"
                value={angle}
                onChange={(e) => setAngle(e.target.value)}
                placeholder="e.g., Focus on the technical challenges..."
                className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-200 ring-offset-slate-950 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/50 hover:scale-105 hover:shadow-purple-500/70 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Content
                </>
              )}
            </Button>
          </div>

          {/* Right Column - Preview */}
          <div>
            <label className="mb-3 block text-sm font-medium text-slate-400">
              Preview
            </label>
            {renderPreview()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

