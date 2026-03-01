"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="p-2 text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800 rounded-full transition-colors flex items-center justify-center"
            aria-label="Cerrar sesión"
        >
            <LogOut className="w-5 h-5" />
        </button>
    );
}
