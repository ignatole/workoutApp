import mongoose, { Schema, Document, Model } from 'mongoose';
import type { ISet, IExercise, IWorkout } from '../types';

// --- Mongoose Document Types ---
interface ISetDocument extends ISet, Document { }
interface IExerciseDocument extends IExercise, Document { }
interface IWorkoutDocument extends IWorkout, Document { }

// --- Schemas ---
const SetSchema = new Schema<ISetDocument>({
    peso: { type: Number, required: true },
    reps: { type: Number, required: true },
    al_fallo: { type: Boolean, required: true, default: false },
    comentario: { type: String, required: false },
}, { _id: false });

const ExerciseSchema = new Schema<IExerciseDocument>({
    nombre: { type: String, required: true },
    comentario_ejercicio: { type: String, required: false },
    series: { type: [SetSchema], required: true, default: [] },
});

const WorkoutSchema = new Schema<IWorkoutDocument>({
    userEmail: { type: String, required: true },
    fecha: { type: Date, required: true, default: Date.now },
    nombre_rutina: { type: String, required: true },
    ejercicios: { type: [ExerciseSchema], required: true, default: [] },
    tipo: { type: String, enum: ["rutina", "clase"], default: "rutina" },
    duracion_horas: { type: Number, required: false },
    comentario: { type: String, required: false },
});

WorkoutSchema.index({ userEmail: 1, fecha: -1 });
WorkoutSchema.index({ _id: 1, userEmail: 1 });

// --- Model Export ---
const Workout: Model<IWorkoutDocument> = mongoose.models.Workout || mongoose.model<IWorkoutDocument>('Workout', WorkoutSchema);

export default Workout;
