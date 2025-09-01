export default function getCurrentBrowser(userAgent?: string) {
  // Use provided userAgent (server) or navigator.userAgent (client)
  const ua =
    userAgent || (typeof navigator !== "undefined" ? navigator.userAgent : "");

  if (!ua) return "server"; // fallback for server-side calls

  if (ua.includes("Edg")) return "Microsoft Edge";
  if (ua.includes("Firefox")) return "Mozilla Firefox";
  if (ua.includes("Chrome")) return "Google Chrome";
  if (ua.includes("Safari")) return "Apple Safari";
  if (ua.includes("Opera")) return "Opera";

  return "Unknown";
}
