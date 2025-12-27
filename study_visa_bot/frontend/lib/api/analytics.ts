import { API_BASE_URL } from "../config";

export async function fetchStats() {
    const res = await fetch(`${API_BASE_URL}/analytics/stats`);
    if (!res.ok) throw new Error("Failed to fetch stats");
    return res.json();
}

export async function fetchChatStream() {
    const res = await fetch(`${API_BASE_URL}/analytics/stream`);
    if (!res.ok) throw new Error("Failed to fetch stream");
    return res.json();
}
