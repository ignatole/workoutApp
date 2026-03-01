import { headers } from "next/headers";

const cache = new Map<string, { count: number; timestamp: number }>();

// Simple in-memory rate limiter based on IP
export async function checkRateLimit(limit: number = 30, windowMs: number = 60000) {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown-ip";

    const now = Date.now();
    const windowStart = now - windowMs;

    const record = cache.get(ip);

    if (!record || record.timestamp < windowStart) {
        // First request or window expired
        cache.set(ip, { count: 1, timestamp: now });
        return { success: true };
    }

    if (record.count >= limit) {
        return { success: false, error: "Too many requests. Please try again later." };
    }

    // Increment count
    record.count++;
    cache.set(ip, record);

    return { success: true };
}
