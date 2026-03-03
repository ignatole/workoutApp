import { useState, useEffect } from "react";

export function usePersistentState<T>(key: string, initialValue: T) {
    const [state, setState] = useState<T>(initialValue);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                setState(JSON.parse(item));
            }
        } catch (error) {
            console.error("Error reading localStorage", error);
        }
    }, [key]);

    useEffect(() => {
        if (isMounted) {
            try {
                window.localStorage.setItem(key, JSON.stringify(state));
            } catch (error) {
                console.error("Error setting localStorage", error);
            }
        }
    }, [key, state, isMounted]);

    const clearState = () => {
        try {
            window.localStorage.removeItem(key);
            setState(initialValue);
        } catch (error) {
            console.error("Error removing from localStorage", error);
        }
    };

    return [state, setState, isMounted, clearState] as const;
}
