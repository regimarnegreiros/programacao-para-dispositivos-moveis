import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../schemas/categorySchema.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();
router.use(authMiddleware);

// GET /categories - lista todas as categorias
router.get("/", async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { OR: [{ isDefault: true }, { userId: req.userId }] },
      orderBy: { displayName: "asc" },
    });
    res.json(categories);
  } catch (e) { next(e); }
});

// POST /categories - cria uma nova categoria
router.post("/", async (req, res, next) => {
  try {
    const data = createCategorySchema.parse(req.body);
    const category = await prisma.category.create({ data: { ...data, userId: req.userId } });
    res.status(201).json(category);
  } catch (e) { next(e); }
});

// PUT /categories/:id - atualiza categoria existente
router.put("/:id", async (req, res, next) => {
  try {
    const data = updateCategorySchema.parse(req.body);
    const existing = await prisma.category.findUnique({ where: { id: req.params.id } });
    if (!existing || (existing.userId !== req.userId && !existing.isDefault)) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }
    if (existing.isDefault) {
      return res.status(403).json({ error: "Categorias padrão não podem ser alteradas" });
    }
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data,
    });
    res.json(category);
  } catch (e) { next(e); }
});

// DELETE /categories/:id - remove categoria (bloqueia se for padrão)
router.delete("/:id", async (req, res, next) => {
  try {
    const existing = await prisma.category.findUnique({
      where: { id: req.params.id },
    });
    if (!existing || (existing.userId !== req.userId && !existing.isDefault)) return res.status(404).json({ error: "Categoria não encontrada" });
    if (existing.isDefault) {
      return res.status(400).json({ error: "Categorias padrão não podem ser excluídas" });
    }
    await prisma.category.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (e) { next(e); }
});

export default router;
