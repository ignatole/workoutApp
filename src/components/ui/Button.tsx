import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "giant" | "secondary" | "ghost" | "icon"
    size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
                    {
                        "bg-accent text-zinc-50 hover:bg-accent-hover": variant === "default",
                        "bg-accent text-zinc-50 hover:bg-accent-hover w-full text-lg py-6 shadow-lg shadow-indigo-500/20": variant === "giant",
                        "bg-zinc-800 text-zinc-100 hover:bg-zinc-700": variant === "secondary",
                        "hover:bg-zinc-800 hover:text-zinc-50": variant === "ghost",
                        "bg-transparent text-zinc-400 hover:text-zinc-100": variant === "icon",
                        "h-12 px-4 py-2": size === "default" && variant !== "giant",
                        "h-9 rounded-xl px-3": size === "sm",
                        "h-14 rounded-2xl px-8": size === "lg",
                        "h-10 w-10": size === "icon",
                    },
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
