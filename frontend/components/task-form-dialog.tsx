"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ApiRequestError } from "@/lib/api";

import { Task } from "@/lib/types";
import { FormErrors, TaskFormValues, validateTaskForm } from "@/lib/validation";

const EMPTY: TaskFormValues = {
  title: "",
  description: "",
  status: "TODO",
  priority: "MEDIUM",
  dueDate: "",
};

function toFormValues(task?: Task | null): TaskFormValues {
  if (!task) return EMPTY;
  return {
    title: task.title,
    description: task.description ?? "",
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
  };
}

export function TaskFormDialog({
  open,
  task,
  onClose,
  onSubmit,
}: {
  open: boolean;
  task?: Task | null;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => Promise<unknown>;
}) {
  const [values, setValues] = useState<TaskFormValues>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setValues(toFormValues(task));
      setErrors({});
      setSubmitError(null);
    }
  }, [open, task]);

  function set<K extends keyof TaskFormValues>(key: K, value: TaskFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fieldErrors = validateTaskForm(values);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit(values);
      onClose();
    } catch (err) {
      if (err instanceof ApiRequestError && err.errors?.length) {
        const serverErrors: FormErrors = {};
        for (const e of err.errors) {
          serverErrors[e.path as keyof TaskFormValues] = e.message;
        }
        setErrors(serverErrors);
      } else {
        setSubmitError(err instanceof Error ? err.message : "Couldn't save this task");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={task ? "Edit task" : "New task"}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Write the API docs"
            aria-invalid={!!errors.title}
          />
          {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Optional details"
            aria-invalid={!!errors.description}
          />
          {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="status">Status</Label>
            <Select  value={values.status} onValueChange={(val) => set("status", val as TaskFormValues["status"])}>
              <SelectTrigger className="p-2 text-sm lg:text-lg w-full" id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className={"p-2"}>
                <SelectItem value="TODO">To do</SelectItem>
                <SelectItem value="IN_PROGRESS">In progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="priority">Priority</Label>
            <Select value={values.priority} onValueChange={(val) => set("priority", val as TaskFormValues["priority"])}>
              <SelectTrigger className="p-2 text-sm lg:text-lg w-full" id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="p-2 capitalise">
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="dueDate">Due date</Label>
          <Input
            id="dueDate"
            min={new Date().toISOString().split('T')[0]}
            className="p-3"
            type="date"
            value={values.dueDate}
            onChange={(e) => set("dueDate", e.target.value)}
            aria-invalid={!!errors.dueDate}
          />
          {errors.dueDate && <p className="text-xs text-red-500">{errors.dueDate}</p>}
        </div>

        {submitError && (
          <p className="rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-500">{submitError}</p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button className="p-4 cursor-pointer" type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className="p-4 cursor-pointer" 
            type="submit" 
            disabled={isSubmitting || !values.title.trim() || !values.status || !values.priority || !values.dueDate}
          >
            {isSubmitting ? "Saving…" : task ? "Save changes" : "Create task"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
