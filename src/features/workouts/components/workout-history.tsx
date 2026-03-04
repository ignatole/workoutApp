"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, ChevronUp, X, Save, Trash2, Calendar, Clock, Activity, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { updateWorkoutComment, deleteWorkout } from "../actions/workout-actions";

// Helper to get the week range (Monday to Sunday)
const getWeekRange = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const formatDayMonth = (dateObj: Date) => `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;
    return `${formatDayMonth(monday)} al ${formatDayMonth(sunday)}`;
};

const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    const dateStr = `${date.getDate()}/${date.getMonth() + 1}`;

    let weekdayStr = new Intl.DateTimeFormat('es-AR', { weekday: 'long' }).format(date);
    weekdayStr = weekdayStr.charAt(0).toUpperCase() + weekdayStr.slice(1);

    return `${dateStr} - ${weekdayStr}`;
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

            const week = `Semana del ${getWeekRange(date)}`;

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
                    <div key={monthYear} className="space-y-4">
                        <button
                            onClick={() => toggleMonth(monthYear)}
                            className="w-full flex items-center justify-between py-3 px-4 bg-zinc-900/40 rounded-2xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 transition-colors"
                        >
                            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-300">{monthYear}</h3>
                            <div className="bg-zinc-800/50 p-1.5 rounded-full">
                                {isMonthCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                            </div>
                        </button>

                        <div className={`grid transition-all duration-300 ease-in-out ${isMonthCollapsed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'}`}>
                            <div className="overflow-hidden space-y-6 px-1">
                                {Object.entries(weeks).map(([week, weekData]) => {
                                    const weekKey = `${monthYear}-${week}`;
                                    const isWeekCollapsed = collapsedWeeks[weekKey];

                                    return (
                                        <div key={weekKey} className="space-y-3 relative before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-zinc-800/60 ml-1">
                                            <button
                                                onClick={() => toggleWeek(weekKey)}
                                                className="w-full flex items-center justify-between text-left group pl-8 relative"
                                            >
                                                {/* Line node indicator */}
                                                <div className="absolute left-[7px] top-1/2 -translate-y-1/2 w-[9px] h-[9px] rounded-full bg-zinc-800 border-2 border-zinc-950 group-hover:bg-indigo-500 transition-colors z-10" />

                                                <div>
                                                    <h4 className="text-sm font-semibold text-zinc-200 group-hover:text-indigo-400 transition-colors">{week}</h4>
                                                    <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1.5 font-medium">
                                                        <Activity className="w-3 h-3" />
                                                        {weekData.count} entreno{weekData.count !== 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                                <div className="text-zinc-600 group-hover:text-zinc-300 p-2 transition-colors">
                                                    {isWeekCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                                                </div>
                                            </button>

                                            <div className={`grid transition-all duration-300 ease-in-out pl-8 ${isWeekCollapsed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'}`}>
                                                <div className="overflow-hidden space-y-3 pt-1">
                                                    {weekData.workouts.map((workout: any) => {
                                                        const isClass = workout.tipo === "clase";
                                                        const CardAccentColor = isClass ? "bg-indigo-500" : "bg-emerald-500";
                                                        const CardBorderColor = isClass ? "border-indigo-500/20" : "border-emerald-500/20";
                                                        const CardHoverBorder = isClass ? "group-hover:border-indigo-500/40" : "group-hover:border-emerald-500/40";
                                                        const AccentBadgeBg = isClass ? "bg-indigo-500/10 text-indigo-400" : "bg-emerald-500/10 text-emerald-400";

                                                        const workoutCard = (
                                                            <div className={`group relative bg-zinc-900/60 backdrop-blur-sm border ${CardBorderColor} ${CardHoverBorder} rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-all hover:bg-zinc-800/80 hover:shadow-lg hover:shadow-black/20 overflow-hidden`}>
                                                                {/* Indicator Ribbon */}
                                                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${CardAccentColor} opacity-70 group-hover:opacity-100 transition-opacity`} />

                                                                <div className="pl-2">
                                                                    <h3 className="font-semibold text-zinc-100 text-base mb-2 group-hover:text-white transition-colors">{workout.nombre_rutina}</h3>
                                                                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[13px] text-zinc-500 font-medium">
                                                                        <div className="flex items-center gap-1.5 bg-zinc-950/50 px-2 py-0.5 rounded-md border border-zinc-800/50">
                                                                            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                                                                            <span>{formatDate(workout.fecha)}</span>
                                                                        </div>

                                                                        {isClass && (
                                                                            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md ${AccentBadgeBg}`}>
                                                                                <Clock className="w-3.5 h-3.5" />
                                                                                <span>{formatDuration(workout.duracion_horas || 0)}</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="w-8 h-8 rounded-full bg-zinc-800/50 group-hover:bg-zinc-700 flex items-center justify-center transition-colors">
                                                                    <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                                                                </div>
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
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Class Details Modal */}
            {selectedClass && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="absolute inset-0" onClick={() => setSelectedClass(null)} />
                    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-sm overflow-hidden flex flex-col shadow-2xl relative animate-in zoom-in-95 duration-300">
                        {/* Header Image/Gradient Block */}
                        <div className="h-24 bg-gradient-to-br from-indigo-900/40 via-zinc-900 to-zinc-950 border-b border-indigo-500/10 relative p-5 flex flex-col justify-end">
                            <div className="absolute top-3 right-3 flex items-center gap-2">
                                <button
                                    onClick={handleDeleteClass}
                                    disabled={isDeleting}
                                    className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors bg-zinc-950/50 p-2 rounded-full backdrop-blur-sm border border-zinc-800/50 disabled:opacity-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setSelectedClass(null)}
                                    className="text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors bg-zinc-950/50 p-2 rounded-full backdrop-blur-sm border border-zinc-800/50"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold tracking-wider uppercase mb-1">
                                <Activity className="w-3.5 h-3.5" />
                                Clase de Funcional
                            </div>
                        </div>

                        <div className="px-6 py-5">
                            <h2 className="text-2xl font-bold text-white mb-1">{selectedClass.nombre_rutina}</h2>
                            <div className="flex items-center gap-2 text-sm text-zinc-400 font-medium mb-6">
                                <Calendar className="w-4 h-4" />
                                {formatDate(selectedClass.fecha)}
                            </div>

                            <div className="flex items-center justify-between bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-4 mb-6 relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl" />
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-indigo-400" />
                                    </div>
                                    <span className="text-zinc-300 font-semibold tracking-wide text-sm">Duración</span>
                                </div>
                                <span className="text-2xl font-black text-indigo-400">{formatDuration(selectedClass.duracion_horas || 0)}</span>
                            </div>

                            <div className="space-y-3 mb-6">
                                <label className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                                    <User className="w-4 h-4 text-zinc-500" />
                                    Notas Personales
                                </label>
                                <textarea
                                    value={classComment}
                                    onChange={(e) => setClassComment(e.target.value)}
                                    placeholder="¿Cómo te sentiste? ¿Algo que mejorar?"
                                    className="w-full flex min-h-[120px] rounded-xl border border-zinc-800/60 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all shadow-inner shadow-black/20"
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
