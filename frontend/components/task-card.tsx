"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Task } from "@/lib/types";
import { cn, PRIORITY_LABEL, STATUS_BAR } from "@/lib/utils";



function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  const dueDate = formatDate(task.dueDate);
  const overdue = task.dueDate && task.status !== "COMPLETED" && new Date(task.dueDate) < new Date();

  return (
    <Card className="group relative overflow-hidden pl-3">
      <span className={cn("absolute left-0 top-0 h-full w-1", STATUS_BAR[task.status])} aria-hidden="true" />
      <div className="flex items-start justify-between gap-2 p-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">{task.title}</p>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-xs text-">{task.description}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-500">
            <span>{PRIORITY_LABEL[task.priority]}</span>
            {dueDate && (
              <span className={cn(overdue && "font-medium text-red-500")}>
                {overdue ? "Overdue " : "Due "}
                {dueDate}
              </span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
          <Button variant="ghost" size="icon" onClick={() => onEdit(task)} aria-label="Edit task">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(task)} aria-label="Delete task">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
