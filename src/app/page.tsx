import { StartWorkoutButton } from "@/features/workouts/components/start-workout-button";
import { Calendar, SearchX } from "lucide-react";
import { getRecentWorkouts } from "@/features/workouts/actions/workout-actions";
import { WorkoutHistory } from "@/features/workouts/components/workout-history";
import { LogoutButton } from "@/components/ui/logout-button";

export default async function Home() {
  const recentWorkouts = await getRecentWorkouts();

  return (
    <main className="min-h-screen p-4 pb-20 max-w-md mx-auto flex flex-col">
      {/* Header */}
      <header className="pt-8 pb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-50">Mis Entrenamientos</h1>
          <p className="text-zinc-400 mt-1">¿Listo para romperla hoy?</p>
        </div>
        <LogoutButton />
      </header>

      <div className="mt-4 mb-10">
        <StartWorkoutButton />
      </div>

      {/* Recent Activity */}
      <section className="flex-1">
        <h2 className="text-lg font-semibold text-zinc-300 mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          Historial
        </h2>

        {recentWorkouts.length === 0 ? (
          <div className="text-center py-10 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-zinc-500">
            <SearchX className="w-8 h-8 mb-3 opacity-50" />
            <p>No hay entrenamientos todavía.</p>
            <p className="text-sm mt-1">¡Arrancá tu primera rutina!</p>
          </div>
        ) : (
          <WorkoutHistory workouts={recentWorkouts} />
        )}
      </section>
    </main>
  );
}
