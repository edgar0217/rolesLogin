import User from "../models/user.model.js";
import Receta from "../models/receta.model.js";
import bcrypt from "bcrypt";
import transporter from "../config/email.js";

const redirigirPorRol = (res, rol) => {
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

export const mostrarLogin = (req, res) => {
  return res.render("login/login", {
    error: null,
    success: null,
    email: "",
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.render("login/login", {
        error: "Correo electrónico y contraseña son obligatorios",
        success: null,
        email: email || "",
      });
    }

    const correoNormalizado = email.trim().toLowerCase();

    const user = await User.findOne({
      where: {
        email: correoNormalizado,
      },
    });

    if (!user || Number(user.estado) !== 1) {
      return res.render("login/login", {
        error: "Correo electrónico o contraseña incorrectos",
        success: null,
        email: correoNormalizado,
      });
    }

    if (!user.password) {
      console.error(
        `El usuario ${user.id_usuario} no tiene contraseña registrada`,
      );

      return res.render("login/login", {
        error: "Correo electrónico o contraseña incorrectos",
        success: null,
        email: correoNormalizado,
      });
    }

    const passwordCorrecta = await bcrypt.compare(password, user.password);

    if (!passwordCorrecta) {
      return res.render("login/login", {
        error: "Correo electrónico o contraseña incorrectos",
        success: null,
        email: correoNormalizado,
      });
    }

    req.session.user = {
      id: user.id_usuario,
      nombre: user.name,
      username: user.username,
      email: user.email,
      rol: user.rol,
      estado: user.estado,
    };

    req.session.save((error) => {
      if (error) {
        console.error("Error guardando sesión:", error);

        return res.render("login/login", {
          error: "No fue posible iniciar sesión",
          success: null,
          email: correoNormalizado,
        });
      }

      return redirigirPorRol(res, user.rol);
    });
  } catch (error) {
    console.error("Error login:", error);

    return res.render("login/login", {
      error: "Ocurrió un error al iniciar sesión",
      success: null,
      email: email || "",
    });
  }
};
export const mostrarRegister = (req, res) => {
  return res.render("login/register", {
    error: null,
    success: null,
  });
};

export const register = async (req, res) => {
  const { name, username, email, password, confirmPassword } = req.body;

  try {
    if (!name || !username || !email || !password || !confirmPassword) {
      return res.render("login/register", {
        error: "Todos los campos son obligatorios",
        success: null,
      });
    }

    const nameNormalizado = name.trim();
    const usernameNormalizado = username.trim();
    const emailNormalizado = email.trim().toLowerCase();

    if (password !== confirmPassword) {
      return res.render("login/register", {
        error: "Las contraseñas no coinciden",
        success: null,
      });
    }

    if (password.length < 8) {
      return res.render("login/register", {
        error: "La contraseña debe tener al menos 8 caracteres",
        success: null,
      });
    }

    const cuentaPorCorreo = await User.findOne({
      where: {
        email: emailNormalizado,
      },
    });

    const cuentaPorUsuario = await User.findOne({
      where: {
        username: usernameNormalizado,
      },
    });

    if (
      cuentaPorUsuario &&
      (!cuentaPorCorreo ||
        cuentaPorUsuario.id_usuario !== cuentaPorCorreo.id_usuario)
    ) {
      return res.render("login/register", {
        error: "No fue posible completar el registro con estos datos",
        success: null,
      });
    }

    if (cuentaPorCorreo && Number(cuentaPorCorreo.estado) === 1) {
      return res.render("login/register", {
        error: "No fue posible completar el registro con estos datos",
        success: null,
      });
    }

    const contrasenaHash = await bcrypt.hash(password, 12);

    if (cuentaPorCorreo && Number(cuentaPorCorreo.estado) === 0) {
      cuentaPorCorreo.nombre_completo = nombreNormalizado;
      cuentaPorCorreo.username = usernameNormalizado;
      cuentaPorCorreo.password = contrasenaHash;

      cuentaPorCorreo.estado = 1;

      cuentaPorCorreo.rol = "usuario";

      await cuentaPorCorreo.save();

      return res.render("login/login", {
        error: null,
        success: "Registro completado correctamente. Ya puedes iniciar sesión.",
        email: correoNormalizado,
      });
    }

    await User.create({
      name: nameNormalizado,
      username: usernameNormalizado,
      email: emailNormalizado,
      password: contrasenaHash,
      rol: "usuario",
      estado: 1,
    });

    return res.render("login/login", {
      error: null,
      success: "Registro completado correctamente. Ya puedes iniciar sesión.",
      email: emailNormalizado,
    });
  } catch (error) {
    console.error("Error registrando usuario:", error);

    return res.render("login/register", {
      error: "No fue posible completar el registro",
      success: null,
    });
  }
};

export const mostrarDashboard = async (req, res) => {
  try {
    const recetas = await Receta.findAll({
      order: [["id_receta", "DESC"]],
    });

    return res.render("home-menus/dashboard", {
      user: req.session.user,
      recetas,
    });
  } catch (error) {
    console.error("Error dashboard:", error);

    return res.status(500).send("No fue posible cargar el dashboard");
  }
};

export const mostrarForgotPassword = (req, res) => {
  return res.render("forgot-pass/forgot-password", {
    error: null,
    success: null,
  });
};

export const enviarCodigo = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.render("forgot-pass/forgot-password", {
        error: "Ingresa un correo electrónico",
        success: null,
      });
    }

    const correoNormalizado = email.trim().toLowerCase();

    const user = await User.findOne({
      where: {
        email: correoNormalizado,
        estado: 1,
      },
    });

    if (!user) {
      return res.render("forgot-pass/forgot-password", {
        error: null,
        success:
          "Si existe una cuenta asociada a ese correo, recibirás un código de recuperación.",
      });
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = Date.now() + 2 * 60 * 1000;

    req.session.passwordReset = {
      userId: user.id_usuario,
      email: user.email,
      codigo,
      expiresAt,
      verificado: false,
    };

    await transporter.sendMail({
      to: user.email,
      subject: "Código de recuperación",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Recuperación de contraseña</h2>

          <p>Tu código de verificación es:</p>

          <h1 style="letter-spacing: 5px;">
            ${codigo}
          </h1>

          <p>Este código expirará en 2 minutos.</p>

          <p>
            Si no solicitaste este cambio,
            puedes ignorar este correo.
          </p>
        </div>
      `,
    });

    req.session.save((error) => {
      if (error) {
        console.error(error);

        return res.render("forgot-pass/forgot-password", {
          error: "No fue posible procesar la solicitud",
          success: null,
        });
      }

      return res.redirect("/verify-code");
    });
  } catch (error) {
    console.error("Error enviando código:", error);

    return res.render("forgot-pass/forgot-password", {
      error: "No fue posible procesar la solicitud",
      success: null,
    });
  }
};

export const mostrarVerifyCode = (req, res) => {
  if (!req.session.passwordReset) {
    return res.redirect("/forgot-password");
  }

  return res.render("forgot-pass/verify-code", {
    error: null,
    success: null,
  });
};

export const verificarCodigo = async (req, res) => {
  const { codigo } = req.body;

  try {
    const passwordReset = req.session.passwordReset;

    if (!passwordReset) {
      return res.redirect("/forgot-password");
    }

    if (!codigo) {
      return res.render("forgot-pass/verify-code", {
        error: "Ingresa el código",
        success: null,
      });
    }

    if (Date.now() > passwordReset.expiresAt) {
      delete req.session.passwordReset;

      return res.render("forgot-pass/forgot-password", {
        error: "El código ha expirado. Solicita uno nuevo.",
        success: null,
      });
    }

    if (String(codigo).trim() !== String(passwordReset.codigo)) {
      return res.render("forgot-pass/verify-code", {
        error: "Código incorrecto",
        success: null,
      });
    }

    req.session.passwordReset.verificado = true;

    delete req.session.passwordReset.codigo;

    req.session.save((error) => {
      if (error) {
        console.error(error);

        return res.render("forgot-pass/verify-code", {
          error: "No fue posible verificar el código",
          success: null,
        });
      }

      return res.redirect("/reset-password");
    });
  } catch (error) {
    console.error(error);

    return res.render("forgot-pass/verify-code", {
      error: "Ocurrió un error",
      success: null,
    });
  }
};

export const mostrarResetPassword = (req, res) => {
  const passwordReset = req.session.passwordReset;

  if (!passwordReset || !passwordReset.verificado) {
    return res.redirect("/forgot-password");
  }

  return res.render("forgot-pass/reset-password", {
    error: null,
    success: null,
  });
};

export const resetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;

  try {
    const passwordReset = req.session.passwordReset;

    if (!passwordReset || !passwordReset.verificado) {
      return res.redirect("/forgot-password");
    }

    if (Date.now() > passwordReset.expiresAt) {
      delete req.session.passwordReset;

      return res.redirect("/forgot-password");
    }

    if (!password || !confirmPassword) {
      return res.render("forgot-pass/reset-password", {
        error: "Todos los campos son obligatorios",
        success: null,
      });
    }

    if (password !== confirmPassword) {
      return res.render("forgot-pass/reset-password", {
        error: "Las contraseñas no coinciden",
        success: null,
      });
    }

    if (password.length < 8) {
      return res.render("forgot-pass/reset-password", {
        error: "La contraseña debe tener al menos 8 caracteres",
        success: null,
      });
    }

    const user = await User.findOne({
      where: {
        id_usuario: passwordReset.userId,
        estado: 1,
      },
    });

    if (!user) {
      delete req.session.passwordReset;

      return res.redirect("/forgot-password");
    }

    user.password = await bcrypt.hash(password, 12);

    await user.save();

    delete req.session.passwordReset;

    return res.render("login/login", {
      error: null,
      success:
        "Contraseña actualizada correctamente. Ya puedes iniciar sesión.",
      email: user.email,
    });
  } catch (error) {
    console.error("Error reset password:", error);

    return res.render("forgot-pass/reset-password", {
      error: "No fue posible actualizar la contraseña",
      success: null,
    });
  }
};

export const logout = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Error cerrando sesión:", error);

      return res.redirect("/dashboard");
    }

    res.clearCookie("connect.sid");

    return res.redirect("/login");
  });
};
