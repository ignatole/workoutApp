"use client";

import { useState } from "react";
import { MessageCircle, Trash2 } from "lucide-react";
import { Input } from "../ui/Input";
import { Toggle } from "../ui/Toggle";

interface SetRowProps {
    setNumber: number;
    onDelete?: () => void;
}

export function SetRow({ setNumber, onDelete }: SetRowProps) {
    const [isFailure, setIsFailure] = useState(false);
    const [showComment, setShowComment] = useState(false);
    const [comment, setComment] = useState("");

    return (
        <div className="flex flex-col gap-2 relative group">
            <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Set Number */}
                <div className="w-6 sm:w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-400 font-semibold text-xs sm:text-sm">
                    {setNumber}
                </div>

                {/* Weight */}
                <div className="flex-1 min-w-0 relative">
                    <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="0"
                        className="pr-6 text-center text-base sm:text-lg font-medium h-11"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 font-medium">
                        kg
                    </span>
                </div>

                {/* Reps */}
                <div className="flex-1 min-w-0 relative">
                    <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        className="pr-8 text-center text-base sm:text-lg font-medium h-11"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 font-medium">
                        reps
                    </span>
                </div>

                {/* To Failure Toggle */}
                <div className="flex items-center justify-center w-12 shrink-0">
                    <Toggle checked={isFailure} onChange={setIsFailure} label="Al Fallo" />
                </div>

                {/* Actions container */}
                <div className="flex shrink-0 gap-0.5">
                    {/* Comment Toggle */}
                    <button
                        onClick={() => setShowComment(!showComment)}
                        className={`w-8 h-10 flex items-center justify-center rounded-xl transition-colors ${showComment || comment ? 'bg-indigo-500/20 text-indigo-400' : 'bg-transparent text-zinc-500 hover:text-zinc-300'}`}
                    >
                        <MessageCircle className="w-4 h-4" />
                    </button>

                    {/* Delete Toggle */}
                    <button
                        onClick={onDelete}
                        className="w-8 h-10 flex items-center justify-center rounded-xl bg-transparent text-zinc-600 hover:text-red-400 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Expanded Comment Input */}
            {showComment && (
                <div className="pl-8 sm:pl-10 pr-1">
                    <Input
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Comentario de serie..."
                        className="text-white h-9 bg-zinc-900 border-zinc-700/50 text-sm"
                    />
                </div>
            )}
        </div>
    );
}
