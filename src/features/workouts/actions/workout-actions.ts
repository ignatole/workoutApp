"use server";

import dbConnect from "@/core/db/db-connect";
import Workout from "@/features/workouts/models/workout-schema";
import type { IWorkout } from "@/features/workouts/types";
import { revalidatePath } from "next/cache";
import { checkRateLimit } from "@/core/security/rate-limit";
import { auth } from "@/core/security/auth";
import { unstable_cache } from "next/cache";

const getCachedRecentWorkouts = unstable_cache(
    async (userEmail: string) => {
        await dbConnect();
        const workouts = await Workout.find({ userEmail })
            .sort({ fecha: -1 })
            .limit(10)
            .select('nombre_rutina fecha tipo duracion_horas ejercicios.series.peso ejercicios.series.reps comentario')
            .lean();
        return JSON.parse(JSON.stringify(workouts));
    },
    ['recent-workouts'],
    {
        tags: ['workouts'],
        revalidate: 60 * 5,
    }
);

export async function getRecentWorkouts() {
    try {
        const session = await auth();
        if (!session?.user?.email) return [];

        return await getCachedRecentWorkouts(session.user.email) as (IWorkout & { _id: string })[];
    } catch (error) {
        console.error("Error fetching workouts:", error);
        return [];
    }
}

export async function saveWorkout(workoutData: any) {
    try {
        const session = await auth();
        if (!session?.user?.email) return { success: false, error: "Unauthorized" };

        const rateLimit = await checkRateLimit(10); // Max 10 saves per minute
        if (!rateLimit.success) return { success: false, error: rateLimit.error };

        await dbConnect();

        const newWorkout = new Workout({ ...workoutData, userEmail: session.user.email });
        await newWorkout.save();

        revalidatePath("/"); // Refresh the dashboard cache

        return { success: true, id: newWorkout._id.toString() };
    } catch (error) {
        console.error("Error saving workout:", error);
        return { success: false, error: "Failed to save workout" };
    }
}

export async function getWorkoutById(id: string) {
    try {
        const session = await auth();
        if (!session?.user?.email) return null;

        await dbConnect();

        const workout = await Workout.findOne({ _id: id, userEmail: session.user.email }).lean();

        if (!workout) return null;

        // Convert MongoDB documents to plain objects serializeable by Next.js Server Actions
        return JSON.parse(JSON.stringify(workout)) as (IWorkout & { _id: string });
    } catch (error) {
        console.error("Error fetching workout by id:", error);
        return null;
    }
}

export async function updateWorkoutComment(id: string, comentario: string) {
    try {
        const session = await auth();
        if (!session?.user?.email) return { success: false, error: "Unauthorized" };

        const rateLimit = await checkRateLimit(15);
        if (!rateLimit.success) return { success: false, error: rateLimit.error };

        await dbConnect();

        const updatedWorkout = await Workout.findOneAndUpdate(
            { _id: id, userEmail: session.user.email },
            { comentario },
            { new: true }
        );

        if (!updatedWorkout) {
            return { success: false, error: "Workout not found" };
        }

        // We don't need to revalidate the main dashboard just for a comment update,
        // because the dashboard list doesn't show the `comentario` field.

        return { success: true };
    } catch (error) {
        console.error("Error updating workout comment:", error);
        return { success: false, error: "Failed to update comment" };
    }
}

export async function deleteWorkout(id: string) {
    try {
        const session = await auth();
        if (!session?.user?.email) return { success: false, error: "Unauthorized" };

        const rateLimit = await checkRateLimit(10);
        if (!rateLimit.success) return { success: false, error: rateLimit.error };

        await dbConnect();

        const deletedWorkout = await Workout.findOneAndDelete({ _id: id, userEmail: session.user.email });

        if (!deletedWorkout) {
            return { success: false, error: "Workout not found" };
        }

        revalidatePath("/");

        return { success: true };
    } catch (error) {
        console.error("Error deleting workout:", error);
        return { success: false, error: "Failed to delete workout" };
    }
}
