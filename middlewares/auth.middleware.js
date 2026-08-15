import User from "../models/user.model.js";

export const protegerRuta = async (req, res, next) => {
  try {
    if (!req.session || !req.session.user) {
      return res.redirect("/login");
    }

    const user = await User.findByPk(req.session.user.id);

    if (!user) {
      return req.session.destroy(() => {
        res.redirect("/login");
      });
    }

    if (Number(user.estado) !== 1) {
      return req.session.destroy(() => {
        res.redirect("/login");
      });
    }

    req.session.user = {
      id: user.id_usuario,
      nombre: user.nombre_completo,
      usuario: user.usuario,
      correo: user.correo,
      rol: user.rol,
      estado: user.estado,
    };

    next();
  } catch (error) {
    console.error("Error verificando sesión:", error);

    return res.redirect("/login");
  }
};

export const permitirRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.redirect("/login");
    }

    const { rol } = req.session.user;

    if (!rolesPermitidos.includes(rol)) {
      return res.status(403).render("errors/403", {
        user: req.session.user,
        mensaje: "No tienes permisos para acceder a esta página.",
      });
    }

    next();
  };
};

export const soloInvitados = (req, res, next) => {
  if (!req.session?.user) {
    return next();
  }

  const { rol } = req.session.user;

  switch (rol) {
    case "superadministrador":
      return res.redirect("/superadmin");

    case "administrador":
      return res.redirect("/admin");

    case "cliente":
      return res.redirect("/cliente");

    case "usuario":
    default:
      return res.redirect("/dashboard");
  }
};
