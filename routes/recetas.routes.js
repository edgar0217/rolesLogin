import { Router } from "express";

import protegerRuta from "../middlewares/auth.middleware.js";

import {
  mostrarDashboard,
  mostrarRecetas,
  mostrarReceta,
} from "../controllers/receta.controller.js";

const router = Router();

router.get("/dashboard", protegerRuta, mostrarDashboard);
router.get("/recetas", protegerRuta, mostrarRecetas);
router.get("/recetas/:id", protegerRuta, mostrarReceta);

export default router;
