"use client";

import { useState, useCallback } from "react";
import {
  Linkedin,
  Twitter,
  MessageSquare,
  FileText,
  Sparkles,
  Loader2,
  Copy,
  Check,
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
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

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

  const handleCopy = useCallback(async (text: string, key: string) => {
    if (!text.trim()) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey((current) => (current === key ? null : current)), 1500);
    } catch (error) {
      console.error("Failed to copy content:", error);
      alert("Copy failed. Please try again.");
    }
  }, []);

  const parseScriptRows = useCallback((scriptContent: string) => {
    const lines = scriptContent
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const tableLines = lines.filter((line) => line.includes("|"));
    const rows = tableLines
      .map((line) => line.replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim()))
      .filter((cells) => cells.length >= 2)
      .filter((cells) => {
        const joined = cells.join(" ").toLowerCase();
        return !joined.includes("---") && !joined.includes("visual audio");
      })
      .map(([visual, audio]) => ({
        visual: visual || "Visual cues and transitions...",
        audio: audio || "Narration and voiceover...",
      }));

    if (rows.length > 0) return rows;

    const blocks = scriptContent
      .split("\n\n")
      .map((block) => block.trim())
      .filter(Boolean);

    return [
      {
        visual: blocks[0] || "Visual cues and transitions...",
        audio: blocks[1] || "Narration and voiceover...",
      },
    ];
  }, []);

  const renderPreview = () => {
    switch (contentType) {
      case "linkedin":
        return (
          <div className="space-y-4">
            <div className="relative rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleCopy(content, "linkedin")}
                className="absolute right-4 top-4 z-10 h-8 px-2"
              >
                {copiedKey === "linkedin" ? (
                  <>
                    <Check className="mr-1 h-3.5 w-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </Button>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-900" />
                <div>
                  <div className="h-3 w-24 rounded bg-slate-200" />
                  <div className="mt-1 h-2 w-16 rounded bg-slate-100" />
                </div>
              </div>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Your LinkedIn post content..."
                className="min-h-[200px]"
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
            <div className="relative rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleCopy(content, "twitter")}
                className="absolute right-4 top-4 z-10 h-8 px-2"
              >
                {copiedKey === "twitter" ? (
                  <>
                    <Check className="mr-1 h-3.5 w-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </Button>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-900" />
                <div>
                  <div className="h-3 w-24 rounded bg-slate-200" />
                  <div className="mt-1 h-2 w-16 rounded bg-slate-100" />
                </div>
              </div>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Your tweet..."
                className="min-h-[120px]"
                maxLength={280}
              />
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  {content.length} / 280 characters
                </span>
                <span className="text-slate-900">Tweet</span>
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
                  className="relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(post, `thread-${index}`)}
                    className="absolute right-4 top-4 z-10 h-8 px-2"
                  >
                    {copiedKey === `thread-${index}` ? (
                      <>
                        <Check className="mr-1 h-3.5 w-3.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1 h-3.5 w-3.5" />
                        Copy
                      </>
                    )}
                  </Button>
                  <div className="mb-2 text-xs font-semibold text-slate-500">
                    {index + 1}/{threadPosts.length}
                  </div>
                  <p className="whitespace-pre-wrap pr-20 text-sm leading-relaxed text-slate-900">
                    {post}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500 shadow-sm">
                Generate content to see thread preview
              </div>
            )}
          </div>
        );

      case "script":
        const scriptRows = parseScriptRows(content);
        return (
          <div className="space-y-4">
            <div className="relative rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleCopy(content, "script")}
                className="absolute right-4 top-4 z-10 h-8 px-2"
              >
                {copiedKey === "script" ? (
                  <>
                    <Check className="mr-1 h-3.5 w-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </Button>
              <div className="mt-8 overflow-hidden rounded-lg border border-slate-200">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="w-1/2 border-b border-r border-slate-200 px-4 py-3 font-semibold text-slate-800">
                        Visual
                      </th>
                      <th className="w-1/2 border-b border-slate-200 px-4 py-3 font-semibold text-slate-800">
                        Audio
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {scriptRows.map((row, index) => (
                      <tr key={index} className="align-top">
                        <td className="border-b border-r border-slate-200 px-4 py-3 text-slate-700">
                          <p className="whitespace-pre-wrap leading-relaxed">
                            {row.visual}
                          </p>
                        </td>
                        <td className="border-b border-slate-200 px-4 py-3 text-slate-700">
                          <p className="whitespace-pre-wrap leading-relaxed">
                            {row.audio}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-900">
          Content Studio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {/* Format Selector */}
            <div>
              <label className="mb-3 block text-sm font-medium text-slate-700">
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
                      className="h-auto flex-col gap-2 py-4"
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
              <label className="mb-3 block text-sm font-medium text-slate-700">
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
              <label className="mb-3 block text-sm font-medium text-slate-700">
                Angle (Optional)
              </label>
              <input
                type="text"
                value={angle}
                onChange={(e) => setAngle(e.target.value)}
                placeholder="e.g., Focus on the technical challenges..."
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-100 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              size="lg"
              className="w-full"
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
            <label className="mb-3 block text-sm font-medium text-slate-700">
              Preview
            </label>
            {renderPreview()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

