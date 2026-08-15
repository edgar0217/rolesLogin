import Receta from "../models/receta.model.js";

export const mostrarDashboard = async (req, res) => {
  try {
    const recetas = await Receta.findAll({
      limit: 6,
      order: [["createdAt", "DESC"]],
    });

    return res.render("home-menus/dashboard", {
      user: req.session.user,
      recetas,
    });
  } catch (error) {
    console.error("Error al cargar dashboard:", error);

    return res.render("home-menus/dashboard", {
      user: req.session.user,
      recetas: [],
    });
  }
};

export const mostrarRecetas = async (req, res) => {
  try {
    const recetas = await Receta.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.render("home-menus/recetas", {
      user: req.session.user,
      recetas,
    });
  } catch (error) {
    console.error("Error al obtener recetas:", error);

    return res.render("home-menus/recetas", {
      user: req.session.user,
      recetas: [],
    });
  }
};

export const mostrarReceta = async (req, res) => {
  try {
    const { id } = req.params;

    const receta = await Receta.findByPk(id);

    if (!receta) {
      return res.status(404).render("404");
    }

    return res.render("home-menus/receta-detalle", {
      user: req.session.user,
      receta,
    });
  } catch (error) {
    console.error("Error al obtener receta:", error);

    return res.status(500).send("Ocurrió un error al obtener la receta");
  }
};
