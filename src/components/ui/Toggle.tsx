"use client";

import * as React from "react";
import { cn } from "./Button";

interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    className?: string;
    label?: string;
}

export function Toggle({ checked, onChange, className, label }: ToggleProps) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={cn(
                "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                checked ? "bg-indigo-500 text-white" : "bg-zinc-800 text-zinc-400",
                className
            )}
        >
            <span className="sr-only">{label || "Toggle"}</span>
            <span
                className={cn(
                    "pointer-events-none absolute left-0.5 inline-block h-6 w-6 rounded-full bg-white shadow-lg ring-0 transition-transform",
                    checked ? "translate-x-5" : "translate-x-0"
                )}
            />
        </button>
    );
}
