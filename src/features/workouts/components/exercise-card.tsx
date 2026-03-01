"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SetRow } from "./set-row";
import type { ExerciseData, SetData } from "../types";

interface ExerciseCardProps {
    exercise: ExerciseData;
    onUpdate: (updates: Partial<ExerciseData>) => void;
    onDelete?: () => void;
    canDelete?: boolean;
}

export function ExerciseCard({ exercise, onUpdate, onDelete, canDelete = true }: ExerciseCardProps) {
    const [openComments, setOpenComments] = useState<Record<string, boolean>>({});

    const addSet = () => {
        onUpdate({
            series: [
                ...exercise.series,
                { id: Date.now().toString(), peso: "", reps: "", al_fallo: false, comentario: "" }
            ]
        });
    };

    const deleteSet = (setIdToRemove: string) => {
        onUpdate({
            series: exercise.series.filter(s => s.id !== setIdToRemove)
        });
    };

    const updateSet = (setId: string, updates: Partial<SetData>) => {
        onUpdate({
            series: exercise.series.map(s => s.id === setId ? { ...s, ...updates } : s)
        });
    };

    const toggleComment = (setId: string) => {
        setOpenComments(prev => ({ ...prev, [setId]: !prev[setId] }));
    };

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 sm:p-5 shadow-sm mb-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 pr-4">
                    <Input
                        value={exercise.nombre}
                        onChange={(e) => onUpdate({ nombre: e.target.value })}
                        className="text-xl font-bold text-zinc-100 bg-transparent border-transparent px-0 h-auto py-1 shadow-none focus-visible:ring-0 focus-visible:border-indigo-500 rounded-none w-full truncate border-b border-b-transparent hover:border-b-zinc-800"
                    />
                    <Input
                        value={exercise.comentario_ejercicio}
                        onChange={(e) => onUpdate({ comentario_ejercicio: e.target.value })}
                        placeholder="Comentario general (opcional)"
                        className="mt-2 h-9 text-sm bg-transparent border-transparent px-0 border-b-zinc-800 rounded-none focus-visible:ring-0 focus-visible:border-indigo-500 shadow-none hover:border-zinc-700 text-zinc-400 focus-visible:text-zinc-100"
                    />
                </div>
                {canDelete && (
                    <button
                        onClick={onDelete}
                        className="text-zinc-500 hover:text-red-400 p-2 shrink-0 transition-colors rounded-full hover:bg-zinc-800"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Sets Header Labels */}
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 px-1 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                <div className="w-6 sm:w-8 shrink-0 text-center">Set</div>
                <div className="flex-1 min-w-0 text-center">Peso</div>
                <div className="flex-1 min-w-0 text-center">Reps</div>
                <div className="w-12 shrink-0 text-center">Fallo</div>
                <div className="w-[66px] shrink-0"></div> {/* Space for Comment & Trash buttons */}
            </div>

            {/* Sets List */}
            <div className="space-y-4 mb-5">
                {exercise.series.map((set, index) => (
                    <SetRow
                        key={set.id}
                        setNumber={index + 1}
                        data={set}
                        onUpdate={(updates) => updateSet(set.id, updates)}
                        onDelete={exercise.series.length > 1 ? () => deleteSet(set.id) : undefined}
                        showComment={openComments[set.id] || false}
                        onToggleComment={() => toggleComment(set.id)}
                    />
                ))}
                {exercise.series.length === 0 && (
                    <div className="text-center py-4 text-sm text-zinc-500">
                        No hay series. Haz clic en "Añadir Serie" para comenzar.
                    </div>
                )}
            </div>

            {/* Add Set Button */}
            <Button
                variant="secondary"
                size="sm"
                onClick={addSet}
                className="w-full gap-2 text-zinc-300"
            >
                <Plus className="w-4 h-4" />
                Añadir Serie
            </Button>
        </div>
    );
}
