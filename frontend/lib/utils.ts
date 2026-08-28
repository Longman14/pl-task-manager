import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Task } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const STATUS_BAR: Record<Task["status"], string> = {
  TODO: "bg-todo",
  IN_PROGRESS: "bg-progress",
  COMPLETED: "bg-completed",
};

export const PRIORITY_LABEL: Record<Task["priority"], string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};