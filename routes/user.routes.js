import { Router } from "express";

import {
  listarUsuarios,
  desactivarUsuario,
  activarUsuario,
  cambiarRol,
} from "../controllers/user.controller.js";

import { protegerRuta, permitirRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/admin/usuarios",
  protegerRuta,
  permitirRoles("administrador", "superadministrador"),
  listarUsuarios,
);

router.post(
  "/admin/usuarios/:id/desactivar",
  protegerRuta,
  permitirRoles("administrador", "superadministrador"),
  desactivarUsuario,
);

router.post(
  "/admin/usuarios/:id/activar",
  protegerRuta,
  permitirRoles("administrador", "superadministrador"),
  activarUsuario,
);

router.post(
  "/admin/usuarios/:id/rol",
  protegerRuta,
  permitirRoles("administrador", "superadministrador"),
  cambiarRol,
);

export default router;
