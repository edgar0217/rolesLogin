import { Router } from "express";

import {
  mostrarLogin,
  mostrarRegister,
  register,
  login,
  logout,
  mostrarDashboard,
  mostrarForgotPassword,
  enviarCodigo,
  mostrarVerifyCode,
  mostrarResetPassword,
  verificarCodigo,
  resetPassword,
} from "../controllers/auth.controller.js";

import { protegerRuta, soloInvitados } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/login", soloInvitados, mostrarLogin);
router.post("/login", soloInvitados, login);
router.get("/register", soloInvitados, mostrarRegister);
router.post("/register", soloInvitados, register);
router.get("/forgot-password", mostrarForgotPassword);
router.post("/forgot-password", enviarCodigo);
router.get("/verify-code", mostrarVerifyCode);
router.post("/verify-code", verificarCodigo);
router.get("/reset-password", mostrarResetPassword);
router.post("/reset-password", resetPassword);
router.get("/dashboard", protegerRuta, mostrarDashboard);
router.get("/logout", protegerRuta, logout);

export default router;
