"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Dumbbell, Plus, X, Minus } from "lucide-react";
import { saveWorkout } from "../actions/workout-actions";

export function StartWorkoutButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isClassMode, setIsClassMode] = useState(false);
    const [durationMins, setDurationMins] = useState(60);
    const [classNameInput, setClassNameInput] = useState("");
    const [classComment, setClassComment] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [savedDuration, setSavedDuration] = useState(0);
    const router = useRouter();

    const formatDuration = (mins: number) => {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        if (h > 0 && m > 0) return `${h}h ${m}m`;
        if (h > 0) return `${h} hora${h > 1 ? 's' : ''}`;
        return `${m} min`;
    };

    const handleSaveClass = async () => {
        if (!classNameInput.trim()) {
            alert("Por favor ingresa un nombre para la actividad.");
            return;
        }

        if (durationMins <= 0) {
            alert("Por favor ingresa una cantidad de horas válida.");
            return;
        }

        setIsSaving(true);
        const res = await saveWorkout({
            nombre_rutina: classNameInput.trim(),
            ejercicios: [],
            tipo: "clase",
            duracion_horas: durationMins / 60,
            comentario: classComment.trim() || undefined,
        });

        setIsSaving(false);

        if (res.success) {
            setSavedDuration(durationMins);
            setShowSuccess(true);
            setIsClassMode(false);
            setDurationMins(60);
            setClassNameInput("");
            setClassComment("");
            router.refresh();
        } else {
            alert("Error al guardar la clase");
        }
    };

    return (
        <>
            <Button
                variant="giant"
                className="gap-3 h-16 w-full rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-lg flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.3)] mx-auto"
                onClick={() => setIsOpen(true)}
            >
                <Plus className="w-6 h-6" />
                Empezar Entrenamiento
            </Button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-sm overflow-hidden flex flex-col shadow-2xl relative">
                        <div className="p-5 border-b border-zinc-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-zinc-100">
                                {showSuccess ? "¡Guardado!" : "Nuevo Entrenamiento"}
                            </h2>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setIsClassMode(false);
                                    setShowSuccess(false);
                                }}
                                className="text-zinc-500 hover:text-zinc-300 transition-colors bg-zinc-800/50 hover:bg-zinc-800 p-2 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            {showSuccess ? (
                                <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-300 py-4">
                                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white tracking-tight">Clase Guardada</h3>
                                        <p className="text-zinc-400 mt-2 text-sm max-w-[250px] mx-auto leading-relaxed">
                                            Registraste exitosamente <span className="text-zinc-200 font-semibold">{formatDuration(savedDuration)}</span> de actividad.
                                        </p>
                                    </div>
                                    <Button
                                        className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium h-12 mt-6"
                                        onClick={() => {
                                            setIsOpen(false);
                                            setShowSuccess(false);
                                        }}
                                    >
                                        Cerrar
                                    </Button>
                                </div>
                            ) : !isClassMode ? (
                                <>
                                    <Button
                                        className="w-full h-14 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 justify-start px-5 gap-4 rounded-xl border border-zinc-700/50"
                                        onClick={() => {
                                            setIsOpen(false);
                                            router.push("/workout");
                                        }}
                                    >
                                        <div className="bg-indigo-500/20 p-2 rounded-lg">
                                            <Dumbbell className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <div className="flex flex-col items-start translate-y-[2px]">
                                            <span className="font-semibold">Entrenamiento Libre</span>
                                            <span className="text-xs text-zinc-400 font-normal">Registrar ejercicios y series</span>
                                        </div>
                                    </Button>

                                    <Button
                                        className="w-full h-14 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 justify-start px-5 gap-4 rounded-xl border border-zinc-700/50"
                                        onClick={() => setIsClassMode(true)}
                                    >
                                        <div className="bg-emerald-500/20 p-2 rounded-lg">
                                            <Plus className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <div className="flex flex-col items-start translate-y-[2px]">
                                            <span className="font-semibold">Clase / Deporte</span>
                                            <span className="text-xs text-zinc-400 font-normal">Solo registrar tiempo invertido</span>
                                        </div>
                                    </Button>
                                </>
                            ) : (
                                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-zinc-300 ml-1">Nombre de la Actividad</label>
                                        <Input
                                            type="text"
                                            placeholder="Ej: Yoga, Boxeo, Fútbol"
                                            value={classNameInput}
                                            onChange={(e) => setClassNameInput(e.target.value)}
                                            className="text-lg bg-zinc-950/50 border-zinc-700/50 focus-visible:ring-emerald-500 h-14"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-zinc-300 ml-1">Duración (horas)</label>
                                        <div className="flex items-center justify-between bg-zinc-950/50 border border-zinc-700/50 rounded-xl px-2 h-14">
                                            <button
                                                type="button"
                                                onClick={() => setDurationMins(Math.max(15, durationMins - 15))}
                                                className="p-2 text-zinc-400 hover:text-zinc-100 disabled:opacity-50 transition-colors"
                                                disabled={durationMins <= 15}
                                            >
                                                <Minus className="w-5 h-5" />
                                            </button>
                                            <span className="text-lg font-medium text-zinc-100 select-none">
                                                {formatDuration(durationMins)}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setDurationMins(durationMins + 15)}
                                                className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-zinc-300 ml-1">Comentario (Opcional)</label>
                                        <Input
                                            type="text"
                                            placeholder="¿Cómo te fue en la clase?"
                                            value={classComment}
                                            onChange={(e) => setClassComment(e.target.value)}
                                            className="text-lg bg-zinc-950/50 border-zinc-700/50 focus-visible:ring-emerald-500 h-14"
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <Button
                                            variant="ghost"
                                            className="flex-1 bg-transparent border border-zinc-700 text-zinc-300 hover:bg-zinc-800 h-12"
                                            onClick={() => {
                                                setIsClassMode(false);
                                                setDurationMins(60);
                                                setClassNameInput("");
                                                setClassComment("");
                                            }}
                                        >
                                            Volver
                                        </Button>
                                        <Button
                                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium h-12"
                                            onClick={handleSaveClass}
                                            disabled={isSaving || !classNameInput.trim()}
                                        >
                                            {isSaving ? "Guardando..." : "Guardar Clase"}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
