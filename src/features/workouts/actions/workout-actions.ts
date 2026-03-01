"use server";

import dbConnect from "@/core/db/db-connect";
import Workout from "@/features/workouts/models/workout-schema";
import type { IWorkout } from "@/features/workouts/types";
import { revalidatePath } from "next/cache";

export async function getRecentWorkouts() {
    try {
        await dbConnect();

        const workouts = await Workout.find({})
            .sort({ fecha: -1 })
            .limit(10)
            .lean();

        // Convert MongoDB documents to plain objects serializeable by Next.js Server Actions
        return JSON.parse(JSON.stringify(workouts)) as (IWorkout & { _id: string })[];
    } catch (error) {
        console.error("Error fetching workouts:", error);
        return [];
    }
}

export async function saveWorkout(workoutData: any) {
    try {
        await dbConnect();

        const newWorkout = new Workout(workoutData);
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
        await dbConnect();

        const workout = await Workout.findById(id).lean();

        if (!workout) return null;

        // Convert MongoDB documents to plain objects serializeable by Next.js Server Actions
        return JSON.parse(JSON.stringify(workout)) as (IWorkout & { _id: string });
    } catch (error) {
        console.error("Error fetching workout by id:", error);
        return null;
    }
}
