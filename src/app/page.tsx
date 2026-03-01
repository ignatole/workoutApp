import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Dumbbell, Calendar, ChevronRight } from "lucide-react";

export default function Home() {
  const recentWorkouts = [
    { id: 1, name: "Empuje (Pecho/Tríceps)", date: "Ayer", volume: "12,450 kg" },
    { id: 2, name: "Tracción (Espalda/Bíceps)", date: "Hace 3 días", volume: "14,200 kg" },
    { id: 3, name: "Pierna (Énfasis Cuádriceps)", date: "Hace 5 días", volume: "18,900 kg" },
  ];

  return (
    <main className="min-h-screen p-4 pb-20 max-w-md mx-auto flex flex-col">
      {/* Header */}
      <header className="pt-8 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-50">Mis Entrenamientos</h1>
        <p className="text-zinc-400 mt-1">¿Listo para romperla hoy?</p>
      </header>

      <div className="mt-4 mb-10">
        <Link href="/workout" className="w-full">
          <Button variant="giant" className="gap-3 h-16 w-full rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-lg flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.3)] mx-auto">
            <Dumbbell className="w-6 h-6" />
            Empezar Entrenamiento
          </Button>
        </Link>
      </div>

      {/* Recent Activity */}
      <section className="flex-1">
        <h2 className="text-lg font-semibold text-zinc-300 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          Historial Reciente
        </h2>

        <div className="space-y-3">
          {recentWorkouts.map((workout) => (
            <div
              key={workout.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer hover:bg-zinc-800"
            >
              <div>
                <h3 className="font-medium text-zinc-100">{workout.name}</h3>
                <div className="flex items-center gap-3 mt-1.5 text-sm text-zinc-500">
                  <span>{workout.date}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                  <span>Volumen: {workout.volume}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-600" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
