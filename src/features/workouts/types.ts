// src/features/workouts/types.ts

export type SetData = {
    id: string;
    peso: number | "";
    reps: number | "";
    al_fallo: boolean;
    comentario: string;
};

export type ExerciseData = {
    id: string;
    nombre: string;
    comentario_ejercicio: string;
    series: SetData[];
};

export interface ISet {
    peso: number;
    reps: number;
    al_fallo: boolean;
    comentario?: string;
}

export interface IExercise {
    nombre: string;
    comentario_ejercicio?: string;
    series: ISet[];
}

export interface IWorkout {
    fecha: Date;
    nombre_rutina: string;
    ejercicios: IExercise[];
    tipo?: "rutina" | "clase";
    duracion_horas?: number;
    comentario?: string;
}
