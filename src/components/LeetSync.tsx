"use client";

import { useState, useEffect } from "react";

interface Problem {
  id: number;
  title: string;
  titleSlug: string;
  difficulty: string;
  difficultyLevel: number;
  acceptanceRate: number;
  totalAccepted: number;
  totalSubmissions: number;
  isPaidOnly: boolean;
}

interface LeetCodeData {
  totalSolved: number;
  lastFetched: string;
  filtered: number;
  problems: Problem[];
}

export default function LeetCodePage() {
  const [data, setData] = useState<LeetCodeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async (difficulty?: string) => {
    try {
      setLoading(true);
      setError(null);

      const url =
        difficulty && difficulty !== "all"
          ? `/api/leetcode?difficulty=${difficulty}`
          : "/api/leetcode";

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch data");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filter === "all" ? undefined : filter);
  }, [filter]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-emerald-700";
      case "medium":
        return "text-amber-700";
      case "hard":
        return "text-rose-700";
      default:
        return "text-slate-600";
    }
  };

  const filteredProblems =
    data?.problems.filter(
      (problem) =>
        searchTerm === "" ||
        problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.id.toString().includes(searchTerm)
    ) || [];

  const stats = data
    ? {
        easy: data.problems.filter((p) => p.difficulty === "Easy").length,
        medium: data.problems.filter((p) => p.difficulty === "Medium").length,
        hard: data.problems.filter((p) => p.difficulty === "Hard").length,
      }
    : null;

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-stone-50 to-neutral-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-light text-slate-900 tracking-tight mb-1">
                LeetCode Progress
              </h1>
              <p className="text-sm text-slate-500 font-light">
                Your competitive programming journey
              </p>
            </div>
            {data && (
              <div className="text-right">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                  Last Sync
                </div>
                <div className="text-sm text-slate-600 font-light">
                  {new Date(data.lastFetched).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="inline-block w-12 h-12 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 font-light">
                Loading your achievements...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-rose-50 border border-rose-100 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-rose-600 text-xs">!</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-rose-900 mb-1">
                    Unable to load data
                  </h3>
                  <p className="text-sm text-rose-700 font-light">{error}</p>
                  <button
                    onClick={() => fetchData()}
                    className="mt-3 text-sm text-rose-600 hover:text-rose-700 font-light underline underline-offset-2"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {data && !loading && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-6 mb-12">
              <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="text-xs text-slate-400 uppercase tracking-widest mb-3">
                  Total Solved
                </div>
                <div className="text-4xl font-light text-slate-900 mb-1">
                  {data.totalSolved}
                </div>
                <div className="text-xs text-slate-500 font-light">
                  problems completed
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="text-xs text-emerald-600 uppercase tracking-widest mb-3">
                  Easy
                </div>
                <div className="text-4xl font-light text-emerald-900 mb-1">
                  {stats?.easy || 0}
                </div>
                <div className="text-xs text-emerald-700 font-light">
                  foundational mastery
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="text-xs text-amber-600 uppercase tracking-widest mb-3">
                  Medium
                </div>
                <div className="text-4xl font-light text-amber-900 mb-1">
                  {stats?.medium || 0}
                </div>
                <div className="text-xs text-amber-700 font-light">
                  intermediate prowess
                </div>
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-red-50 border border-rose-100 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="text-xs text-rose-600 uppercase tracking-widest mb-3">
                  Hard
                </div>
                <div className="text-4xl font-light text-rose-900 mb-1">
                  {stats?.hard || 0}
                </div>
                <div className="text-xs text-rose-700 font-light">
                  expert achievements
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-8">
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search by title or problem number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-5 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-300 font-light transition-all"
                  />
                </div>
                <div className="flex gap-2 border border-slate-200 rounded-lg p-1 bg-white">
                  {[
                    { value: "all", label: "All" },
                    { value: "easy", label: "Easy" },
                    { value: "medium", label: "Medium" },
                    { value: "hard", label: "Hard" },
                  ].map((diff) => (
                    <button
                      key={diff.value}
                      onClick={() => setFilter(diff.value)}
                      className={`px-5 py-2 rounded-md text-sm font-light transition-all ${
                        filter === diff.value
                          ? "bg-slate-900 text-white shadow-sm"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      {diff.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-3 text-sm text-slate-500 font-light">
                Showing {filteredProblems.length} of {data.totalSolved} problems
              </div>
            </div>

            {/* Problems Table */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
              {filteredProblems.length === 0 ? (
                <div className="py-24 text-center">
                  <div className="text-slate-400 mb-2">
                    <svg
                      className="w-12 h-12 mx-auto mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-slate-500 font-light">
                    No problems found matching your criteria
                  </p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider w-24">
                        ID
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Problem
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider w-32">
                        Difficulty
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider w-40">
                        Acceptance
                      </th>
                      <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider w-32">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProblems.map((problem) => (
                      <tr
                        key={problem.id}
                        className="hover:bg-slate-50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <span className="text-slate-400 font-mono text-sm font-light">
                            #{problem.id}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-slate-900 font-light">
                              {problem.title}
                            </span>
                            {problem.isPaidOnly && (
                              <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded font-light">
                                Premium
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-sm font-light ${getDifficultyColor(
                              problem.difficulty
                            )}`}
                          >
                            {problem.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-100 rounded-full h-1.5 w-24">
                              <div
                                className="bg-slate-400 h-1.5 rounded-full transition-all"
                                style={{ width: `${problem.acceptanceRate}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-slate-600 font-light w-12 text-right">
                              {problem.acceptanceRate}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <a
                            href={`https://leetcode.com/problems/${problem.titleSlug}/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg transition-all font-light group-hover:shadow-sm"
                          >
                            View
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
