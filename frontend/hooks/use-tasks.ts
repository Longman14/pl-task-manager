"use client";

import { useCallback, useEffect, useState } from "react";
import { taskApi, ApiRequestError } from "@/lib/api";
import { Task } from "@/lib/types";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await taskApi.list();
      setTasks(data);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createTask = useCallback(async (payload: Partial<Task>) => {
    const created = await taskApi.create(payload);
    setTasks((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateTask = useCallback(async (id: string, payload: Partial<Task>) => {
    const updated = await taskApi.update(id, payload);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    const prev = tasks;
    setTasks((current) => current.filter((t) => t.id !== id));
    try {
      await taskApi.remove(id);
    } catch (err) {
      setTasks(prev); // roll back on failure
      throw err;
    }
  }, [tasks]);

  return { tasks, isLoading, error, reload: load, createTask, updateTask, deleteTask };
}
