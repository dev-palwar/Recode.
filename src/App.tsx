import React, { useEffect, useState } from "react";
import { Upload, Shuffle, PlusIcon, Minus } from "lucide-react";
import * as XLSX from "xlsx";
import { getCurrentDate } from "./utils";

interface Problem {
  problemName: string;
  status: string;
  revisionCount: number;
  date?: string;
}

const STORAGE = "problems-data";

export default function LeetCodeTable() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [randomCount, setRandomCount] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE);
    if (savedData) {
      const parsed: Problem[] = JSON.parse(savedData);
      setProblems(parsed);
      setFilteredProblems(parsed);
    }
  }, []);

  const handleCount = (p: Problem, type: "plus" | "minus") => {
    setProblems((prev) => {
      const updated = prev.map((problem) =>
        problem.problemName === p.problemName
          ? {
              ...problem,
              date: getCurrentDate(),
              revisionCount:
                type === "plus"
                  ? (problem.revisionCount || 0) + 1
                  : Math.max((problem.revisionCount || 0) - 1, 0),
            }
          : problem
      );

      const sorted = [...updated].sort(
        (a, b) => a.revisionCount - b.revisionCount
      );

      localStorage.setItem(STORAGE, JSON.stringify(sorted));

      return updated;
    });

    setFilteredProblems((prev) => {
      const updated = prev.map((val) =>
        val.problemName === p.problemName
          ? {
              ...val,
              date: type === "plus" ? getCurrentDate() : val.date,
              revisionCount:
                type === "plus"
                  ? (val.revisionCount || 0) + 1
                  : Math.max((val.revisionCount || 0) - 1, 0),
            }
          : val
      );

      return updated;
    });
  };

  const generateLeetCodeUrl = (problemName: string): string =>
    `https://leetcode.com/problems/${problemName
      .toLowerCase()
      .replace(/\s+/g, "-")}`;

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet) as never[];

      const parsedProblems: Problem[] = json.map((row) => ({
        problemName:
          row["Problem"] ||
          row["Problem Name"] ||
          row["problemName"] ||
          row["name"] ||
          "",
        status: row["Status"] || row["Solved"] || row["status"] || "",
        revisionCount: Number(
          row["Revision Count"] ||
            row["Solved Count"] ||
            row["revisionCount"] ||
            row["count"] ||
            0
        ),
      }));

      setProblems(parsedProblems);
      setFilteredProblems(parsedProblems);
      localStorage.setItem(STORAGE, JSON.stringify(parsedProblems));
    };
    reader.readAsBinaryString(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRandomFilter = () => {
    if (problems.length === 0) return;
    const shuffled = [...problems].sort(() => Math.random() - 0.5);
    setFilteredProblems(
      shuffled.slice(0, Math.min(randomCount, problems.length))
    );
  };

  const handleReset = () => {
    const saved = localStorage.getItem(STORAGE);

    if (saved) {
      const parsed = JSON.parse(saved);
      setFilteredProblems(parsed);
    }
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto">
        {/* Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-4 border-dashed rounded-xl p-12 mb-8 text-center transition-all ${
            isDragging
              ? "border-purple-400 bg-purple-900/30"
              : "border-purple-500/50 bg-slate-800/50"
          }`}
        >
          <Upload className="w-16 h-16 mx-auto mb-4 text-purple-400" />
          <p className="text-xl text-white mb-2">
            Drag & Drop your Excel file here
          </p>
          <p className="text-purple-300 mb-4">or</p>
          <label className="inline-block">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileInput}
              className="hidden"
            />
            <span className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg cursor-pointer transition-colors inline-block">
              Browse Files
            </span>
          </label>
        </div>

        {/* Controls */}
        {problems.length > 0 && (
          <div className="bg-slate-800/70 rounded-xl p-6 mb-6 flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <label className="text-white font-medium">Random Count:</label>
              <select
                value={randomCount}
                onChange={(e) => setRandomCount(Number(e.target.value))}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </div>
            <button
              onClick={handleRandomFilter}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <Shuffle className="w-5 h-5" />
              Random Filter
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              Reset
            </button>
            <div className="ml-auto text-purple-300">
              Showing {filteredProblems.length} of {problems.length} problems
            </div>
          </div>
        )}

        {/* Table */}
        {filteredProblems.length > 0 && (
          <div className="bg-slate-800/70 rounded-xl overflow-hidden shadow-2xl max-h-[45vh] overflow-y-auto">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-purple-900/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200 uppercase tracking-wider">
                      Problem Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200 uppercase tracking-wider">
                      Revision Count
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredProblems.map((problem, index) => (
                    <tr
                      key={index}
                      className="hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <a
                          href={generateLeetCodeUrl(problem.problemName)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 hover:underline font-medium transition-colors"
                        >
                          {problem.problemName}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            problem.status.toLowerCase() === "solved"
                              ? "bg-green-900/50 text-green-300"
                              : problem.status.toLowerCase() === "unsolved"
                              ? "bg-red-900/50 text-red-300"
                              : "bg-yellow-900/50 text-yellow-300"
                          }`}
                        >
                          {problem.status}
                        </span>
                      </td>
                      <td className="flex gap-3 px-6 py-4 text-white font-medium">
                        <Minus
                          className="cursor-pointer hover:text-red-400"
                          onClick={() => handleCount(problem, "minus")}
                        />
                        {problem.revisionCount}
                        <PlusIcon
                          className="cursor-pointer hover:text-green-400"
                          onClick={() => handleCount(problem, "plus")}
                        />
                      </td>
                      <td className="text-white font-medium">{problem.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {problems.length === 0 && (
          <div className="text-center text-purple-300 mt-12">
            <p className="text-lg">Upload an Excel file to get started!</p>
            <p className="text-sm mt-2">
              Expected columns: Problem, Status, Revision Count
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
