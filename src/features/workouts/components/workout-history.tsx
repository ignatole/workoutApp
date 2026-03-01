"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, ChevronUp } from "lucide-react";

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

export function WorkoutHistory({ workouts }: { workouts: any[] }) {
    // Keep track of which months and weeks are collapsed. True = collapsed.
    const [collapsedMonths, setCollapsedMonths] = useState<Record<string, boolean>>({});
    const [collapsedWeeks, setCollapsedWeeks] = useState<Record<string, boolean>>({});

    const toggleMonth = (monthKey: string) => {
        setCollapsedMonths(prev => ({ ...prev, [monthKey]: !prev[monthKey] }));
    };

    const toggleWeek = (weekKey: string) => {
        setCollapsedWeeks(prev => ({ ...prev, [weekKey]: !prev[weekKey] }));
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
                                                    {weekData.workouts.map((workout: any) => (
                                                        <Link href={`/workout/${workout._id}`} key={workout._id} className="block">
                                                            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer hover:bg-zinc-800">
                                                                <div>
                                                                    <h3 className="font-medium text-zinc-100">{workout.nombre_rutina}</h3>
                                                                    <div className="flex items-center gap-3 mt-1.5 text-sm text-zinc-500">
                                                                        <span>{formatDate(workout.fecha)}</span>
                                                                        <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                                                                        <span>Vol. {calculateVolume(workout.ejercicios)} kg</span>
                                                                    </div>
                                                                </div>
                                                                <ChevronRight className="w-5 h-5 text-zinc-600" />
                                                            </div>
                                                        </Link>
                                                    ))}
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
        </div>
    );
}
