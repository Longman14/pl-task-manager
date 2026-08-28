import { NextFunction, Request, Response } from "express";
import { taskService } from "../services/task.services";

export const taskController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const status = req.query.status as string | undefined;
      const tasks = await taskService.getAll(status);
      res.json({ success: true, data: tasks });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try {
      const task = await taskService.getById(req.params.id);
      res.json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await taskService.create(req.body);
      res.status(201).json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try {
      const task = await taskService.update(req.params.id, req.body);
      res.json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  },

  remove: async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    try {
      await taskService.remove(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
