import { getRecentWorkouts } from "../actions/workout-actions";
import { WorkoutHistoryServer } from "./workout-history-server";
import { SearchX } from "lucide-react";
import { connection } from "next/server";

export async function WorkoutHistoryStream() {
    await connection();
    const workouts = await getRecentWorkouts();

    if (workouts.length === 0) {
        return (
            <div className="text-center py-10 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-zinc-500">
                <SearchX className="w-8 h-8 mb-3 opacity-50" />
                <p>No hay entrenamientos todavía.</p>
                <p className="text-sm mt-1">¡Arrancá tu primera rutina!</p>
            </div>
        );
    }

    return <WorkoutHistoryServer workouts={workouts} />;
}
