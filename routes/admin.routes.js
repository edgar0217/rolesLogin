import { Router } from "express";

import { protegerRuta, permitirRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/admin",
  protegerRuta,
  permitirRoles("administrador", "superadministrador"),
  (req, res) => {
    return res.render("admin/dashboard", {
      user: req.session.user,
    });
  },
);

export default router;
