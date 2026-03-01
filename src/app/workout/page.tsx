"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, MoreVertical, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ExerciseCard } from "@/components/workout/ExerciseCard";

export default function WorkoutSession() {
    const [seconds, setSeconds] = useState(0);

    const [exercises, setExercises] = useState([
        { id: 1, name: "Press de Banca" },
        { id: 2, name: "Fondos de Tríceps" }
    ]);
    const [isFinished, setIsFinished] = useState(false);

    // Simple Timer
    useEffect(() => {
        if (isFinished) return;

        const interval = setInterval(() => {
            setSeconds(s => s + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [isFinished]);

    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleAddExercise = () => {
        setExercises([...exercises, { id: Date.now(), name: "Nuevo Ejercicio" }]);
    };

    const handleFinishWorkout = () => {
        setIsFinished(true);
    };

    if (isFinished) {
        return (
            <main className="min-h-screen p-4 flex flex-col items-center justify-center text-center max-w-md mx-auto">
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                    <Check className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">¡Entrenamiento Completado!</h1>
                <p className="text-zinc-400 mb-8">Gran trabajo hoy. Tu tiempo fue de {formatTime(seconds)}.</p>
                <Link href="/" className="w-full">
                    <Button variant="giant" className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white">
                        Volver al Inicio
                    </Button>
                </Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen pb-24 max-w-md mx-auto flex flex-col pt-16">
            {/* Sticky Header */}
            <header className="fixed top-0 left-0 right-0 max-w-md mx-auto bg-zinc-950/90 backdrop-blur-md z-50 border-b border-zinc-900 px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold text-zinc-50 leading-tight">Empuje</h1>
                        <div className="text-emerald-400 font-mono text-sm font-semibold tracking-wider">
                            {formatTime(seconds)}
                        </div>
                    </div>
                </div>
            </header>

            {/* Exercises Container */}
            <div className="flex-1 px-4 py-6">
                {exercises.map((exercise) => (
                    <ExerciseCard
                        key={exercise.id}
                        exerciseName={exercise.name}
                        onDelete={() => {
                            setExercises(exercises.filter(e => e.id !== exercise.id));
                        }}
                    />
                ))}

                {/* Add Exercise */}
                <Button
                    variant="ghost"
                    onClick={handleAddExercise}
                    className="w-full mt-2 h-14 border border-zinc-800 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Añadir Ejercicio
                </Button>
            </div>

            {/* Finish CTA Container */}
            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent">
                <Button
                    variant="giant"
                    onClick={handleFinishWorkout}
                    className="bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20 text-white w-full h-16 text-lg font-bold gap-2"
                >
                    <Check className="w-6 h-6" />
                    Finalizar Entrenamiento
                </Button>
            </div>
        </main>
    );
}
