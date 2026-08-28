import { ApiResponse, TaskStatus, Task } from "./types";


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export class ApiRequestError extends Error {
  errors?: { path: string; message: string }[];
  status: number;

  constructor(message: string, status: number, errors?: { path: string; message: string }[]) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });

  if (res.status === 204) return undefined as T;

  const body: ApiResponse<T> = await res.json().catch(() => ({ success: false }));

  if (!res.ok || !body.success) {
    throw new ApiRequestError(body.message || "Something went wrong", res.status, body.errors);
  }

  return body.data as T;
}

export const taskApi = {
  list: (status?: TaskStatus) =>
    request<Task[]>(`/tasks${status ? `?status=${status}` : ""}`),

  create: (payload: Partial<Task>) =>
    request<Task>("/tasks", { method: "POST", body: JSON.stringify(payload) }),

  update: (id: string, payload: Partial<Task>) =>
    request<Task>(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),

  remove: (id: string) => request<void>(`/tasks/${id}`, { method: "DELETE" }),
};
