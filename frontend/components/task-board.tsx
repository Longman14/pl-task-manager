"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";



import { useTasks } from "@/hooks/use-tasks";
import { Task, TaskStatus } from "@/lib/types";

import { TaskCard } from "./task-card";
import { TaskFormDialog } from "./task-form-dialog";
import { TaskFormValues } from "@/lib/validation";
import { ConfirmDialog } from "./confirm-dialog";

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: "TODO", label: "To do" },
  { status: "IN_PROGRESS", label: "In progress" },
  { status: "COMPLETED", label: "Completed" },
];

export function TaskBoard() {
  const { tasks, isLoading, error, createTask, updateTask, deleteTask } = useTasks();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const grouped = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = { TODO: [], IN_PROGRESS: [], COMPLETED: [] };
    for (const task of tasks) map[task.status].push(task);
    return map;
  }, [tasks]);

  function openCreate() {
    setEditingTask(null);
    setFormOpen(true);
  }

  function openEdit(task: Task) {
    setEditingTask(task);
    setFormOpen(true);
  }

  async function handleSubmit(values: TaskFormValues) {
    const payload = {
      title: values.title,
      description: values.description || null,
      status: values.status,
      priority: values.priority,
      dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null,
    };
    if (editingTask) {
      await updateTask(editingTask.id, payload);
    } else {
      await createTask(payload);
    }
  }

  return (
    <div className="w-full p-3">
      <div className="mb-8 flex items-end justify-between ">
        <div>
          <h1 className="font-serif font-extrabold text-3xl text-[#224a44]">Welcome to your Task board</h1>
          <p className="mt-1 text-sm text-gray-400">
            {tasks.length} task{tasks.length === 1 ? "" : "s"} across three stages
          </p>
        </div>
        <Button className="p-4 bg-[#224a44] cursor-pointer hover:bg-[#224a44]/90" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          New task
        </Button>
      </div>

      {error && (
        <div className="mb-6 rounded-md border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-500">
          {error}. Kindly refresh page
        </div>
      )}

      {isLoading ? (
        <p className="text-sm gray-500-foreground">Loading tasks…</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {COLUMNS.map((column) => {
            const columnTasks = grouped[column.status];
            return (
              <div key={column.status}>
                <div className="mb-3 flex items-center gap-2">
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-900">
                    {column.label}
                  </h2>
                  <span className="rounded-full bg-black/5 px-1.5 py-0.5 text-[11px] text-gray-600">
                    {columnTasks.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {columnTasks.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-gray-400">
                      Nothing here yet.
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={openEdit}
                        onDelete={setDeletingTask}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <TaskFormDialog
        open={formOpen}
        task={editingTask}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deletingTask}
        title="Delete task"
        description={`Delete "${deletingTask?.title}"? This can't be undone.`}
        onClose={() => setDeletingTask(null)}
        onConfirm={() => deletingTask && deleteTask(deletingTask.id)}
      />
    </div>
  );
}
