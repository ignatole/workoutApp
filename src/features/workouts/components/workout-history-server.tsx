import { WorkoutHistoryClient } from "./workout-history";

// Helper to get the week number in a month
const getWeekOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return Math.ceil((date.getDate() + firstDay) / 7);
};

function groupWorkouts(workouts: any[]) {
    const groups: Record<string, Record<string, {
        workouts: any[];
        firstDateStr: string;
        lastDateStr: string;
        firstDate: number;
        lastDate: number;
        count: number;
    }>> = {};

    workouts.forEach((workout) => {
        const date = new Date(workout.fecha);
        const monthYear = new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' }).format(date);
        const capitalizedMonthYear = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);

        const week = `Semana ${getWeekOfMonth(date)}`;

        if (!groups[capitalizedMonthYear]) groups[capitalizedMonthYear] = {};
        if (!groups[capitalizedMonthYear][week]) {
            groups[capitalizedMonthYear][week] = {
                workouts: [],
                firstDateStr: "",
                lastDateStr: "",
                firstDate: date.getTime(),
                lastDate: date.getTime(),
                count: 0
            };
        }

        const weekData = groups[capitalizedMonthYear][week];
        // Convert the _id to string just in case
        const safeWorkout = {
            ...workout,
            _id: workout._id.toString()
        };
        weekData.workouts.push(safeWorkout);
        weekData.count += 1;

        if (date.getTime() < weekData.firstDate) weekData.firstDate = date.getTime();
        if (date.getTime() > weekData.lastDate) weekData.lastDate = date.getTime();
    });

    // Formatting dates and cleaning up timestamps for the client
    Object.entries(groups).forEach(([month, weeks]) => {
        Object.entries(weeks).forEach(([week, data]) => {
            data.firstDateStr = new Date(data.firstDate).toISOString();
            data.lastDateStr = new Date(data.lastDate).toISOString();
        });
    });

    return groups;
}

export function WorkoutHistoryServer({ workouts }: { workouts: any[] }) {
    const groupedData = groupWorkouts(workouts);
    return <WorkoutHistoryClient groupedData={groupedData} />;
}
