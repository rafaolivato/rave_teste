import express from "express";
import { criarPerfil } from "../controllers/perfilController.js";

const router = express.Router();

router.post("/", criarPerfil);

export default router;
