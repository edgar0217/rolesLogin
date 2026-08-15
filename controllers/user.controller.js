import User from "../models/user.model.js";
import { Op } from "sequelize";

export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await User.findAll({
      attributes: {
        exclude: ["contrasena"],
      },
      order: [["id_usuario", "ASC"]],
    });

    return res.render("admin/usuarios", {
      user: req.session.user,
      usuarios,
      error: null,
      success: null,
    });
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);

    return res.status(500).send("Error obteniendo usuarios");
  }
};

export const desactivarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await User.findByPk(id);

    if (!usuario) {
      return res.status(404).send("Usuario no encontrado");
    }

    if (Number(usuario.id_usuario) === Number(req.session.user.id)) {
      return res.status(400).send("No puedes desactivar tu propia cuenta.");
    }

    if (
      req.session.user.rol === "administrador" &&
      usuario.rol === "superadministrador"
    ) {
      return res.status(403).render("errors/403", {
        user: req.session.user,
        mensaje: "No tienes permisos para modificar un superadministrador.",
      });
    }

    usuario.estado = 0;

    await usuario.save();

    return res.redirect("/admin/usuarios");
  } catch (error) {
    console.error("Error desactivando usuario:", error);

    return res.status(500).send("Error desactivando usuario");
  }
};

export const activarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await User.findByPk(id);

    if (!usuario) {
      return res.status(404).send("Usuario no encontrado");
    }

    if (
      req.session.user.rol === "administrador" &&
      usuario.rol === "superadministrador"
    ) {
      return res.status(403).render("errors/403", {
        user: req.session.user,
        mensaje: "No tienes permisos para modificar un superadministrador.",
      });
    }

    usuario.estado = 1;

    await usuario.save();

    return res.redirect("/admin/usuarios");
  } catch (error) {
    console.error("Error activando usuario:", error);

    return res.status(500).send("Error activando usuario");
  }
};

export const cambiarRol = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    const rolesValidos = [
      "usuario",
      "cliente",
      "administrador",
      "superadministrador",
    ];

    if (!rolesValidos.includes(rol)) {
      return res.status(400).send("Rol no válido");
    }

    const usuario = await User.findByPk(id);

    if (!usuario) {
      return res.status(404).send("Usuario no encontrado");
    }

    if (Number(usuario.id_usuario) === Number(req.session.user.id)) {
      return res.status(400).send("No puedes modificar tu propio rol.");
    }

    if (
      req.session.user.rol === "administrador" &&
      usuario.rol === "superadministrador"
    ) {
      return res.status(403).render("errors/403", {
        user: req.session.user,
        mensaje: "No tienes permisos para modificar un superadministrador.",
      });
    }

    if (
      req.session.user.rol === "administrador" &&
      rol === "superadministrador"
    ) {
      return res.status(403).render("errors/403", {
        user: req.session.user,
        mensaje: "Solamente un superadministrador puede asignar este rol.",
      });
    }

    usuario.rol = rol;

    await usuario.save();

    return res.redirect("/admin/usuarios");
  } catch (error) {
    console.error("Error cambiando rol:", error);

    return res.status(500).send("Error cambiando rol");
  }
};
