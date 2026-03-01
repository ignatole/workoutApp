"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteWorkout } from "../actions/workout-actions";

export function DeleteWorkoutButton({ workoutId }: { workoutId: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("¿Estás seguro de que deseas eliminar este entrenamiento?")) return;

        setIsDeleting(true);
        const res = await deleteWorkout(workoutId);
        setIsDeleting(false);

        if (res.success) {
            router.push("/");
            router.refresh();
        } else {
            alert("Error al eliminar el entrenamiento: " + res.error);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-red-400 disabled:opacity-50"
            aria-label="Eliminar entrenamiento"
        >
            <Trash2 className="w-5 h-5" />
        </button>
    );
}
