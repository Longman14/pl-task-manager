import { Router } from "express";
import { taskController } from "../controllers/task.controller";
import { validateBody, validateParams, validateQuery } from "../middleware/validate";
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
  listQuerySchema,
} from "../validators/task.validator";

const router = Router();

router.get("/", validateQuery(listQuerySchema), taskController.getAll);
router.get("/:id", validateParams(taskIdSchema), taskController.getById);
router.post("/", validateBody(createTaskSchema), taskController.create);
router.patch(
  "/:id",
  validateParams(taskIdSchema),
  validateBody(updateTaskSchema),
  taskController.update
);
router.delete("/:id", validateParams(taskIdSchema), taskController.remove);

export default router;
