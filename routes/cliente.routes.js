import { Router } from "express";

import { protegerRuta, permitirRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/cliente",
  protegerRuta,
  permitirRoles("cliente", "administrador", "superadministrador"),
  (req, res) => {
    return res.render("cliente/dashboard", {
      user: req.session.user,
    });
  },
);

export default router;
