"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, ChevronUp, X, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { updateWorkoutComment, deleteWorkout } from "../actions/workout-actions";

// Helper to get the week number in a month
const getWeekOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return Math.ceil((date.getDate() + firstDay) / 7);
};

const formatDate = (dateString: string | Date) => {
    return new Intl.DateTimeFormat('es-AR', {
        day: 'numeric',
        month: 'short',
    }).format(new Date(dateString));
};

const calculateVolume = (ejercicios: any[]) => {
    let volume = 0;
    ejercicios.forEach(ex => {
        ex.series.forEach((set: any) => {
            volume += (set.peso || 0) * (set.reps || 0);
        });
    });
    return volume.toLocaleString();
};

const formatDuration = (hours: number) => {
    const mins = Math.round(hours * 60);
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h} hora${h > 1 ? 's' : ''}`;
    return `${m} min`;
};

export function WorkoutHistory({ workouts }: { workouts: any[] }) {
    // Keep track of which months and weeks are collapsed. True = collapsed.
    const [collapsedMonths, setCollapsedMonths] = useState<Record<string, boolean>>({});
    const [collapsedWeeks, setCollapsedWeeks] = useState<Record<string, boolean>>({});

    // State for Class Modal
    const [selectedClass, setSelectedClass] = useState<any | null>(null);
    const [classComment, setClassComment] = useState("");
    const [isSavingComment, setIsSavingComment] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const toggleMonth = (monthKey: string) => {
        setCollapsedMonths(prev => ({ ...prev, [monthKey]: !prev[monthKey] }));
    };

    const toggleWeek = (weekKey: string) => {
        setCollapsedWeeks(prev => ({ ...prev, [weekKey]: !prev[weekKey] }));
    };

    const handleSaveComment = async () => {
        if (!selectedClass) return;
        setIsSavingComment(true);
        const res = await updateWorkoutComment(selectedClass._id, classComment);
        setIsSavingComment(false);
        if (res.success) {
            // Update the local state to reflect the new comment without a full reload if possible,
            // but the server action already revalidates the path.
            selectedClass.comentario = classComment;
            setSelectedClass(null);
        } else {
            alert("Error al guardar el comentario: " + res.error);
        }
    };

    const handleDeleteClass = async () => {
        if (!selectedClass || !confirm("¿Estás seguro de que deseas eliminar esta clase?")) return;

        setIsDeleting(true);
        const res = await deleteWorkout(selectedClass._id);
        setIsDeleting(false);

        if (res.success) {
            setSelectedClass(null);
            // The server action will revalidate the path
        } else {
            alert("Error al eliminar la clase: " + res.error);
        }
    };

    // Group workouts
    const groupedData = useMemo(() => {
        const groups: Record<string, Record<string, {
            workouts: any[];
            firstDate: Date;
            lastDate: Date;
            count: number;
        }>> = {};

        workouts.forEach((workout) => {
            const date = new Date(workout.fecha);
            const monthYear = new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' }).format(date);
            const capitalizedMonthYear = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);

            const week = `Semana ${getWeekOfMonth(date)}`;

            if (!groups[capitalizedMonthYear]) groups[capitalizedMonthYear] = {};
            if (!groups[capitalizedMonthYear][week]) {
                groups[capitalizedMonthYear][week] = {
                    workouts: [],
                    firstDate: date,
                    lastDate: date,
                    count: 0
                };
            }

            const weekData = groups[capitalizedMonthYear][week];
            weekData.workouts.push(workout);
            weekData.count += 1;

            // Assume workouts are sorted descending by date, so first element is the latest (last date of week)
            // But we can accurately compare timestamps to be completely safe:
            if (date < weekData.firstDate) weekData.firstDate = date;
            if (date > weekData.lastDate) weekData.lastDate = date;
        });

        return groups;
    }, [workouts]);

    return (
        <div className="space-y-6">
            {Object.entries(groupedData).map(([monthYear, weeks]) => {
                const isMonthCollapsed = collapsedMonths[monthYear];

                return (
                    <div key={monthYear} className="space-y-3">
                        <button
                            onClick={() => toggleMonth(monthYear)}
                            className="w-full flex items-center justify-between py-2 text-zinc-400 hover:text-zinc-200 transition-colors"
                        >
                            <h3 className="text-base font-bold uppercase tracking-wider">{monthYear}</h3>
                            {isMonthCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                        </button>

                        {!isMonthCollapsed && (
                            <div className="space-y-5 px-1">
                                {Object.entries(weeks).map(([week, weekData]) => {
                                    const weekKey = `${monthYear}-${week}`;
                                    const isWeekCollapsed = collapsedWeeks[weekKey];

                                    return (
                                        <div key={weekKey} className="space-y-2 pl-3 border-l-2 border-zinc-800/50">
                                            <button
                                                onClick={() => toggleWeek(weekKey)}
                                                className="w-full flex items-center justify-between text-left"
                                            >
                                                <div>
                                                    <h4 className="text-sm font-semibold text-zinc-300">{week}</h4>
                                                    <p className="text-xs text-zinc-500 mt-0.5">
                                                        {formatDate(weekData.firstDate)} - {formatDate(weekData.lastDate)} • {weekData.count} entreno{weekData.count !== 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                                <div className="text-zinc-500 hover:text-zinc-300 p-1">
                                                    {isWeekCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                                                </div>
                                            </button>

                                            {!isWeekCollapsed && (
                                                <div className="space-y-3 pt-2">
                                                    {weekData.workouts.map((workout: any) => {
                                                        const workoutCard = (
                                                            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer hover:bg-zinc-800">
                                                                <div>
                                                                    <h3 className="font-medium text-zinc-100">{workout.nombre_rutina}</h3>
                                                                    <div className="flex items-center gap-3 mt-1.5 text-sm text-zinc-500">
                                                                        <span>{formatDate(workout.fecha)}</span>
                                                                        <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                                                                        {workout.tipo === "clase" ? (
                                                                            <span>{formatDuration(workout.duracion_horas || 0)}</span>
                                                                        ) : (
                                                                            <span>Vol. {calculateVolume(workout.ejercicios)} kg</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <ChevronRight className="w-5 h-5 text-zinc-600" />
                                                            </div>
                                                        );

                                                        if (workout.tipo === "clase") {
                                                            return (
                                                                <button
                                                                    key={workout._id}
                                                                    className="block w-full text-left"
                                                                    onClick={() => {
                                                                        setSelectedClass(workout);
                                                                        setClassComment(workout.comentario || "");
                                                                    }}
                                                                >
                                                                    {workoutCard}
                                                                </button>
                                                            );
                                                        }

                                                        return (
                                                            <Link href={`/workout/${workout._id}`} key={workout._id} className="block w-full">
                                                                {workoutCard}
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Class Details Modal */}
            {selectedClass && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-sm overflow-hidden flex flex-col shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                            <div>
                                <h2 className="text-xl font-bold text-zinc-100">{selectedClass.nombre_rutina}</h2>
                                <p className="text-sm text-zinc-400 mt-1">{formatDate(selectedClass.fecha)}</p>
                            </div>
                            <div className="flex items-center gap-2 mb-auto">
                                <button
                                    onClick={handleDeleteClass}
                                    disabled={isDeleting}
                                    className="text-zinc-500 hover:text-red-400 transition-colors bg-zinc-800/50 hover:bg-zinc-800 p-2 rounded-full disabled:opacity-50"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setSelectedClass(null)}
                                    className="text-zinc-500 hover:text-zinc-300 transition-colors bg-zinc-800/50 hover:bg-zinc-800 p-2 rounded-full"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-5 space-y-6">
                            <div className="flex items-center justify-between bg-zinc-950/50 border border-zinc-800/50 rounded-2xl p-4">
                                <span className="text-zinc-400 font-medium tracking-wide text-sm uppercase">Duración</span>
                                <span className="text-2xl font-bold text-emerald-400">{formatDuration(selectedClass.duracion_horas || 0)}</span>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-zinc-300 ml-1">Comentario (Opcional)</label>
                                <textarea
                                    value={classComment}
                                    onChange={(e) => setClassComment(e.target.value)}
                                    placeholder="¿Cómo te fue en la clase? ¿Alguna nota extra?"
                                    className="w-full flex min-h-[100px] rounded-xl border border-zinc-800 bg-zinc-950/50 px-3 py-3 text-sm text-zinc-50 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                />
                            </div>

                            <Button
                                className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
                                onClick={handleSaveComment}
                                disabled={isSavingComment || selectedClass.comentario === classComment}
                            >
                                {isSavingComment ? "Guardando..." : "Guardar Comentario"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
