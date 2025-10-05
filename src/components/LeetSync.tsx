"use client";

import { useState, useEffect } from "react";
import StatsGrid from "./StatsGrid";
import { LeetCodeData, Problem } from "@/types/index";
import { storage } from "@/lib/storage";
import { fetchLeetCodeData } from "@/lib/api";
import {
  calculateStats,
  filterProblems,
  sortProblemsByRevision,
  scrollToElement,
} from "@/lib/utils";
import ProblemsTable from "./ProblemTable";
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
export default function LeetCodePage() {
  const [data, setData] = useState<LeetCodeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [randomCount, setRandomCount] = useState<number | undefined>(undefined);
  const [randomProblems, setRandomProblems] = useState<Problem[] | null>(null);

  // Loads data on mount - from localStorage first, then API if needed
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to load from localStorage first
        const cachedData = storage.get();

        if (cachedData) {
          console.log("Loading from localStorage cache");
          setData(cachedData);
          setLoading(false);
        } else {
          // No cache, fetch from API
          console.log("No cache found, fetching from API");
          const apiData = await fetchLeetCodeData();

          // Ensure revisionCounter exists for all problems
          const problems = apiData.problems.map((p) => ({
            ...p,
            revisionCounter: p.revisionCounter || 0,
          }));

          const dataWithRevisions = {
            ...apiData,
            problems,
          };

          setData(dataWithRevisions);
          storage.set(dataWithRevisions);
          setLoading(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setData(null);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Update problem revision count
  const updateProblemrevisionCounter = (
    problem: Problem,
    type: "plus" | "minus"
  ) => {
    if (!data) return;

    const newCount =
      type === "plus"
        ? problem.revisionCounter + 1
        : Math.max(problem.revisionCounter - 1, 0);

    // Update the problem in the array
    const updatedProblems = data.problems.map((p) =>
      p.id === problem.id ? { ...p, revisionCounter: newCount } : p
    );

    // Sort by revision count (highest at bottom)
    const sortedProblems = sortProblemsByRevision(updatedProblems);

    const updatedData = {
      ...data,
      problems: sortedProblems,
    };

    setData(updatedData);
    storage.set(updatedData);

    // --- Update randomProblems if active ---
    if (randomProblems) {
      // Update and re-sort the randomProblems array as well
      const updatedRandomProblems = randomProblems.map((p) =>
        p.id === problem.id ? { ...p, revisionCounter: newCount } : p
      );
      setRandomProblems(sortProblemsByRevision(updatedRandomProblems));
    }

    scrollToElement(problem.title);
  };

  // Refresh data from API (manual refresh)
  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiData = await fetchLeetCodeData();

      // Merge with existing revision counts from localStorage
      const cachedData = storage.get();
      const problems = apiData.problems.map((p) => {
        const cached = cachedData?.problems.find((cp) => cp.id === p.id);
        return {
          ...p,
          revisionCounter: cached?.revisionCounter || 0,
        };
      });

      const dataWithRevisions = {
        ...apiData,
        problems,
      };

      setData(dataWithRevisions);
      storage.set(dataWithRevisions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
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
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="inline-block w-12 h-12 border-2 border-muted border-t-foreground rounded-full animate-spin mb-4"></div>
              <p className="text-muted-foreground font-light">
                Loading your achievements...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto">
            <div className="border border-destructive/50 rounded-lg p-6 bg-destructive/10">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-destructive text-xs">!</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-foreground mb-1">
                    Unable to load data
                  </h3>
                  <p className="text-sm text-muted-foreground font-light">
                    {error}
                  </p>
                  <button
                    onClick={refreshData}
                    className="mt-3 text-sm text-foreground hover:text-foreground/80 font-light underline underline-offset-2"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
