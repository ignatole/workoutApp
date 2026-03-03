import { StartWorkoutButton } from "@/features/workouts/components/start-workout-button";
import { Calendar } from "lucide-react";
import { LogoutButton } from "@/components/ui/logout-button";
import { Suspense } from "react";
import { WorkoutHistoryStream } from "@/features/workouts/components/workout-history-stream";

function HistorySkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-20 bg-zinc-900 border border-zinc-800 rounded-2xl animate-pulse" />
      ))}
    </div>
  );
}

export default function Home() {
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

        <Suspense fallback={<HistorySkeleton />}>
          <WorkoutHistoryStream />
        </Suspense>
      </section>
    </main>
  );
}
