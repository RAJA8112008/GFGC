export function normalizeLanguage(raw) {
  if (!raw) return "cpp";

  const value = raw.toLowerCase();

  if (value.includes("c++") || value === "cpp") return "cpp";
  if (value.includes("python")) return "python";
  if (value.includes("java")) return "java";
  if (value.includes("javascript")) return "javascript";

  return "cpp";
}

export function formatPayload(raw) {
  return {
    repositoryId: raw.repositoryId,
    problemName: raw.problemName || "Untitled Problem",
    difficulty: raw.difficulty || "Easy",
    language: raw.language || "cpp",
    topic: raw.topic || ["GFG"],
    code: raw.code || "",
    problemUrl: raw.problemUrl || window.location.href,
  };
}