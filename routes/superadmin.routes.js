import { Router } from "express";

import { protegerRuta, permitirRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/superadmin",
  protegerRuta,
  permitirRoles("superadministrador"),
  (req, res) => {
    return res.render("superadmin/dashboard", {
      user: req.session.user,
    });
  },
);

export default router;
