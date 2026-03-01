"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// Hardcoded simple PIN for personal use. 
// In a real app, this should be in an environment variable (e.g., process.env.APP_PIN).
const APP_PIN = process.env.APP_PIN;

export async function login(pin: string) {
    if (pin === APP_PIN) {
        const cookieStore = await cookies();
        cookieStore.set("auth_token", "authenticated", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: "/",
        });

        revalidatePath("/");
        return { success: true };
    }

    return { success: false, error: "PIN incorrecto" };
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    revalidatePath("/");
    return { success: true };
}
