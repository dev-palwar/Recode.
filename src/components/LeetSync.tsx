"use client";

import { useState, useEffect, cache } from "react";
import StatsGrid from "./StatsGrid";
import { LeetCodeData, Problem } from "@/types/index";
import { storage } from "@/lib/storage";
import { fetchLeetCodeDataFromExt, fetchUserFromDb } from "@/lib/api";
import {
  calculateStats,
  filterProblems,
  sortProblemsByRevision,
  scrollToElement,
} from "@/lib/utils";
import ProblemsTable from "@/components/ProblemTable";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useUser } from "@clerk/nextjs";
import { ErrorMessage } from "./Error";
import Loader from "./Loader";

export default function LeetCodePage() {
  const [data, setData] = useState<LeetCodeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [randomCount, setRandomCount] = useState<number | undefined>(undefined);
  const [randomProblems, setRandomProblems] = useState<Problem[] | null>(null);

  const { user } = useUser();

  // Update problem revision count
  const updateProblemrevisionCounter = (
    problem: Problem,
    type: "plus" | "minus"
  ) => {
    if (!data) return;

    const newCount =
      type === "plus"
        ? problem.revisionCount + 1
        : Math.max(problem.revisionCount - 1, 0);

    // Update the problem in the array
    const updatedProblems = data.problems.map((p) =>
      p.id === problem.id ? { ...p, revisionCount: newCount } : p
    );

    // Sort by revision count (highest at bottom)
    const sortedProblems = sortProblemsByRevision(updatedProblems);

    const updatedData = {
      ...data,
      problems: sortedProblems,
    };

    setData(updatedData);
    storage.set({ userId: user?.id as string, data: updatedData });

    // --- Updates randomProblems if active ---
    if (randomProblems) {
      // Updates and re-sort the randomProblems array as well
      const updatedRandomProblems = randomProblems.map((p) =>
        p.id === problem.id ? { ...p, revisionCount: newCount } : p
      );
      setRandomProblems(sortProblemsByRevision(updatedRandomProblems));
    }

    scrollToElement(problem.title);
  };

  // Refresh data from ext API (manual refresh)
  const refreshData = async () => {
    loadData();
  };

  // Client-side filtering
  const filteredAndSortedProblems = data
    ? sortProblemsByRevision(filterProblems(data.problems, filter, searchTerm))
    : [];

  // Calculate stats from all problems (not filtered)
  const stats = data ? calculateStats(data.problems) : null;

  const handleRandomClick = () => {
    if (!randomCount || filteredAndSortedProblems.length === 0) {
      setRandomProblems(null);
      return;
    }
    // Shuffle and pick randomCount problems
    const shuffled = [...filteredAndSortedProblems].sort(
      () => Math.random() - 0.5
    );
    setRandomProblems(sortProblemsByRevision(shuffled.slice(0, randomCount)));
  };

  const handleReset = () => {
    setSearchTerm("");
    setRandomProblems(null);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Looking in the localStorage first

      const cached = storage.get({ userId: user?.id as string });
      if (cached) {
        setData(cached);
        setLoading(false);
        setError(null);
        return;
      }

      // fetching user progress if any.
      const res = await fetchUserFromDb({ userId: user?.id as string });

      const transformed: LeetCodeData = {
        lastFetched: res.lastFetched ?? "",
        totalSolved: res.totalSolved ?? 0,
        filtered: res.filtered ?? undefined,
        problems: res.problems.map((p: any) => ({
          ...p,
          revisionCount: p.revisionCount ?? 0,
        })),
      };

      storage.set({ userId: user?.id ?? "", data: transformed });
      setData(transformed);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) loadData();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-light text-foreground tracking-tight mb-1">
                LeetCode Progress
              </h1>
              <p className="text-sm text-muted-foreground font-light">
                Your competitive programming journey
              </p>
            </div>
            {data && (
              <div className="text-right">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Last Sync
                </div>
                <div className="text-sm text-muted-foreground font-light">
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
        {loading && <Loader />}

        {error && <ErrorMessage message={error} onRetry={refreshData} />}

        {data && !loading && stats && (
          <>
            {/* Stats Cards */}
            <StatsGrid stats={stats} />

            {/* Search and Filters */}
            <div className="mb-8">
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search by title or problem number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-5 py-3 bg-background border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring font-light transition-all"
                  />
                </div>
                <div className="flex gap-2 border rounded-lg p-1 bg-card">
                  {[
                    { value: "all", label: "All" },
                    { value: "easy", label: "Easy" },
                    { value: "medium", label: "Medium" },
                    { value: "hard", label: "Hard" },
                  ].map((diff) => (
                    <Button
                      variant={filter !== diff.value ? "ghost" : "default"}
                      key={diff.value}
                      onClick={() => setFilter(diff.value)}
                      className="cursor-pointer"
                    >
                      {diff.label}
                    </Button>
                  ))}
                </div>
                <Select
                  onValueChange={(value) => setRandomCount(Number(value))}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a number" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Random ount</SelectLabel>
                      {[1, 2, 3, 4, 5].map((number) => (
                        <SelectItem key={number} value={String(number)}>
                          {number}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button onClick={handleRandomClick}>Random</Button>
                <Button onClick={handleReset}>Reset</Button>
              </div>
              <div className="mt-3 text-sm text-muted-foreground font-light">
                Showing {filteredAndSortedProblems.length} of {data.totalSolved}{" "}
                problems
              </div>
            </div>

            {/* Problems Table */}
            <div className="border rounded-lg overflow-y-auto h-[45vh] shadow-sm bg-card">
              <ProblemsTable
                problems={randomProblems ?? filteredAndSortedProblems}
                onUpdaterevisionCounter={updateProblemrevisionCounter}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
