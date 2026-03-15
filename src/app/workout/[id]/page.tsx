import { getWorkoutById } from "@/features/workouts/actions/workout-actions";
import Link from "next/link";
import { ChevronLeft, Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import { DeleteWorkoutButton } from "@/features/workouts/components/delete-workout-button";

const parseWorkoutDate = (dateVal: string | Date) => {
    if (!dateVal) return new Date();
    const d = new Date(dateVal);
    const dateStr = typeof dateVal === 'string' ? dateVal : d.toISOString();

    if (dateStr.includes('T00:00:00.000Z') || dateStr.includes('T00:00:00.000+00:00')) {
        return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 12, 0, 0);
    }
    return d;
};

export default async function WorkoutDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const workout = await getWorkoutById(id);

    if (!workout) {
        return notFound();
    }

    const dateObj = parseWorkoutDate(workout.fecha);

    // Format just the date part (e.g., "lunes, 3 de marzo de 2026")
    const dateStr = new Intl.DateTimeFormat('es-AR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(dateObj);

    // Format times
    const formatTime = (d: Date) => new Intl.DateTimeFormat('es-AR', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(d);

    const endTimeStr = formatTime(dateObj);

    let timeRangeStr = endTimeStr;
    if (workout.duracion_horas) {
        const startTimeObj = new Date(dateObj.getTime() - workout.duracion_horas * 3600 * 1000);
        const startTimeStr = formatTime(startTimeObj);
        timeRangeStr = `${startTimeStr} - ${endTimeStr}`;
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
                        <h1 className="text-lg font-bold text-zinc-50 leading-tight truncate">
                            {workout.nombre_rutina}
                        </h1>
                    </div>
                    <DeleteWorkoutButton workoutId={workout._id} />
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 px-4 py-6">
                <div className="flex items-center gap-2 text-zinc-400 mb-8 bg-zinc-900 border border-zinc-800 rounded-xl p-3">
                    <Calendar className="w-5 h-5 text-indigo-400 shrink-0" />
                    <span className="text-sm">
                        <span className="capitalize">{dateStr}</span>
                        <span className="mx-2 text-zinc-600">•</span>
                        <span className="font-medium text-zinc-300">{timeRangeStr}</span>
                    </span>
                </div>

                {workout.ejercicios.map((exercise, exIndex) => (
                    <div key={exIndex} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 sm:p-5 shadow-sm mb-6">
                        {/* Header */}
                        <div className="mb-4">
                            <h2 className="text-xl font-bold text-zinc-100">{exercise.nombre}</h2>
                            {exercise.comentario_ejercicio && (
                                <p className="text-sm text-zinc-400 mt-1 italic">"{exercise.comentario_ejercicio}"</p>
                            )}
                        </div>

                        {/* Sets Header Labels */}
                        <div className="flex items-center mb-2 px-1 text-[11px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-950/30 rounded-lg py-2">
                            <div className="w-12 shrink-0 text-center">Set</div>
                            <div className="flex-1 min-w-0 text-center border-l border-zinc-800/80">Peso</div>
                            <div className="flex-1 min-w-0 text-center border-l border-zinc-800/80">Reps</div>
                            <div className="w-16 shrink-0 text-center border-l border-zinc-800/80">Fallo</div>
                        </div>

                        {/* Sets List */}
                        <div className="space-y-1.5 mb-2">
                            {exercise.series.map((set, setIndex) => (
                                <div key={setIndex} className="flex flex-col gap-1">
                                    <div className="flex items-center py-2.5 bg-zinc-900/50 border border-zinc-800/60 rounded-xl hover:bg-zinc-800/50 transition-colors">
                                        <div className="w-12 shrink-0 text-center text-zinc-400 font-bold text-xs">
                                            {setIndex + 1}
                                        </div>
                                        <div className="flex-1 min-w-0 text-center text-zinc-100 font-semibold text-sm border-l border-zinc-800/50 flex flex-col items-center justify-center">
                                            {set.peso} <span className="text-[9px] text-zinc-500 font-medium uppercase tracking-widest mt-0.5">kg</span>
                                        </div>
                                        <div className="flex-1 min-w-0 text-center text-zinc-100 font-semibold text-sm border-l border-zinc-800/50 flex flex-col items-center justify-center">
                                            {set.reps} <span className="text-[9px] text-zinc-500 font-medium uppercase tracking-widest mt-0.5">reps</span>
                                        </div>
                                        <div className="w-16 shrink-0 flex justify-center border-l border-zinc-800/50">
                                            {set.al_fallo ? (
                                                <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] border border-red-400/50" />
                                            ) : (
                                                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700" />
                                            )}
                                        </div>
                                    </div>
                                    {set.comentario && (
                                        <div className="pl-8 sm:pl-10 text-xs text-indigo-300 bg-indigo-500/10 rounded-lg p-2 mb-1">
                                            {set.comentario}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
