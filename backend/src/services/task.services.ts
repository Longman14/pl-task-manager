import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

import { CreateTaskInput, UpdateTaskInput } from "../validators/task.validator";


import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });



export const taskService = {
  getAll: (status?: string) =>
    prisma.task.findMany({
      where: status ? { status: status as any } : undefined,
      orderBy: { createdAt: "desc" },
    }),

  getById: (id: string) => prisma.task.findUniqueOrThrow({ where: { id } }),

  create: (data: CreateTaskInput) => prisma.task.create({ data }),

  update: (id: string, data: UpdateTaskInput) => prisma.task.update({ where: { id }, data }),

  remove: (id: string) => prisma.task.delete({ where: { id } }),
};

export default prisma;
