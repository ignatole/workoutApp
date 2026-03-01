import { getWorkoutById } from "@/features/workouts/actions/workout-actions";
import Link from "next/link";
import { ChevronLeft, Calendar } from "lucide-react";
import { notFound } from "next/navigation";

export default async function WorkoutDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const workout = await getWorkoutById(id);

    if (!workout) {
        return notFound();
    }

    const formatDate = (dateString: Date) => {
        return new Intl.DateTimeFormat('es-AR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(dateString));
    };

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
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 px-4 py-6">
                <div className="flex items-center gap-2 text-zinc-400 mb-8 bg-zinc-900 border border-zinc-800 rounded-xl p-3">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                    <span className="text-sm capitalize">{formatDate(workout.fecha)}</span>
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
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 px-1 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                            <div className="w-6 sm:w-8 shrink-0 text-center">Set</div>
                            <div className="flex-1 min-w-0 text-center">Peso</div>
                            <div className="flex-1 min-w-0 text-center">Reps</div>
                            <div className="w-12 shrink-0 text-center">Fallo</div>
                        </div>

                        {/* Sets List */}
                        <div className="space-y-2 mb-2">
                            {exercise.series.map((set, setIndex) => (
                                <div key={setIndex} className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5 sm:gap-2 py-2 border-b border-zinc-800/50 last:border-0">
                                        <div className="w-6 sm:w-8 shrink-0 text-center text-zinc-400 font-medium text-sm">
                                            {setIndex + 1}
                                        </div>
                                        <div className="flex-1 min-w-0 text-center text-zinc-100 font-medium">
                                            {set.peso} <span className="text-[10px] text-zinc-500 font-normal">kg</span>
                                        </div>
                                        <div className="flex-1 min-w-0 text-center text-zinc-100 font-medium">
                                            {set.reps} <span className="text-[10px] text-zinc-500 font-normal">reps</span>
                                        </div>
                                        <div className="w-12 shrink-0 flex justify-center">
                                            {set.al_fallo ? (
                                                <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-zinc-900 shadow-sm" />
                                            ) : (
                                                <div className="w-3 h-3 rounded-full bg-zinc-700/50 border border-zinc-600" />
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
