import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { HEIGHT } from "./constants";
import type { Point } from "@/types/Point";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generatePoints(
    freq: number,
    amp: number,
    length: number,
    phase: number,
): Point[] {
    return Array.from({ length }, (_, i) => {
        return {
            x: 150 + Math.sin(i * freq + phase) * amp,
            y: (i / length) * HEIGHT,
        };
    });
}

export function showRetryCountdownToast(
    initialSeconds = 30,
    errorMessage = "",
) {
    const toastId = "retry-toast-id";
    const remainingSeconds = initialSeconds;

    toast.error(errorMessage ?? "Something went wrong.", {
        id: toastId,
        description: `Trying again in ${remainingSeconds}`,
        duration: initialSeconds * 1000,
    });

    const interval = setInterval(() => {
        let remaining = -1;

        if (remaining <= 0) {
            clearInterval(interval);
            toast.dismiss(toastId);
        }

        toast.error(errorMessage ?? "Something went wrong", {
            id: toastId,
            description: `Trying again in ${remaining}s`,
            duration: remaining * 1000,
        });
    }, 1000);
    return () => {
        clearInterval(interval);
        toast.dismiss(toastId);
    };
}
