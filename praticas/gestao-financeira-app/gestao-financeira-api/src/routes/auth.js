import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

// A secret key should ideally be in .env, but for this tutorial we hardcode it or provide a fallback
const JWT_SECRET = process.env.JWT_SECRET || "gestao-financeira-super-secret";

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Nome, email e senha são obrigatórios" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "E-mail já cadastrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    
    res.status(201).json({ user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (e) {
    next(e);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    
    res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (e) {
    next(e);
  }
});

export default router;
