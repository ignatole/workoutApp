"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Plus, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ExerciseCard } from "@/features/workouts/components/exercise-card";
import type { ExerciseData } from "@/features/workouts/types";
import { saveWorkout } from "@/features/workouts/actions/workout-actions";
import { Input } from "@/components/ui/Input";
import { usePersistentState } from "@/hooks/use-persistent-state";

export default function WorkoutSession() {
    const router = useRouter();
    const [seconds, setSeconds, isSecondsMounted, clearSeconds] = usePersistentState("workout_seconds", 0);
    const [routineName, setRoutineName, isRoutineMounted, clearRoutineName] = usePersistentState("workout_routineName", "Nueva Rutina");

    const defaultExercise: ExerciseData = {
        id: "default-exercise",
        nombre: "",
        comentario_ejercicio: "",
        series: [
            { id: "default-set-1", peso: "", reps: "", al_fallo: false, comentario: "" }
        ]
    };

    const [exercises, setExercises, isExercisesMounted, clearExercises] = usePersistentState<ExerciseData[]>("workout_exercises", [defaultExercise]);
    const [isFinished, setIsFinished] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const isMounted = isSecondsMounted && isRoutineMounted && isExercisesMounted;

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
        setExercises([...exercises, {
            id: Date.now().toString(),
            nombre: "",
            comentario_ejercicio: "",
            series: [{ id: Date.now().toString() + "1", peso: "", reps: "", al_fallo: false, comentario: "" }]
        }]);
    };

    const updateExercise = (exerciseId: string, updates: Partial<ExerciseData>) => {
        setExercises(exercises.map(ex => ex.id === exerciseId ? { ...ex, ...updates } : ex));
    };

    const handleFinishWorkout = async () => {
        const hasEmptyExerciseName = exercises.some(ex => !ex.nombre.trim());
        if (hasEmptyExerciseName) {
            alert("Por favor asegúrate de que todos los ejercicios tengan un nombre.");
            return;
        }

        setIsSaving(true);

        try {
            const payload = {
                nombre_rutina: routineName,
                ejercicios: exercises.map(ex => ({
                    nombre: ex.nombre,
                    comentario_ejercicio: ex.comentario_ejercicio,
                    series: ex.series.map(s => ({
                        peso: Number(s.peso) || 0,
                        reps: Number(s.reps) || 0,
                        al_fallo: s.al_fallo,
                        comentario: s.comentario
                    }))
                }))
            };

            const result = await saveWorkout(payload);

            if (result.success) {
                clearSeconds();
                clearRoutineName();
                clearExercises();
                router.push('/');
            } else {
                alert("Error al guardar el entrenamiento. Verifica tus datos de conexión a la BD.");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isMounted) {
        return (
            <main className="min-h-screen pb-24 max-w-md mx-auto flex flex-col pt-16 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
            </main>
        );
    }

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
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Link href="/" className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <div className="flex-1 min-w-0">
                        <Input
                            value={routineName}
                            onChange={(e) => setRoutineName(e.target.value)}
                            className="text-lg font-bold text-zinc-50 leading-tight bg-transparent border-transparent p-0 h-auto focus-visible:ring-0 focus-visible:border-none w-full truncate shadow-none border-b-transparent hover:border-b-zinc-800 rounded-none cursor-text"
                        />
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
                        exercise={exercise}
                        onUpdate={(updates) => updateExercise(exercise.id, updates)}
                        onDelete={() => {
                            setExercises(exercises.filter(e => e.id !== exercise.id));
                        }}
                        canDelete={exercises.length > 1}
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
                    disabled={isSaving || exercises.length === 0}
                    className="bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20 disabled:shadow-none disabled:bg-zinc-800 disabled:text-zinc-500 disabled:opacity-100 text-white w-full h-16 text-lg font-bold gap-2"
                >
                    {isSaving ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <Check className="w-6 h-6" />
                    )}
                    {isSaving ? "Guardando..." : "Finalizar Entrenamiento"}
                </Button>
            </div>
        </main>
    );
}
